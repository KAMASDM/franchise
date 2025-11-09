import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  AutoFixHigh as AutoFillIcon,
  Refresh as RetryIcon,
} from '@mui/icons-material';
import * as ocrService from '../../services/ocrService';

const DocumentOCRDialog = ({ open, onClose, onDataExtracted }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simple progress simulation since worker callbacks don't work reliably
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const result = await ocrService.processDocument(
        file,
        'eng'
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setResult(result);
        
        // Validate extracted data
        const validation = ocrService.validateExtractedData(result);
        setResult(prev => ({ ...prev, validation }));
      } else {
        setError(result.error || 'Failed to process document');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleAutoFill = () => {
    if (result && result.data) {
      onDataExtracted(result.data);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setProcessing(false);
    onClose();
  };

  const handleRetry = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Document OCR Scanner</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Instructions */}
        {!file && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a clear image of your business license, tax ID, or incorporation certificate.
            The system will automatically extract and fill in the relevant information.
          </Alert>
        )}

        {/* File Upload */}
        {!file && (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload Document Image
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports: JPG, PNG, PDF (first page)
              <br />
              Max file size: 10MB
            </Typography>
          </Box>
        )}

        {/* Preview and Processing */}
        {file && (
          <Grid container spacing={2}>
            {/* Image Preview */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Document Preview
                  </Typography>
                  {preview && (
                    <Box
                      component="img"
                      src={preview}
                      alt="Document preview"
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'contain',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    />
                  )}
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Extracted Data
                  </Typography>

                  {processing && (
                    <Box sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Processing document... {progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {result && !processing && (
                    <Box>
                      {/* Document Type */}
                      <Chip
                        label={result.documentType || 'Unknown'}
                        color="primary"
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      {/* Confidence Score */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Confidence: {result.confidence?.toFixed(1)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={result.confidence || 0}
                          color={result.confidence > 70 ? 'success' : 'warning'}
                        />
                      </Box>

                      {/* Validation */}
                      {result.validation && (
                        <>
                          {result.validation.warnings.length > 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                              {result.validation.warnings.map((warning, i) => (
                                <Typography key={i} variant="caption" display="block">
                                  {warning}
                                </Typography>
                              ))}
                            </Alert>
                          )}

                          {result.validation.issues.length > 0 && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                              {result.validation.issues.map((issue, i) => (
                                <Typography key={i} variant="caption" display="block">
                                  {issue}
                                </Typography>
                              ))}
                            </Alert>
                          )}
                        </>
                      )}

                      {/* Extracted Fields */}
                      {result.data && Object.keys(result.data).length > 0 ? (
                        <List dense>
                          {Object.entries(result.data).map(([key, value]) => (
                            <ListItem key={key} sx={{ px: 0 }}>
                              <ListItemText
                                primary={key.replace(/([A-Z])/g, ' $1').trim()}
                                secondary={value}
                                primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Alert severity="info">
                          No structured data could be extracted. Try a clearer image.
                        </Alert>
                      )}

                      {/* Quality Tips */}
                      {result.confidence < 70 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            Tips for better results:
                          </Typography>
                          {ocrService.getImageQualityTips(result.confidence).map((tip, i) => (
                            <Typography key={i} variant="caption" display="block" sx={{ ml: 1 }}>
                              • {tip}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        {file && !result && !processing && (
          <>
            <Button onClick={handleRetry} startIcon={<CloseIcon />}>
              Change Image
            </Button>
            <Button
              variant="contained"
              onClick={handleProcess}
              startIcon={<AutoFillIcon />}
            >
              Scan & Extract
            </Button>
          </>
        )}

        {result && (
          <>
            <Button onClick={handleRetry} startIcon={<RetryIcon />}>
              Try Another
            </Button>
            <Button
              variant="contained"
              onClick={handleAutoFill}
              startIcon={<AutoFillIcon />}
              disabled={!result.data || Object.keys(result.data).length === 0}
            >
              Auto-Fill Form
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DocumentOCRDialog;
