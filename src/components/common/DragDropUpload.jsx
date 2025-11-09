import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  Fade,
  Zoom,
  Paper,
  Stack
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Crop as CropIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropDialog from './ImageCropDialog';

const DragDropUpload = ({
  label,
  helperText,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  onFileRemove,
  currentFile,
  uploadProgress = 0,
  error,
  requirements = {},
  multiple = false,
  showPreview = true,
  enableCrop = false,
  cropAspectRatio = null,
  enableCamera = false // Enable camera on mobile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Detect if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Default requirements based on common use cases
  const defaultRequirements = {
    dimensions: requirements.dimensions || 'Any',
    maxSize: requirements.maxSize || formatBytes(maxSize),
    formats: requirements.formats || accept.replace('image/', '').split(',').join(', ').toUpperCase(),
    aspectRatio: requirements.aspectRatio || null,
    minDimensions: requirements.minDimensions || null,
    recommended: requirements.recommended || null
  };

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (!multiple && files.length > 1) {
      files = [files[0]];
    }

    // Validate file size
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // If crop is enabled and it's a single image, show crop dialog
      if (enableCrop && !multiple && validFiles[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTempImageForCrop(e.target.result);
          setShowCropDialog(true);
        };
        reader.readAsDataURL(validFiles[0]);
      } else {
        // Otherwise, pass files directly
        if (multiple) {
          onFileSelect(validFiles);
        } else {
          onFileSelect(validFiles[0]);
        }
      }
    }
  };

  const handleCropComplete = (croppedFile) => {
    onFileSelect(croppedFile);
    setShowCropDialog(false);
    setTempImageForCrop(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFilePreview = () => {
    if (!currentFile) return null;
    
    if (typeof currentFile === 'string') {
      return currentFile;
    }
    
    return URL.createObjectURL(currentFile);
  };

  const renderRequirements = () => (
    <AnimatePresence>
      {showRequirements && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'info.lighter',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.light'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} color="info.dark">
                Image Requirements
              </Typography>
              <IconButton size="small" onClick={() => setShowRequirements(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Stack spacing={1}>
              {defaultRequirements.recommended && (
                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Recommended Size:
                  </Typography>
                  <Typography variant="caption" display="block" color="text.primary">
                    {defaultRequirements.recommended}
                  </Typography>
                </Box>
              )}
              
              {defaultRequirements.minDimensions && (
                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Minimum Dimensions:
                  </Typography>
                  <Typography variant="caption" display="block" color="text.primary">
                    {defaultRequirements.minDimensions}
                  </Typography>
                </Box>
              )}
              
              {defaultRequirements.aspectRatio && (
                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Aspect Ratio:
                  </Typography>
                  <Typography variant="caption" display="block" color="text.primary">
                    {defaultRequirements.aspectRatio}
                  </Typography>
                </Box>
              )}
              
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Max File Size:
                </Typography>
                <Typography variant="caption" display="block" color="text.primary">
                  {defaultRequirements.maxSize}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Accepted Formats:
                </Typography>
                <Typography variant="caption" display="block" color="text.primary">
                  {defaultRequirements.formats}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {label}
        </Typography>
      )}

      <motion.div
        animate={{
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Paper
          elevation={isDragging ? 8 : 1}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          sx={{
            position: 'relative',
            minHeight: showPreview && currentFile ? 200 : 150,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: error
              ? 'error.main'
              : isDragging
              ? 'primary.main'
              : currentFile
              ? 'success.main'
              : 'grey.300',
            borderRadius: 2,
            bgcolor: error
              ? 'error.lighter'
              : isDragging
              ? 'primary.lighter'
              : currentFile
              ? 'success.lighter'
              : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            '&:hover': {
              borderColor: error ? 'error.main' : 'primary.main',
              bgcolor: error ? 'error.lighter' : 'primary.lighter',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            multiple={multiple}
            style={{ display: 'none' }}
          />
          
          {/* Separate camera input for mobile */}
          {enableCamera && isMobile && (
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4
              }}
            />
          )}

          {/* Preview or Upload UI */}
          <AnimatePresence mode="wait">
            {currentFile && showPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <img
                    src={getFilePreview()}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: 8
                    }}
                  />
                  
                  {/* Success Badge */}
                  {uploadProgress === 100 && (
                    <Zoom in>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'success.main',
                          borderRadius: '50%',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    </Zoom>
                  )}

                  {/* Delete Button */}
                  <Fade in>
                    <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={handleRemove}
                        sx={{
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'error.dark'
                          }
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      
                      {/* Crop Button */}
                      {enableCrop && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setTempImageForCrop(getFilePreview());
                            setShowCropDialog(true);
                          }}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark'
                            }
                          }}
                          size="small"
                        >
                          <CropIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Fade>

                  {/* File Info */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      right: 10,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: 1,
                      p: 1,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Typography variant="caption" color="white" noWrap>
                      {currentFile?.name || 'Current image'}
                    </Typography>
                    {currentFile?.size && (
                      <Typography variant="caption" color="white" display="block">
                        {formatBytes(currentFile.size)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ textAlign: 'center', padding: '20px' }}
              >
                <motion.div
                  animate={{
                    y: isDragging ? -10 : 0,
                    scale: isDragging ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <UploadIcon
                    sx={{
                      fontSize: 48,
                      color: error ? 'error.main' : isDragging ? 'primary.main' : 'grey.400',
                      mb: 1
                    }}
                  />
                </motion.div>

                <Typography variant="body1" fontWeight={600} color="text.primary" gutterBottom>
                  {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                </Typography>
                
                {/* Mobile Camera Button */}
                {enableCamera && isMobile && !currentFile && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label="📷 Take Photo"
                      color="primary"
                      variant="filled"
                      onClick={(e) => {
                        e.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                      sx={{
                        fontWeight: 600,
                        px: 2,
                        py: 2.5,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.2s'
                        }
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip
                    size="small"
                    label={defaultRequirements.formats}
                    icon={<ImageIcon />}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={`Max ${defaultRequirements.maxSize}`}
                    variant="outlined"
                  />
                  {defaultRequirements.recommended && (
                    <Chip
                      size="small"
                      label={defaultRequirements.recommended}
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRequirements(!showRequirements);
                  }}
                >
                  <InfoIcon fontSize="small" />
                  {showRequirements ? 'Hide' : 'View'} detailed requirements
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
      </motion.div>

      {/* Requirements Panel */}
      {renderRequirements()}

      {/* Helper Text */}
      {helperText && !error && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}

      {/* Error Message */}
      {error && (
        <Fade in>
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Image Crop Dialog */}
      {enableCrop && (
        <ImageCropDialog
          open={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            setTempImageForCrop(null);
          }}
          imageSrc={tempImageForCrop}
          onCropComplete={handleCropComplete}
          aspectRatio={cropAspectRatio}
          title={`Crop ${label || 'Image'}`}
        />
      )}
    </Box>
  );
};

export default DragDropUpload;
