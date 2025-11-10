import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Professional Brand Brochure Generator
 * Creates a beautiful PDF brochure from brand data
 */
export class BrandBrochureGenerator {
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  /**
   * Generate complete brand brochure PDF
   * @param {Object} brandData - Complete brand information
   * @returns {Promise<Blob>} PDF blob for download
   */
  async generateBrochure(brandData) {
    try {
      this.doc = new jsPDF('p', 'mm', 'a4');
      
      // Page 1: Cover Page
      await this.createCoverPage(brandData);
      
      // Page 2: Brand Overview
      this.addNewPage();
      await this.createBrandOverviewPage(brandData);
      
      // Page 3: Investment & Business Model
      this.addNewPage();
      await this.createInvestmentPage(brandData);
      
      // Page 4: Support & Training
      this.addNewPage();
      await this.createSupportPage(brandData);
      
      // Page 5: Contact & Next Steps
      this.addNewPage();
      await this.createContactPage(brandData);
      
      // Generate and return PDF
      const pdfBlob = this.doc.output('blob');
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF brochure:', error);
      throw new Error('Failed to generate brochure PDF');
    }
  }

  /**
   * Create an attractive cover page
   */
  async createCoverPage(brandData) {
    const { brandName, category, brandLogo, brandImage } = brandData;
    
    // Background gradient effect (simulate with rectangles)
    this.doc.setFillColor(245, 247, 255);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Header section
    this.doc.setFillColor(88, 118, 169);
    this.doc.rect(0, 0, this.pageWidth, 80, 'F');
    
    // Brand logo (if available)
    if (brandLogo) {
      try {
        await this.addImageFromUrl(brandLogo, this.margin, 15, 40, 40);
      } catch (error) {
        console.log('Could not load brand logo, using text instead');
      }
    }
    
    // Brand name and tagline
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(brandName, this.margin + 50, 35);
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${category} Franchise Opportunity`, this.margin + 50, 50);
    
    // Franchise opportunity badge
    this.doc.setFillColor(255, 193, 7);
    this.doc.roundedRect(this.margin, 90, this.contentWidth, 25, 3, 3, 'F');
    this.doc.setTextColor(33, 37, 41);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FRANCHISE OPPORTUNITY', this.pageWidth/2, 105, { align: 'center' });
    
    // Main brand image
    if (brandImage) {
      try {
        await this.addImageFromUrl(brandImage, this.margin, 130, this.contentWidth, 80);
      } catch (error) {
        // Create placeholder rectangle
        this.doc.setFillColor(229, 231, 235);
        this.doc.rect(this.margin, 130, this.contentWidth, 80, 'F');
        this.doc.setTextColor(107, 114, 128);
        this.doc.setFontSize(14);
        this.doc.text('Brand Image', this.pageWidth/2, 175, { align: 'center' });
      }
    }
    
    // Key highlights section
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(this.margin, 220, this.contentWidth, 60, 5, 5, 'F');
    
    this.doc.setTextColor(33, 37, 41);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Why Choose This Franchise?', this.margin + 10, 235);
    
    const highlights = [
      `✓ Proven Business Model in ${category}`,
      '✓ Comprehensive Training & Support',
      '✓ Protected Territory Rights',
      '✓ Marketing & Operational Assistance'
    ];
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    highlights.forEach((highlight, index) => {
      this.doc.text(highlight, this.margin + 15, 250 + (index * 6));
    });
  }

  /**
   * Create brand overview page
   */
  async createBrandOverviewPage(brandData) {
    const { brandName, brandStory, brandHistory, foundedYear, headquarters } = brandData;
    
    // Page header
    this.addPageHeader('Brand Overview', brandName);
    
    let yPosition = 60;
    
    // Brand story section
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('Our Story', this.margin, yPosition);
    yPosition += 15;
    
    if (brandStory) {
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(33, 37, 41);
      const storyLines = this.doc.splitTextToSize(brandStory, this.contentWidth);
      this.doc.text(storyLines, this.margin, yPosition);
      yPosition += storyLines.length * 5 + 10;
    }
    
    // Company facts section
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 40, 3, 3, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('Company Facts', this.margin + 10, yPosition + 15);
    
    const facts = [
      foundedYear ? `Founded: ${foundedYear}` : 'Established Business',
      headquarters ? `Headquarters: ${headquarters}` : 'Professional Management',
      'Industry: ' + (brandData.category || 'Franchise Business')
    ];
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(33, 37, 41);
    facts.forEach((fact, index) => {
      this.doc.text(fact, this.margin + 15, yPosition + 25 + (index * 5));
    });
    
    yPosition += 60;
    
    // Business highlights
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('What Makes Us Different', this.margin, yPosition);
    yPosition += 15;
    
    const differentiators = [
      'Proven track record of success',
      'Comprehensive franchise support system',
      'Strong brand recognition and marketing',
      'Ongoing training and development programs',
      'Protected territory and exclusive rights'
    ];
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(33, 37, 41);
    differentiators.forEach((point, index) => {
      this.doc.text(`• ${point}`, this.margin + 5, yPosition + (index * 8));
    });
  }

  /**
   * Create investment and business model page
   */
  async createInvestmentPage(brandData) {
    const { brandName, investmentRange, businessModels, revenueModel, expectedROI } = brandData;
    
    this.addPageHeader('Investment Details', brandName);
    
    let yPosition = 60;
    
    // Investment overview
    this.doc.setFillColor(220, 252, 231);
    this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 35, 5, 5, 'F');
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(22, 101, 52);
    this.doc.text('Investment Required', this.margin + 10, yPosition + 15);
    
    this.doc.setFontSize(24);
    this.doc.text(investmentRange || 'Contact for Details', this.margin + 10, yPosition + 28);
    
    yPosition += 50;
    
    // Business model section
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('Business Model', this.margin, yPosition);
    yPosition += 15;
    
    if (businessModels && businessModels.length > 0) {
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(33, 37, 41);
      businessModels.forEach((model, index) => {
        this.doc.text(`• ${model}`, this.margin + 5, yPosition + (index * 6));
      });
      yPosition += businessModels.length * 6 + 10;
    }
    
    // Revenue model
    if (revenueModel) {
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(88, 118, 169);
      this.doc.text('Revenue Model', this.margin, yPosition);
      yPosition += 15;
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(33, 37, 41);
      this.doc.text(revenueModel, this.margin, yPosition);
      yPosition += 20;
    }
    
    // ROI section
    if (expectedROI) {
      this.doc.setFillColor(254, 243, 199);
      this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 25, 3, 3, 'F');
      
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(146, 64, 14);
      this.doc.text(`Expected ROI: ${expectedROI}%`, this.margin + 10, yPosition + 16);
      
      yPosition += 35;
    }
    
    // Investment breakdown table
    this.createInvestmentBreakdownTable(yPosition, brandData);
  }

  /**
   * Create support and training page
   */
  async createSupportPage(brandData) {
    const { brandName, supportTypes } = brandData;
    
    this.addPageHeader('Support & Training', brandName);
    
    let yPosition = 60;
    
    // Support overview
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('Comprehensive Franchise Support', this.margin, yPosition);
    yPosition += 20;
    
    // Support categories with icons (text-based)
    const supportCategories = [
      {
        title: '📚 Training & Education',
        items: ['Initial franchise training program', 'Ongoing skill development', 'Operations manual and procedures', 'Online learning resources']
      },
      {
        title: '📈 Marketing Support',
        items: ['Brand marketing materials', 'Digital marketing assistance', 'Local advertising support', 'Grand opening marketing']
      },
      {
        title: '🛠️ Operational Support',
        items: ['Site selection assistance', 'Store setup and design', 'Inventory management', '24/7 helpdesk support']
      },
      {
        title: '💰 Financial Guidance',
        items: ['Financial planning assistance', 'Accounting system setup', 'Performance monitoring', 'Growth strategy planning']
      }
    ];
    
    supportCategories.forEach((category, index) => {
      // Category title
      this.doc.setFillColor(248, 249, 250);
      this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 10, 2, 2, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(88, 118, 169);
      this.doc.text(category.title, this.margin + 5, yPosition + 7);
      yPosition += 15;
      
      // Category items
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(33, 37, 41);
      category.items.forEach((item, itemIndex) => {
        this.doc.text(`• ${item}`, this.margin + 10, yPosition + (itemIndex * 5));
      });
      yPosition += (category.items.length * 5) + 10;
      
      // Add new page if needed
      if (yPosition > 250 && index < supportCategories.length - 1) {
        this.addNewPage();
        this.addPageHeader('Support & Training (Continued)', brandName);
        yPosition = 60;
      }
    });
  }

  /**
   * Create contact and next steps page
   */
  async createContactPage(brandData) {
    const { brandName, contactInfo, brandOwnerInformation } = brandData;
    
    this.addPageHeader('Contact & Next Steps', brandName);
    
    let yPosition = 60;
    
    // Next steps section
    this.doc.setFillColor(239, 246, 255);
    this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 60, 5, 5, 'F');
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(29, 78, 216);
    this.doc.text('Ready to Get Started?', this.margin + 10, yPosition + 15);
    
    const nextSteps = [
      '1. Submit your franchise inquiry through our platform',
      '2. Schedule a discovery call with our franchise team',
      '3. Review the Franchise Disclosure Document (FDD)',
      '4. Complete financial qualification process',
      '5. Sign franchise agreement and begin training'
    ];
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(29, 78, 216);
    nextSteps.forEach((step, index) => {
      this.doc.text(step, this.margin + 15, yPosition + 25 + (index * 6));
    });
    
    yPosition += 75;
    
    // Contact information
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 50, 5, 5, 'F');
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('Contact Information', this.margin + 10, yPosition + 15);
    
    // Contact details
    const contacts = [
      `Email: ${brandOwnerInformation?.email || 'contact@ikama.in'}`,
      `Phone: ${brandOwnerInformation?.phone || '+91-XXXX-XXXX'}`,
      'Website: https://ikama.in',
      'Platform: ikama - India\'s Premier Franchise Hub'
    ];
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(33, 37, 41);
    contacts.forEach((contact, index) => {
      this.doc.text(contact, this.margin + 15, yPosition + 28 + (index * 6));
    });
    
    yPosition += 65;
    
    // Call to action
    this.doc.setFillColor(34, 197, 94);
    this.doc.roundedRect(this.margin, yPosition, this.contentWidth, 20, 5, 5, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Start Your Franchise Journey Today!', this.pageWidth/2, yPosition + 13, { align: 'center' });
    
    // Footer
    yPosition += 35;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(107, 114, 128);
    this.doc.text('This brochure is generated automatically by ikama platform. For the most current information, please visit our website.', 
                   this.pageWidth/2, yPosition, { align: 'center' });
  }

  /**
   * Helper method to add page header
   */
  addPageHeader(title, brandName) {
    this.doc.setFillColor(88, 118, 169);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 20);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(brandName, this.margin, 32);
    
    // ikama logo/branding
    this.doc.setFontSize(10);
    this.doc.text('ikama', this.pageWidth - this.margin, 25, { align: 'right' });
  }

  /**
   * Helper method to add new page
   */
  addNewPage() {
    this.doc.addPage();
  }

  /**
   * Helper method to add image from URL
   */
  async addImageFromUrl(imageUrl, x, y, width, height) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width * 4; // Higher resolution
          canvas.height = height * 4;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          this.doc.addImage(dataUrl, 'JPEG', x, y, width, height);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  }

  /**
   * Create investment breakdown table
   */
  createInvestmentBreakdownTable(yPosition, brandData) {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(88, 118, 169);
    this.doc.text('Investment Breakdown', this.margin, yPosition);
    yPosition += 10;
    
    // Table header
    this.doc.setFillColor(248, 249, 250);
    this.doc.rect(this.margin, yPosition, this.contentWidth, 8, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(33, 37, 41);
    this.doc.text('Component', this.margin + 2, yPosition + 6);
    this.doc.text('Range', this.margin + 100, yPosition + 6);
    yPosition += 8;
    
    // Table rows
    const investmentComponents = [
      { component: 'Initial Franchise Fee', range: brandData.franchiseFee || 'Contact for details' },
      { component: 'Equipment & Setup', range: brandData.equipmentCost || 'Varies by location' },
      { component: 'Initial Marketing', range: brandData.marketingCost || 'Included in package' },
      { component: 'Working Capital', range: brandData.workingCapital || '3-6 months operating expenses' },
      { component: 'Total Investment', range: brandData.investmentRange || 'Contact for details' }
    ];
    
    this.doc.setFont('helvetica', 'normal');
    investmentComponents.forEach((item, index) => {
      if (index === investmentComponents.length - 1) {
        this.doc.setFillColor(254, 243, 199);
        this.doc.rect(this.margin, yPosition, this.contentWidth, 6, 'F');
        this.doc.setFont('helvetica', 'bold');
      }
      
      this.doc.text(item.component, this.margin + 2, yPosition + 4);
      this.doc.text(item.range, this.margin + 100, yPosition + 4);
      yPosition += 6;
      
      if (index === investmentComponents.length - 1) {
        this.doc.setFont('helvetica', 'normal');
      }
    });
  }

  /**
   * Generate filename for the brochure
   */
  static generateFilename(brandName) {
    const sanitizedName = brandName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    return `${sanitizedName}_Franchise_Brochure_${timestamp}.pdf`;
  }
}

export default BrandBrochureGenerator;