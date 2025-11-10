import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import BrandBrochureGenerator from '../utils/BrandBrochureGenerator';
import { storage } from '../firebase/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  getMetadata 
} from 'firebase/storage';
import logger from '../utils/logger';

/**
 * Automatic Brochure Generation Service
 * Generates PDF brochures for approved brands
 */
export class AutoBrochureService {
  
  /**
   * Generate and store brochure when brand is approved
   * @param {string} brandId - Brand document ID
   * @param {Object} brandData - Brand data object
   */
  static async generateAndStoreBrochure(brandId, brandData) {
    try {
      console.log(`🔄 Auto-generating brochure for brand: ${brandData.brandName}`);
      
      // Generate PDF brochure
      const generator = new BrandBrochureGenerator();
      const pdfBlob = await generator.generateBrochure(brandData);
      
      // Upload to Firebase Storage
      const filename = BrandBrochureGenerator.generateFilename(brandData.brandName);
      const storageRef = ref(storage, `brochures/${brandId}/${filename}`);
      
      const uploadResult = await uploadBytes(storageRef, pdfBlob, {
        contentType: 'application/pdf',
        customMetadata: {
          brandId: brandId,
          brandName: brandData.brandName,
          generatedAt: new Date().toISOString(),
          version: '1.0'
        }
      });
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      // Update brand document with brochure information
      const brandRef = doc(db, 'brands', brandId);
      await updateDoc(brandRef, {
        brochure: {
          url: downloadURL,
          filename: filename,
          generatedAt: new Date(),
          size: pdfBlob.size,
          version: '1.0'
        }
      });
      
      logger.info(`✅ Brochure generated and stored for brand: ${brandData.brandName}`);
      logger.info(`📄 Download URL: ${downloadURL}`);
      
      return {
        success: true,
        downloadURL,
        filename,
        size: pdfBlob.size
      };
      
    } catch (error) {
      logger.error(`❌ Failed to generate brochure for brand ${brandData.brandName}:`, error);
      
      // Update brand with error information (don't block the approval process)
      try {
        const brandRef = doc(db, 'brands', brandId);
        await updateDoc(brandRef, {
          brochure: {
            error: error.message,
            failedAt: new Date()
          }
        });
      } catch (updateError) {
        logger.error('Failed to update brand with brochure error:', updateError);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Regenerate brochure for existing brand (manual trigger)
   * @param {string} brandId - Brand document ID
   */
  static async regenerateBrochure(brandId) {
    try {
      // Fetch brand data
      const brandRef = doc(db, 'brands', brandId);
      const brandDoc = await getDoc(brandRef);
      
      if (!brandDoc.exists()) {
        throw new Error('Brand not found');
      }
      
      const brandData = { id: brandId, ...brandDoc.data() };
      
      // Generate new brochure
      return await this.generateAndStoreBrochure(brandId, brandData);
      
    } catch (error) {
      logger.error(`❌ Failed to regenerate brochure for brand ${brandId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if brand has all required data for brochure generation
   * @param {Object} brandData - Brand data object
   * @returns {boolean} Whether brand data is sufficient
   */
  static validateBrandDataForBrochure(brandData) {
    const requiredFields = ['brandName', 'category'];
    const recommendedFields = ['brandStory', 'investmentRange', 'businessModels'];
    
    // Check required fields
    const hasRequiredFields = requiredFields.every(field => 
      brandData[field] && brandData[field].toString().trim() !== ''
    );
    
    if (!hasRequiredFields) {
      return {
        valid: false,
        missing: requiredFields.filter(field => !brandData[field]),
        message: 'Missing required fields for brochure generation'
      };
    }
    
    // Check recommended fields
    const missingRecommended = recommendedFields.filter(field => 
      !brandData[field] || brandData[field].toString().trim() === ''
    );
    
    if (missingRecommended.length > 0) {
      return {
        valid: true,
        warning: true,
        missing: missingRecommended,
        message: 'Some recommended fields are missing, brochure may be less informative'
      };
    }
    
    return {
      valid: true,
      message: 'Brand data is complete for brochure generation'
    };
  }

  /**
   * Get brochure download statistics
   * @param {string} brandId - Brand document ID
   */
  static async getBrochureStats(brandId) {
    try {
      const brandRef = doc(db, 'brands', brandId);
      const brandDoc = await getDoc(brandRef);
      
      if (!brandDoc.exists()) {
        return { exists: false };
      }
      
      const brandData = brandDoc.data();
      const brochure = brandData.brochure;
      
      if (!brochure || !brochure.url) {
        return { 
          exists: false,
          canGenerate: this.validateBrandDataForBrochure(brandData).valid
        };
      }
      
      return {
        exists: true,
        url: brochure.url,
        filename: brochure.filename,
        generatedAt: brochure.generatedAt,
        size: brochure.size,
        version: brochure.version,
        canRegenerate: true
      };
      
    } catch (error) {
      logger.error(`Error getting brochure stats for brand ${brandId}:`, error);
      return { exists: false, error: error.message };
    }
  }

  /**
   * Delete brochure from storage and brand document
   * @param {string} brandId - Brand document ID
   */
  static async deleteBrochure(brandId) {
    try {
      const brandRef = doc(db, 'brands', brandId);
      const brandDoc = await getDoc(brandRef);
      
      if (!brandDoc.exists()) {
        throw new Error('Brand not found');
      }
      
      const brandData = brandDoc.data();
      const brochure = brandData.brochure;
      
      if (!brochure || !brochure.filename) {
        throw new Error('No brochure found to delete');
      }
      
      // Delete from Firebase Storage
      const storageRef = ref(storage, `brochures/${brandId}/${brochure.filename}`);
      await deleteObject(storageRef);
      
      // Remove from brand document
      await updateDoc(brandRef, {
        brochure: null
      });
      
      logger.info(`🗑️ Brochure deleted for brand: ${brandData.brandName}`);
      
      return { success: true };
      
    } catch (error) {
      logger.error(`❌ Failed to delete brochure for brand ${brandId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get brochure statistics and metadata
   * @param {string} brandId - Brand document ID
   * @returns {Object} Brochure stats including existence, URL, size, etc.
   */
  static async getBrochureStats(brandId) {
    try {
      const brochureRef = ref(storage, `brochures/${brandId}.pdf`);
      const metadata = await getMetadata(brochureRef);
      const url = await getDownloadURL(brochureRef);
      
      return {
        exists: true,
        url: url,
        size: metadata.size,
        generatedAt: metadata.timeCreated ? new Date(metadata.timeCreated) : null,
        contentType: metadata.contentType
      };
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return {
          exists: false,
          url: null,
          size: 0,
          generatedAt: null,
          contentType: null
        };
      }
      throw error;
    }
  }

  /**
   * Helper method to get brochure URL if it exists
   * @param {string} brandId - Brand document ID
   * @returns {string|null} Download URL or null if not found
   */
  static async getBrochureUrl(brandId) {
    try {
      const brochureRef = ref(storage, `brochures/${brandId}.pdf`);
      return await getDownloadURL(brochureRef);
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return null;
      }
      throw error;
    }
  }
}

export default AutoBrochureService;