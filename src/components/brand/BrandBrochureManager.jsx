import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  Visibility,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import BrandBrochureGenerator from '../../utils/BrandBrochureGenerator';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

/**
 * Brand Brochure Manager Component
 * Allows brand owners to generate and download professional PDF brochures
 */
const BrandBrochureManager = ({ brand, onSuccess }) => {
  const [generating, setGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateBrochure = async () => {
    setGenerating(true);
    setError('');

    try {
      const generator = new BrandBrochureGenerator();
      const pdfBlob = await generator.generateBrochure(brand);
      setGeneratedPdf(pdfBlob);
      
      toast.success('Brochure generated successfully!');
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error('Error generating brochure:', err);
      setError('Failed to generate brochure. Please try again.');
      toast.error('Failed to generate brochure');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadBrochure = () => {
    if (!generatedPdf) return;

    const filename = BrandBrochureGenerator.generateFilename(brand.brandName);
    const url = URL.createObjectURL(generatedPdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Brochure downloaded successfully!');
  };

  const handlePreviewBrochure = () => {
    if (!generatedPdf) return;
    
    const url = URL.createObjectURL(generatedPdf);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  const isValidBrand = () => {
    return (
      brand.brandName && 
      brand.category && 
      (brand.brandStory || brand.description)
    );
  };

  return (
    <>
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
          }}
        />
        
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PictureAsPdf sx={{ fontSize: 40, mr: 2, color: '#ffeb3b' }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Professional Brochure
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Generate a beautiful PDF brochure for your franchise
              </Typography>
            </Box>
          </Box>

          {!isValidBrand() && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2, backgroundColor: 'rgba(255,193,7,0.2)', color: 'white' }}
            >
              Complete your brand profile to generate a professional brochure
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label="5 Pages"
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="Professional Design"
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="Ready to Share"
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            Our AI-powered brochure generator creates a professional 5-page PDF 
            including your brand story, investment details, support information, 
            and contact details.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {generatedPdf && (
            <Alert 
              severity="success" 
              sx={{ mb: 2, backgroundColor: 'rgba(76,175,80,0.2)', color: 'white' }}
              icon={<CheckCircle />}
            >
              Brochure ready! You can download or preview it below.
            </Alert>
          )}
        </CardContent>

        <CardActions sx={{ position: 'relative', zIndex: 1, gap: 1 }}>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <Download />}
            onClick={handleGenerateBrochure}
            disabled={generating || !isValidBrand()}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            {generating ? 'Generating...' : 'Generate Brochure'}
          </Button>

          {generatedPdf && (
            <>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadBrochure}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Download
              </Button>

              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handlePreviewBrochure}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Preview
              </Button>
            </>
          )}
        </CardActions>
      </MotionCard>

      {/* Brochure Features Info Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Brochure Features</Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Your professional brochure includes:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li><strong>Cover Page:</strong> Brand logo, name, and key highlights</li>
            <li><strong>Brand Overview:</strong> Your story and company facts</li>
            <li><strong>Investment Details:</strong> Costs, business model, and ROI</li>
            <li><strong>Support & Training:</strong> Comprehensive franchise support</li>
            <li><strong>Contact Information:</strong> Next steps and contact details</li>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BrandBrochureManager;