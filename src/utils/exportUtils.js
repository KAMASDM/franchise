/**
 * Export Utilities
 * Provides functionality to export data to CSV, Excel, and PDF formats
 */

import logger from './logger';

/**
 * Convert array of objects to CSV
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Column definitions (optional)
 * @returns {string} - CSV string
 */
export function convertToCSV(data, columns = null) {
  if (!data || data.length === 0) {
    return '';
  }

  // If no columns specified, use all keys from first object
  const headers = columns || Object.keys(data[0]);

  // Create header row
  const headerRow = headers.map(header => {
    const label = typeof header === 'string' ? header : header.label || header.key;
    return `"${label}"`;
  }).join(',');

  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const key = typeof header === 'string' ? header : header.key;
      const value = row[key];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '""';
      }
      
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');

  return `${headerRow}\n${dataRows}`;
}

/**
 * Download data as CSV file
 * @param {Array} data - Data to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Column definitions (optional)
 */
export function exportToCSV(data, filename = 'export', columns = null) {
  try {
    const csvContent = convertToCSV(data, columns);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
    logger.log(`Exported ${data.length} rows to ${filename}.csv`);
  } catch (error) {
    logger.error('Failed to export CSV:', error);
    throw error;
  }
}

/**
 * Download data as JSON file
 * @param {Array|Object} data - Data to export
 * @param {string} filename - Name of the file (without extension)
 */
export function exportToJSON(data, filename = 'export') {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
    logger.log(`Exported data to ${filename}.json`);
  } catch (error) {
    logger.error('Failed to export JSON:', error);
    throw error;
  }
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Format data for export (clean up Firebase timestamps, etc.)
 * @param {Array} data - Data to format
 * @returns {Array} - Formatted data
 */
export function formatDataForExport(data) {
  return data.map(item => {
    const formatted = { ...item };
    
    // Convert Firestore timestamps to readable dates
    Object.keys(formatted).forEach(key => {
      const value = formatted[key];
      
      // Handle Firestore Timestamp
      if (value && typeof value === 'object' && value.toDate) {
        formatted[key] = value.toDate().toISOString();
      }
      
      // Handle Date objects
      if (value instanceof Date) {
        formatted[key] = value.toISOString();
      }
      
      // Remove complex objects that don't export well
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Keep simple objects, remove complex ones
        try {
          JSON.stringify(value);
        } catch {
          formatted[key] = '[Complex Object]';
        }
      }
    });
    
    return formatted;
  });
}

/**
 * Export leads data with proper formatting
 * @param {Array} leads - Leads data
 * @param {string} filename - Filename
 */
export function exportLeads(leads, filename = 'leads-export') {
  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'budget', label: 'Investment Budget' },
    { key: 'experience', label: 'Business Experience' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'brandName', label: 'Brand Interest' },
    { key: 'status', label: 'Status' },
    { key: 'leadScore', label: 'Lead Score' },
    { key: 'leadGrade', label: 'Grade' },
    { key: 'userCity', label: 'City' },
    { key: 'userState', label: 'State' },
    { key: 'createdAt', label: 'Created Date' },
  ];

  const formattedLeads = formatDataForExport(leads);
  exportToCSV(formattedLeads, filename, columns);
}

/**
 * Export brands data with proper formatting
 * @param {Array} brands - Brands data
 * @param {string} filename - Filename
 */
export function exportBrands(brands, filename = 'brands-export') {
  const columns = [
    { key: 'brandName', label: 'Brand Name' },
    { key: 'brandfoundedYear', label: 'Founded Year' },
    { key: 'status', label: 'Status' },
    { key: 'investmentRange', label: 'Investment Range' },
    { key: 'initialFranchiseFee', label: 'Franchise Fee' },
    { key: 'royaltyFee', label: 'Royalty Fee' },
    { key: 'franchiseModels', label: 'Franchise Models' },
    { key: 'industries', label: 'Industries' },
    { key: 'brandContactEmail', label: 'Contact Email' },
    { key: 'brandContactPhone', label: 'Contact Phone' },
    { key: 'createdAt', label: 'Created Date' },
  ];

  const formattedBrands = formatDataForExport(brands);
  exportToCSV(formattedBrands, filename, columns);
}

/**
 * Export users data with proper formatting
 * @param {Array} users - Users data
 * @param {string} filename - Filename
 */
export function exportUsers(users, filename = 'users-export') {
  const columns = [
    { key: 'displayName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'createdAt', label: 'Joined Date' },
    { key: 'lastLoginAt', label: 'Last Login' },
  ];

  const formattedUsers = formatDataForExport(users);
  exportToCSV(formattedUsers, filename, columns);
}

/**
 * Copy data to clipboard as formatted text
 * @param {Array} data - Data to copy
 * @param {Array} columns - Column definitions
 */
export async function copyToClipboard(data, columns = null) {
  try {
    const csvContent = convertToCSV(data, columns);
    await navigator.clipboard.writeText(csvContent);
    logger.log('Data copied to clipboard');
    return true;
  } catch (error) {
    logger.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Print data as table
 * @param {Array} data - Data to print
 */
export function printData(data) {
  const printWindow = window.open('', '_blank');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print</title>
      <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <button onclick="window.print()">Print</button>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
}

export default {
  convertToCSV,
  exportToCSV,
  exportToJSON,
  formatDataForExport,
  exportLeads,
  exportBrands,
  exportUsers,
  copyToClipboard,
  printData,
};
