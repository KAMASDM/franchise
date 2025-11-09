import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const ValidationSummaryModal = ({
  open,
  onClose,
  errors = {},
  steps = [],
  currentStep,
  onJumpToStep,
  onFixErrors
}) => {
  const [expandedStep, setExpandedStep] = useState(null);

  // Group errors by step
  const errorsByStep = {};
  
  // Map field names to steps (this should match your form structure)
  const fieldToStepMap = {
    // Step 0: Business Model
    businessModelType: 0,
    
    // Step 1: Basic Information
    brandName: 1,
    brandLogo: 1,
    industries: 1,
    phone: 1,
    email: 1,
    website: 1,
    foundedYear: 1,
    brandStory: 1,
    
    // Step 2: Partnership Details
    franchiseFee: 2,
    royaltyFee: 2,
    revenueStreams: 2,
    franchiseModel: 2,
    territoryRights: 2,
    
    // Step 3: Investment Requirements
    investmentRange: 3,
    areaMin: 3,
    areaMax: 3,
    setupCost: 3,
    workingCapital: 3,
    
    // Step 4: Training & Support
    trainingDuration: 4,
    trainingLocation: 4,
    supportTypes: 4,
    minAge: 4,
    experience: 4,
    qualification: 4,
    
    // Step 5: Gallery & Final Details
    franchiseImages: 5,
    whyChooseUs: 5,
    agreeToTerms: 5,
    
    // Step 6: Review
    // No specific fields
  };

  // Organize errors by step
  Object.keys(errors).forEach(field => {
    const stepIndex = fieldToStepMap[field] ?? currentStep;
    if (!errorsByStep[stepIndex]) {
      errorsByStep[stepIndex] = [];
    }
    errorsByStep[stepIndex].push({
      field,
      message: errors[field]
    });
  });

  const totalErrors = Object.keys(errors).length;
  const stepsWithErrors = Object.keys(errorsByStep).length;

  const handleJumpToError = (stepIndex) => {
    onJumpToStep(stepIndex);
    onClose();
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      businessModelType: 'Business Model',
      brandName: 'Brand Name',
      brandLogo: 'Brand Logo',
      industries: 'Industry Categories',
      phone: 'Phone Number',
      email: 'Email Address',
      website: 'Website URL',
      foundedYear: 'Founded Year',
      brandStory: 'Brand Story',
      franchiseFee: 'Franchise Fee',
      royaltyFee: 'Royalty Fee',
      revenueStreams: 'Revenue Streams',
      franchiseModel: 'Franchise Model',
      territoryRights: 'Territory Rights',
      investmentRange: 'Investment Range',
      areaMin: 'Minimum Area',
      areaMax: 'Maximum Area',
      setupCost: 'Setup Cost',
      workingCapital: 'Working Capital',
      trainingDuration: 'Training Duration',
      trainingLocation: 'Training Location',
      supportTypes: 'Support Types',
      minAge: 'Minimum Age',
      experience: 'Experience Required',
      qualification: 'Qualification Required',
      franchiseImages: 'Gallery Images',
      whyChooseUs: 'Why Choose Us',
      agreeToTerms: 'Terms & Conditions'
    };
    return labels[fieldName] || fieldName;
  };

  const handleToggle = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="validation-dialog-title"
      aria-describedby="validation-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        },
        role: 'alertdialog'
      }}
    >
      <DialogTitle id="validation-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Validation Errors Found
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Please fix the following errors before submitting
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Summary Alert */}
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          icon={<ErrorIcon />}
        >
          <Typography variant="body2" fontWeight={600}>
            {totalErrors} error{totalErrors !== 1 ? 's' : ''} found across {stepsWithErrors} step{stepsWithErrors !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Click on any error to jump to that step and fix it
          </Typography>
        </Alert>

        {/* Errors by Step */}
        <Box>
          {steps.map((step, index) => {
            const stepErrors = errorsByStep[index];
            if (!stepErrors || stepErrors.length === 0) {
              return null;
            }

            return (
              <Accordion
                key={index}
                expanded={expandedStep === index}
                onChange={() => handleToggle(index)}
                sx={{
                  mb: 1,
                  '&:before': { display: 'none' },
                  border: '1px solid',
                  borderColor: 'error.light',
                  borderRadius: 1,
                  '&.Mui-expanded': {
                    margin: '0 0 8px 0'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: alpha('#f44336', 0.05),
                    '&:hover': {
                      bgcolor: alpha('#f44336', 0.1)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 14
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {step.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${stepErrors.length} error${stepErrors.length !== 1 ? 's' : ''}`}
                      color="error"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <List disablePadding>
                    {stepErrors.map((error, errorIndex) => (
                      <React.Fragment key={error.field}>
                        <ListItem
                          sx={{
                            py: 2,
                            px: 3,
                            '&:hover': {
                              bgcolor: 'action.hover',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleJumpToError(index)}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <WarningIcon color="error" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" fontWeight={600}>
                                {getFieldLabel(error.field)}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="error.main" sx={{ mt: 0.5 }}>
                                {error.message}
                              </Typography>
                            }
                          />
                          <ArrowIcon color="action" />
                        </ListItem>
                        {errorIndex < stepErrors.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        {/* No Errors State (shouldn't show but just in case) */}
        {totalErrors === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              All Clear!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No validation errors found. You're ready to submit!
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={onFixErrors}
          variant="contained"
          color="error"
          startIcon={<ErrorIcon />}
        >
          Fix Errors
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationSummaryModal;
