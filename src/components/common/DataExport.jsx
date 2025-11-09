import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Download as DownloadIcon,
  Description as JsonIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as analytics from '../../utils/analytics';

const DataExport = ({ formData, fileName = 'brand-registration', disabled = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const exportAsJSON = () => {
    try {
      setLoading(true);
      
      // Create a clean copy of form data
      const exportData = {
        ...formData,
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      };

      // Convert to JSON string with formatting
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('JSON file downloaded successfully!');
      analytics.trackDataExport('JSON');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      showNotification('Failed to export JSON file', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportAsPDF = () => {
    try {
      setLoading(true);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Brand Registration Form', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Subtitle
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Business Model Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Business Model', 14, yPos);
      yPos += 8;

      const businessModelData = [
        ['Business Type', formData.businessModelType || 'N/A']
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: businessModelData,
        theme: 'grid',
        headStyles: { fillColor: [90, 118, 169], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Basic Information Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Basic Information', 14, yPos);
      yPos += 8;

      const basicInfoData = [
        ['Brand Name', formData.brandName || 'N/A'],
        ['Email', formData.brandEmail || 'N/A'],
        ['Phone', formData.brandPhone || 'N/A'],
        ['Website', formData.brandWebsite || 'N/A'],
        ['Industries', Array.isArray(formData.industries) ? formData.industries.join(', ') : 'N/A'],
        ['Description', formData.brandDescription || 'N/A']
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: basicInfoData,
        theme: 'grid',
        headStyles: { fillColor: [90, 118, 169], textColor: 255 },
        margin: { left: 14, right: 14 },
        columnStyles: { 1: { cellWidth: 'auto' } }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Financial Details Section
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Details', 14, yPos);
      yPos += 8;

      const financialData = [
        ['Franchise Fee', formData.franchiseFee || 'N/A'],
        ['Royalty Fee', formData.royaltyFee || 'N/A'],
        ['Marketing Fee', formData.marketingFee || 'N/A'],
        ['Security Deposit', formData.securityDeposit || 'N/A'],
        ['Average Revenue', formData.avgRevenue || 'N/A']
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: financialData,
        theme: 'grid',
        headStyles: { fillColor: [90, 118, 169], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Investment & Space Requirements
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Investment & Space Requirements', 14, yPos);
      yPos += 8;

      const investmentData = [
        ['Investment Range', formData.investmentRange || 'N/A'],
        ['Min Area (sq ft)', formData.areaMin || 'N/A'],
        ['Max Area (sq ft)', formData.areaMax || 'N/A'],
        ['Staff Required', formData.staffRequired || 'N/A'],
        ['Break-even Time', formData.breakEvenTime || 'N/A']
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: investmentData,
        theme: 'grid',
        headStyles: { fillColor: [90, 118, 169], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Training & Support
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Training & Support', 14, yPos);
      yPos += 8;

      const trainingData = [
        ['Training Duration', formData.trainingDuration || 'N/A'],
        ['Training Location', formData.trainingLocation || 'N/A'],
        ['Ongoing Support', formData.ongoingSupport || 'N/A'],
        ['Agreement Length', formData.franchiseAgreementLength || 'N/A'],
        ['Min Age', formData.minAge || 'N/A'],
        ['Education Required', formData.educationRequired || 'N/A'],
        ['Experience Required', formData.experienceRequired || 'N/A']
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: trainingData,
        theme: 'grid',
        headStyles: { fillColor: [90, 118, 169], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Brand Story & Media
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Brand Story & Media', 14, yPos);
      yPos += 8;

      const mediaData = [
        ['Brand Story', formData.brandStory || 'N/A'],
        ['Key Differentiators', formData.keyDifferentiators || 'N/A'],
        ['Company History', formData.companyHistory || 'N/A'],
        ['Brand Logo', formData.brandLogo ? 'Uploaded' : 'Not uploaded'],
        ['Gallery Images', formData.franchiseImages?.length || 0]
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: mediaData,
        theme: 'grid',
        headStyles: { fillColor: [90, 118, 169], textColor: 255 },
        margin: { left: 14, right: 14 },
        columnStyles: { 1: { cellWidth: 'auto' } }
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      doc.save(`${fileName}-${Date.now()}.pdf`);
      showNotification('PDF file downloaded successfully!');
      analytics.trackDataExport('PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showNotification('Failed to export PDF file', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Button
        id="export-button"
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Export Data
      </Button>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={exportAsJSON} disabled={loading}>
          <ListItemIcon>
            <JsonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportAsPDF} disabled={loading}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default DataExport;
