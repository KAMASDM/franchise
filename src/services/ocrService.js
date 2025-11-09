import Tesseract from 'tesseract.js';

/**
 * Document OCR Service
 * Extracts text from uploaded documents using Tesseract.js
 * Supports: Business licenses, certificates, ID cards, etc.
 */

/**
 * OCR Configuration
 */
const OCR_CONFIG = {
  lang: 'eng', // Default language
  logger: (m) => {
    if (m.status === 'recognizing text') {
      console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
    }
  },
};

/**
 * Supported languages for OCR
 */
export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'eng',
  SPANISH: 'spa',
  FRENCH: 'fra',
  HINDI: 'hin',
  GUJARATI: 'guj',
};

/**
 * Document types and their expected fields
 */
export const DOCUMENT_TYPES = {
  BUSINESS_LICENSE: {
    name: 'Business License',
    fields: ['license_number', 'business_name', 'issue_date', 'expiry_date', 'owner_name'],
  },
  TRADE_CERTIFICATE: {
    name: 'Trade Certificate',
    fields: ['certificate_number', 'business_name', 'registration_date', 'industry'],
  },
  TAX_ID: {
    name: 'Tax ID / EIN',
    fields: ['tax_id', 'business_name', 'issue_date'],
  },
  INCORPORATION_CERTIFICATE: {
    name: 'Incorporation Certificate',
    fields: ['company_name', 'registration_number', 'incorporation_date', 'jurisdiction'],
  },
  TRADEMARK_CERTIFICATE: {
    name: 'Trademark Certificate',
    fields: ['trademark_name', 'registration_number', 'class', 'registration_date'],
  },
};

/**
 * Extract text from image file
 * @param {File|string} image - Image file or URL
 * @param {string} language - Language code (default: 'eng')
 * @returns {Promise<Object>} Extracted text and confidence
 */
