import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import { QrCode2, Download, Close } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { showToast } from '../../utils/toastUtils';

/**
 * QR Code Generator Component with Branding
 * Generates professional QR codes with brand logo, name, and styled frame
 */

const QRCodeGenerator = ({ 
  value,
  url, // Alternative prop name for value
  brandName,
  brandLogo, // Logo URL
  title = 'Scan QR Code',
  description,
  size = 256,
  buttonVariant = 'outlined',
  open: externalOpen, // External control of dialog
  onClose: externalOnClose, // External close handler
  showButton = true, // Show the trigger button or not
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const qrContainerRef = useRef(null);

  // Use external control if provided, otherwise use internal state
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const handleClose = isControlled ? externalOnClose : () => setInternalOpen(false);
  const handleOpen = () => setInternalOpen(true);

  // Use url prop if value is not provided
  const qrValue = value || url || window.location.href;

  const downloadQR = async () => {
    const container = qrContainerRef.current;
    if (!container) {
      showToast.error('QR Code not found');
      return;
    }

    try {
      // Create a canvas for the branded QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (larger to accommodate branding)
      const padding = 60;
      const headerHeight = brandLogo ? 120 : 80;
      const footerHeight = 80;
      const canvasWidth = size + (padding * 2);
      const canvasHeight = size + headerHeight + footerHeight + (padding * 2);
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#e9ecef');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw decorative border
      ctx.strokeStyle = '#1976d2';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

      // Inner border
      ctx.strokeStyle = '#42a5f5';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

      // Draw brand logo if available
      let yOffset = padding + 20;
      
      if (brandLogo) {
        try {
          const logo = new Image();
          logo.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            logo.onload = () => {
              // Draw logo centered
              const logoSize = 60;
              const logoX = (canvasWidth - logoSize) / 2;
              ctx.save();
              ctx.beginPath();
              ctx.arc(canvasWidth / 2, yOffset + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(logo, logoX, yOffset, logoSize, logoSize);
              ctx.restore();
              
              // Draw circle border around logo
              ctx.strokeStyle = '#1976d2';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(canvasWidth / 2, yOffset + logoSize / 2, logoSize / 2 + 2, 0, Math.PI * 2);
              ctx.stroke();
              
              yOffset += logoSize + 15;
              resolve();
            };
            logo.onerror = () => {
              console.warn('Failed to load logo');
              resolve(); // Continue without logo
            };
            logo.src = brandLogo;
          });
        } catch (error) {
          console.warn('Error loading logo:', error);
        }
      }

      // Draw brand name
      if (brandName) {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brandName, canvasWidth / 2, yOffset);
        yOffset += 15;
      }

      // Draw subtitle
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText('Scan to Learn More', canvasWidth / 2, yOffset);
      yOffset += 30;

      // Get QR code SVG and convert to image
      const svg = document.getElementById('qr-code-svg');
      if (!svg) {
        throw new Error('QR Code SVG not found');
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const qrImg = new Image();
      await new Promise((resolve, reject) => {
        qrImg.onload = () => {
          // Draw white background for QR code
          const qrPadding = 20;
          ctx.fillStyle = 'white';
          ctx.fillRect(
            padding - qrPadding,
            yOffset - qrPadding,
            size + (qrPadding * 2),
            size + (qrPadding * 2)
          );

          // Draw QR code
          ctx.drawImage(qrImg, padding, yOffset, size, size);
          
          // Draw QR code border
          ctx.strokeStyle = '#1976d2';
          ctx.lineWidth = 3;
          ctx.strokeRect(
            padding - qrPadding,
            yOffset - qrPadding,
            size + (qrPadding * 2),
            size + (qrPadding * 2)
          );

          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        qrImg.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Failed to load QR code'));
        };
        qrImg.src = svgUrl;
      });

      yOffset += size + 40;

      // Draw footer text
      ctx.fillStyle = '#1976d2';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillText('Franchise Opportunity', canvasWidth / 2, yOffset);
      
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Point your camera to scan', canvasWidth / 2, yOffset + 25);

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        const filename = brandName 
          ? `${brandName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`
          : `qr-code-${Date.now()}.png`;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        
        showToast.success('Branded QR Code downloaded!');
      }, 'image/png');

    } catch (error) {
      console.error('Error downloading QR code:', error);
      showToast.error('Failed to download QR Code');
    }
  };

  return (
    <>
      {showButton && (
        <Button
          variant={buttonVariant}
          startIcon={<QrCode2 />}
          onClick={handleOpen}
        >
          Generate QR Code
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{brandName ? `${brandName} - QR Code` : title}</Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            ref={qrContainerRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 2,
            }}
          >
            {description && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {description}
              </Typography>
            )}

            {/* Branded QR Code Preview */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '4px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  right: 8,
                  bottom: 8,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  borderRadius: 1,
                  pointerEvents: 'none',
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {/* Brand Logo */}
                {brandLogo && (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid',
                      borderColor: 'primary.main',
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'white',
                    }}
                  >
                    <img
                      src={brandLogo}
                      alt={`${brandName} logo`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}

                {/* Brand Name */}
                {brandName && (
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                  >
                    {brandName}
                  </Typography>
                )}

                {/* Subtitle */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  Scan to Learn More
                </Typography>
              </Box>

              {/* QR Code */}
              <Box
                sx={{
                  bgcolor: 'white',
                  p: 2.5,
                  borderRadius: 1,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  display: 'inline-block',
                }}
              >
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrValue}
                  size={size}
                  level="H"
                  includeMargin={true}
                />
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'bold',
                    mb: 0.5,
                  }}
                >
                  Franchise Opportunity
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Point your camera to scan
                </Typography>
              </Box>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
              Download this professionally branded QR code for your marketing materials
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={downloadQR} startIcon={<Download />} variant="contained">
            Download QR Code
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QRCodeGenerator;
