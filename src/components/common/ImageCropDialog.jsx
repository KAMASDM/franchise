import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  CropSquare as SquareIcon,
  CropLandscape as LandscapeIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon
} from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropDialog = ({
  open,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = null, // null for free crop, 1 for square, 16/9 for landscape
  title = 'Crop Image',
  cropShape = 'rect' // 'rect' or 'round'
}) => {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 5,
    y: 5,
    width: 90,
    height: 90,
    aspect: aspectRatio
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedAspect, setSelectedAspect] = useState(aspectRatio ? 'custom' : 'free');
  const imgRef = useRef(null);

  const aspectRatios = {
    free: null,
    square: 1,
    landscape: 16 / 9,
    portrait: 9 / 16,
    custom: aspectRatio
  };

  const handleAspectChange = (event, newAspect) => {
    if (newAspect !== null) {
      setSelectedAspect(newAspect);
      const newAspectRatio = aspectRatios[newAspect];
      setCrop(prev => ({
        unit: '%',
        x: 5,
        y: 5,
        width: 90,
        height: newAspectRatio ? 90 / newAspectRatio : 90,
        aspect: newAspectRatio
      }));
    }
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
    
    // Set initial crop area if not already set
    if (!completedCrop) {
      const { width, height } = e.currentTarget;
      const cropWidth = width * 0.9;
      const cropHeight = aspectRatio ? cropWidth / aspectRatio : height * 0.9;
      
      setCompletedCrop({
        unit: 'px',
        x: width * 0.05,
        y: height * 0.05,
        width: cropWidth,
        height: cropHeight
      });
    }
  }, [aspectRatio, completedCrop]);

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate crop dimensions
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Set canvas size to crop size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Apply rotation if needed
    if (rotation !== 0) {
      const radians = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(radians));
      const sin = Math.abs(Math.sin(radians));
      
      // Calculate rotated canvas dimensions
      const rotatedWidth = cropWidth * cos + cropHeight * sin;
      const rotatedHeight = cropWidth * sin + cropHeight * cos;
      
      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;
      
      ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
      ctx.rotate(radians);
      ctx.translate(-cropWidth / 2, -cropHeight / 2);
    }

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          blob.name = 'cropped-image.jpg';
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  }, [completedCrop, rotation]);

  const handleSave = async () => {
    try {
      if (!completedCrop) {
        console.error('No crop area selected');
        return;
      }

      if (!imgRef.current) {
        console.error('Image reference not found');
        return;
      }

      const croppedBlob = await getCroppedImg();
      if (croppedBlob) {
        // Convert blob to file
        const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
        console.log('Cropped file created:', file);
        onCropComplete(file);
        onClose();
      } else {
        console.error('Failed to create cropped image blob');
      }
    } catch (error) {
      console.error('Error during crop save:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="crop-dialog-title"
      aria-describedby="crop-dialog-description"
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle id="crop-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Aspect Ratio Selector */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Aspect Ratio
          </Typography>
          <ToggleButtonGroup
            value={selectedAspect}
            exclusive
            onChange={handleAspectChange}
            size="small"
            fullWidth
          >
            <ToggleButton value="free">
              Free
            </ToggleButton>
            <ToggleButton value="square">
              <SquareIcon sx={{ mr: 0.5 }} fontSize="small" />
              Square (1:1)
            </ToggleButton>
            <ToggleButton value="landscape">
              <LandscapeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Landscape (16:9)
            </ToggleButton>
            {aspectRatio && (
              <ToggleButton value="custom">
                Recommended
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </Box>

        {/* Crop Area */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1,
            p: 2,
            minHeight: 400,
            mb: 2
          }}
        >
          {imageSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={crop.aspect}
              circularCrop={cropShape === 'round'}
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
              />
            </ReactCrop>
          ) : (
            <Typography color="text.secondary">No image loaded</Typography>
          )}
        </Box>

        {/* Zoom Control */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Zoom
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ZoomOutIcon color="action" />
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={0.5}
              max={3}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ flexGrow: 1 }}
            />
            <ZoomInIcon color="action" />
          </Box>
        </Box>

        {/* Rotation Control */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="subtitle2">
            Rotation: {rotation}°
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RotateIcon />}
            onClick={handleRotate}
          >
            Rotate 90°
          </Button>
        </Box>

        {/* Help Text */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="caption">
            💡 <strong>Tip:</strong> Drag the corners to adjust the crop area. Use zoom and rotation controls for fine-tuning.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!completedCrop}
        >
          Save & Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropDialog;