export const extractTextFromImage = async (image, language = 'eng') => {
  try {
    const worker = await Tesseract.createWorker({
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    await worker.loadLanguage(language);
    await worker.initialize(language);

    const { data } = await worker.recognize(image);
    
    await worker.terminate();

    return {
      success: true,
      text: data.text,
      confidence: data.confidence,
      words: data.words,
      lines: data.lines,
      blocks: data.blocks,
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    return {
      success: false,
      error: error.message,
      text: '',
      confidence: 0,
    };
  }
};

/**
 * Extract text from multiple images
 * @param {Array<File>} images - Array of image files
 * @param {string} language - Language code
 * @returns {Promise<Array>} Array of extraction results
 */
export const extractTextFromMultipleImages = async (images, language = 'eng') => {
  const results = [];

  for (let i = 0; i < images.length; i++) {
    const result = await extractTextFromImage(
      images[i],
      language,
      (m) => {
        if (m.status === 'recognizing text') {
          console.log(`Processing image ${i + 1}/${images.length}: ${Math.round(m.progress * 100)}%`);
        }
      }
    );
    results.push({
      fileName: images[i].name,
      ...result,
    });
  }

  return results;
};

/**
 * Parse business license data from extracted text
 * @param {string} text - Extracted text
 * @returns {Object} Parsed business license data
 */
export const parseBusinessLicense = (text) => {
  const data = {
    licenseNumber: extractPattern(text, /license\s*(?:number|no|#)?\s*:?\s*([A-Z0-9-]+)/i),
    businessName: extractPattern(text, /business\s*name\s*:?\s*(.+)/i),
    ownerName: extractPattern(text, /owner(?:'s)?\s*name\s*:?\s*(.+)/i),
    issueDate: extractDate(text, /issue(?:d)?\s*(?:date|on)?\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i),
    expiryDate: extractDate(text, /expir(?:y|es|ation)\s*(?:date|on)?\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i),
    address: extractPattern(text, /address\s*:?\s*(.+)/i),
  };

  return cleanData(data);
};

/**
 * Parse tax ID / EIN from extracted text
 * @param {string} text - Extracted text
 * @returns {Object} Parsed tax ID data
 */
export const parseTaxID = (text) => {
  const data = {
    taxId: extractPattern(text, /(?:tax\s*id|ein|federal\s*id)\s*:?\s*([0-9-]+)/i),
    businessName: extractPattern(text, /(?:business|company|legal)\s*name\s*:?\s*(.+)/i),
    issueDate: extractDate(text, /issue(?:d)?\s*(?:date)?\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i),
  };

  return cleanData(data);
};

/**
 * Parse trademark certificate from extracted text
 * @param {string} text - Extracted text
 * @returns {Object} Parsed trademark data
 */
export const parseTrademarkCertificate = (text) => {
  const data = {
    trademarkName: extractPattern(text, /trademark\s*(?:name)?\s*:?\s*(.+)/i),
    registrationNumber: extractPattern(text, /registration\s*(?:number|no)?\s*:?\s*([A-Z0-9-]+)/i),
    class: extractPattern(text, /class\s*:?\s*(\d+)/i),
    registrationDate: extractDate(text, /registration\s*date\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i),
    owner: extractPattern(text, /owner\s*:?\s*(.+)/i),
  };

  return cleanData(data);
};

/**
 * Parse incorporation certificate from extracted text
 * @param {string} text - Extracted text
 * @returns {Object} Parsed incorporation data
 */
export const parseIncorporationCertificate = (text) => {
  const data = {
    companyName: extractPattern(text, /company\s*name\s*:?\s*(.+)/i),
    registrationNumber: extractPattern(text, /(?:registration|company)\s*(?:number|no)?\s*:?\s*([A-Z0-9-]+)/i),
    incorporationDate: extractDate(text, /incorporation\s*date\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i),
    jurisdiction: extractPattern(text, /jurisdiction\s*:?\s*(.+)/i),
    type: extractPattern(text, /(?:company|business)\s*type\s*:?\s*(.+)/i),
  };

  return cleanData(data);
};

/**
 * Auto-detect document type and parse accordingly
 * @param {string} text - Extracted text
 * @returns {Object} Parsed data with detected type
 */
export const autoParseDocument = (text) => {
  const lowerText = text.toLowerCase();

  // Detect document type
  let documentType = 'UNKNOWN';
  let parsedData = {};

  if (lowerText.includes('business license') || lowerText.includes('license number')) {
    documentType = 'BUSINESS_LICENSE';
    parsedData = parseBusinessLicense(text);
  } else if (lowerText.includes('tax id') || lowerText.includes('ein') || lowerText.includes('federal id')) {
    documentType = 'TAX_ID';
    parsedData = parseTaxID(text);
  } else if (lowerText.includes('trademark') || lowerText.includes('registration')) {
    documentType = 'TRADEMARK_CERTIFICATE';
    parsedData = parseTrademarkCertificate(text);
  } else if (lowerText.includes('incorporation') || lowerText.includes('certificate of incorporation')) {
    documentType = 'INCORPORATION_CERTIFICATE';
    parsedData = parseIncorporationCertificate(text);
  }

  return {
    documentType,
    detectedFields: Object.keys(parsedData).filter(key => parsedData[key]),
    data: parsedData,
    rawText: text,
  };
};

/**
 * Process uploaded document with OCR and auto-parsing
 * @param {File} file - Image file
 * @param {string} language - Language code
 * @param {function} progressCallback - Progress callback
 * @returns {Promise<Object>} Processed document data
 */
export const processDocument = async (file, language = 'eng') => {
  // Extract text from image
  const ocrResult = await extractTextFromImage(file, language);

  if (!ocrResult.success) {
    return {
      success: false,
      error: ocrResult.error,
    };
  }

  // Auto-parse the document
  const parsedData = autoParseDocument(ocrResult.text);

  return {
    success: true,
    fileName: file.name,
    confidence: ocrResult.confidence,
    ...parsedData,
  };
};

/**
 * Validate extracted data quality
 * @param {Object} data - Extracted data
 * @returns {Object} Validation result
 */
export const validateExtractedData = (data) => {
  const issues = [];
  const warnings = [];

  // Check confidence level
  if (data.confidence < 60) {
    warnings.push('Low confidence score. Consider re-uploading a clearer image.');
  }

  // Check for missing critical fields
  const criticalFields = ['businessName', 'licenseNumber', 'registrationNumber'];
  const missingFields = criticalFields.filter(field => !data.data || !data.data[field]);
  
  if (missingFields.length > 0) {
    issues.push(`Missing critical information: ${missingFields.join(', ')}`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: data.confidence,
  };
};

/**
 * Helper: Extract pattern from text
 * @private
 */
const extractPattern = (text, pattern) => {
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
};

/**
 * Helper: Extract and parse date
 * @private
 */
const extractDate = (text, pattern) => {
  const match = text.match(pattern);
  if (!match) return null;

  try {
    const dateStr = match[1].trim();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toISOString().split('T')[0];
  } catch {
    return match[1].trim();
  }
};

/**
 * Helper: Clean extracted data (remove null/empty values)
 * @private
 */
const cleanData = (data) => {
  const cleaned = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
};

/**
 * Get suggestions for improving image quality
 * @param {number} confidence - OCR confidence score
 * @returns {Array<string>} Suggestions
 */
export const getImageQualityTips = (confidence) => {
  const tips = [];

  if (confidence < 70) {
    tips.push('Ensure document is well-lit and in focus');
    tips.push('Use a scanner or high-quality camera');
    tips.push('Avoid shadows and glare on the document');
    tips.push('Make sure all text is clearly visible');
    tips.push('Use a contrasting background');
  }

  if (confidence < 50) {
    tips.push('Consider re-scanning the document');
    tips.push('Clean the document before scanning');
    tips.push('Flatten any wrinkles or folds');
  }

  return tips;
};

export default {
  extractTextFromImage,
  extractTextFromMultipleImages,
  parseBusinessLicense,
  parseTaxID,
  parseTrademarkCertificate,
  parseIncorporationCertificate,
  autoParseDocument,
  processDocument,
  validateExtractedData,
  getImageQualityTips,
  SUPPORTED_LANGUAGES,
  DOCUMENT_TYPES,
};
