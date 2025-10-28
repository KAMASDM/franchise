import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

const ImageUpload = ({
  label,
  value,
  onChange,
  path = 'brands',
  helperText,
  required = false,
  multiple = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      if (multiple) {
        // Handle multiple file upload
        const uploadPromises = Array.from(files).map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name}`;
          const storageRef = ref(storage, `${path}/${fileName}`);
          
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return url;
        });

        const urls = await Promise.all(uploadPromises);
        const currentUrls = Array.isArray(value) ? value : [];
        onChange([...currentUrls, ...urls]);
      } else {
        // Handle single file upload
        const file = files[0];
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `${path}/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        onChange(url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (urlToRemove) => {
    if (multiple) {
      const currentUrls = Array.isArray(value) ? value : [];
      onChange(currentUrls.filter((url) => url !== urlToRemove));
    } else {
      onChange('');
    }
  };

  const renderPreview = () => {
    if (multiple) {
      const urls = Array.isArray(value) ? value : [];
      if (urls.length === 0) return null;

      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {urls.map((url, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={url}
                alt={`Upload ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(url)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      );
    } else {
      if (!value) return null;

      return (
        <Paper
          elevation={2}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 300,
            height: 200,
            overflow: 'hidden',
            mt: 2,
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Upload preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <IconButton
            size="small"
            onClick={() => handleRemove(value)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            }}
          >
            <Delete />
          </IconButton>
        </Paper>
      );
    }
  };

  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        {label} {required && '*'}
      </Typography>
      
      {helperText && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          {helperText}
        </Typography>
      )}

      <Button
        variant="outlined"
        component="label"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        disabled={uploading}
        fullWidth
      >
        {uploading
          ? 'Uploading...'
          : multiple
          ? 'Upload Images'
          : value
          ? 'Change Image'
          : 'Upload Image'}
        <input
          type="file"
          hidden
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {renderPreview()}

      {!value && !uploading && (
        <Box
          sx={{
            mt: 2,
            p: 3,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            textAlign: 'center',
            bgcolor: 'action.hover',
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {multiple ? 'No images uploaded yet' : 'No image uploaded yet'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
