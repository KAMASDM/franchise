import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Save, Videocam, PlayCircleOutline, Close, Delete } from '@mui/icons-material';
import { useDemoVideo, updateDemoVideo } from '../../hooks/useDemoVideo';

/**
 * Admin component for managing the demo video shown in Hero section
 */
const DemoVideoManagement = () => {
  const { demoVideo, loading, error } = useDemoVideo();
  const [formData, setFormData] = useState({
    videoUrl: '',
    thumbnailUrl: '',
    title: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Helper function to convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    
    // Vimeo patterns
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    
    // Already an embed URL or regular video file
    return url;
  };

  const isEmbedVideo = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  // Load existing demo video data
  useEffect(() => {
    if (demoVideo) {
      setFormData({
        videoUrl: demoVideo.videoUrl || '',
        thumbnailUrl: demoVideo.thumbnailUrl || '',
        title: demoVideo.title || '',
        description: demoVideo.description || '',
      });
    }
  }, [demoVideo]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.videoUrl.trim()) {
      setErrorMessage('Video URL is required');
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    const result = await updateDemoVideo(formData);

    if (result.success) {
      setSuccessMessage('Demo video updated successfully! Changes will be visible on the homepage.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage(result.error || 'Failed to update demo video');
    }

    setSaving(false);
  };

  const handleClear = () => {
    setFormData({
      videoUrl: '',
      thumbnailUrl: '',
      title: '',
      description: '',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Videocam sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Demo Video Management
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Configure the demo video shown when users click "Watch Demo" on the homepage
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Alert Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading demo video: {error}
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Video URL */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Video URL *
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Enter YouTube URL (e.g., https://youtube.com/watch?v=...), Vimeo URL, or direct video file URL (MP4, WebM)
              </Typography>
              <TextField
                fullWidth
                placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or https://example.com/video.mp4"
                value={formData.videoUrl}
                onChange={handleChange('videoUrl')}
                variant="outlined"
                required
                helperText="YouTube, Vimeo, and direct video files are supported"
              />
            </Box>

            <Divider />

            {/* Thumbnail URL */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thumbnail URL (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Thumbnail image to show before the video plays
              </Typography>
              <TextField
                fullWidth
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={handleChange('thumbnailUrl')}
                variant="outlined"
              />
              {formData.thumbnailUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}
            </Box>

            <Divider />

            {/* Title */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Video Title (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Title shown in the video dialog
              </Typography>
              <TextField
                fullWidth
                placeholder="Platform Demo - How It Works"
                value={formData.title}
                onChange={handleChange('title')}
                variant="outlined"
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Description (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Brief description of the demo video
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Watch this quick demo to see how our platform helps franchise owners succeed..."
                value={formData.description}
                onChange={handleChange('description')}
                variant="outlined"
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={saving || !formData.videoUrl.trim()}
                sx={{ px: 4 }}
              >
                {saving ? 'Saving...' : 'Save Demo Video'}
              </Button>

              {formData.videoUrl && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleOutline />}
                  onClick={() => setPreviewOpen(true)}
                >
                  Preview Video
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<Delete />}
                onClick={handleClear}
              >
                Clear Form
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Current Demo Video Info */}
      {demoVideo && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Current Demo Video
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Video URL:</strong> {demoVideo.videoUrl}
              </Typography>
              {demoVideo.title && (
                <Typography variant="body2">
                  <strong>Title:</strong> {demoVideo.title}
                </Typography>
              )}
              {demoVideo.description && (
                <Typography variant="body2">
                  <strong>Description:</strong> {demoVideo.description}
                </Typography>
              )}
              {demoVideo.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Updated:</strong>{' '}
                  {new Date(demoVideo.updatedAt.toDate?.() || demoVideo.updatedAt).toLocaleString()}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Video Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <IconButton
          onClick={() => setPreviewOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Box>
            {/* Video Title */}
            {formData.title && (
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h6" fontWeight="bold">
                  {formData.title}
                </Typography>
                {formData.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formData.description}
                  </Typography>
                )}
              </Box>
            )}

            {/* Video Player */}
            <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
              {isEmbedVideo(formData.videoUrl) ? (
                <iframe
                  src={getEmbedUrl(formData.videoUrl)}
                  title={formData.title || 'Demo Video Preview'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              ) : (
                <video
                  src={formData.videoUrl}
                  poster={formData.thumbnailUrl}
                  controls
                  autoPlay
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DemoVideoManagement;
