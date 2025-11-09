import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';

const WelcomeTour = ({ open, onClose, onStart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Brand Registration',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Join Our Franchise Network
          </Typography>
          <Typography variant="body1" paragraph>
            We're excited to help you expand your business! This registration process 
            will guide you through providing all necessary information about your franchise opportunity.
          </Typography>
          
          <Paper elevation={0} sx={{ bgcolor: 'primary.lighter', p: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TimeIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  Estimated Time: 15-20 minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Take your time - your progress is automatically saved every 30 seconds
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )
    },
    {
      title: '7 Easy Steps',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Your registration is divided into easy-to-follow steps:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary="1. Business Model Selection"
                secondary="Choose your partnership type (Franchise, Dealership, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary="2. Basic Information"
                secondary="Brand details, contact info, and logo"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><HandshakeIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary="3. Partnership Details"
                secondary="Terms, fees, and revenue models"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><MoneyIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary="4. Investment Requirements"
                secondary="Financial details and costs"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary="5. Training & Support"
                secondary="Partner requirements and support programs"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ImageIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary="6. Gallery & Final Details"
                secondary="Upload images and brand story"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary="7. Review & Submit"
                secondary="Final review before submission"
              />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      title: 'Documents You\'ll Need',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Please prepare these items before starting:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2">Brand Logo</Typography>}
                secondary="Square format, minimum 512x512px, max 5MB (PNG, JPG, or WebP)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2">Brand Banner (Optional)</Typography>}
                secondary="Recommended 1920x600px for best display"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2">Gallery Images (3-5 recommended)</Typography>}
                secondary="Photos of outlets, products, or facilities"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2">Financial Details</Typography>}
                secondary="Franchise fees, royalties, investment ranges, etc."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2">Legal Information</Typography>}
                secondary="Agreement type, terms, territory rights"
              />
            </ListItem>
          </List>

          <Paper elevation={0} sx={{ bgcolor: 'warning.lighter', p: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>💡 Pro Tip:</strong> Have all documents ready to complete the 
              registration in one session. Don't worry though - your progress is auto-saved!
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      title: 'Key Features',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Features to help you complete registration smoothly:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary="Auto-Save Every 30 Seconds"
                secondary="Your work is never lost - we save your progress automatically"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary="Draft Recovery"
                secondary="If you leave and come back, we'll ask if you want to continue from where you left off"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary="Real-Time Validation"
                secondary="Get instant feedback on your inputs with helpful error messages"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary="Image Compression"
                secondary="We automatically optimize your images for faster upload"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText
                primary="Review Before Submit"
                secondary="Check all your information before final submission"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Paper elevation={0} sx={{ bgcolor: 'info.lighter', p: 2 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              What Happens After Submission?
            </Typography>
            <Typography variant="body2">
              • Your submission is reviewed by our team within <strong>24-48 hours</strong><br />
              • You'll receive an email notification about the status<br />
              • Once approved, your brand will be visible to potential franchise partners<br />
              • You can track your status in the dashboard
            </Typography>
          </Paper>
        </Box>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onStart();
      onClose();
    }
  };

  const handleBack = () => {
    setCurrentSlide(prev => prev - 1);
  };

  const handleSkip = () => {
    onStart();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            {slides[currentSlide].title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={currentSlide} alternativeLabel>
            {slides.map((slide, index) => (
              <Step key={index}>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {slides[currentSlide].content}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button onClick={handleSkip} color="inherit">
          Skip Tour
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleBack}
            disabled={currentSlide === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeTour;
