import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Form Progress Indicator Component
 * Shows visual completion percentage for multi-step forms
 * 
 * @param {Object} props
 * @param {number} props.currentStep - Current step (0-indexed)
 * @param {number} props.totalSteps - Total number of steps
 * @param {Array<string>} props.stepLabels - Optional labels for each step
 * @param {boolean} props.showPercentage - Show percentage text (default: true)
 * @param {string} props.variant - Display variant: 'linear', 'circular', 'stepper' (default: 'linear')
 */
const FormProgressIndicator = ({
  currentStep = 0,
  totalSteps = 1,
  stepLabels = [],
  showPercentage = true,
  variant = 'linear',
  completedSteps = [],
}) => {
  const theme = useTheme();
  
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100);
  const isComplete = currentStep === totalSteps - 1;

  // Linear Progress Bar Variant
  if (variant === 'linear') {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          background: alpha(theme.palette.primary.main, 0.03),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Step {currentStep + 1} of {totalSteps}
          </Typography>
          {showPercentage && (
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: isComplete ? 'success.main' : 'primary.main',
              }}
            >
              {progressPercentage}% Complete
            </Typography>
          )}
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: isComplete
                ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        />

        {stepLabels && stepLabels[currentStep] && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Current: <strong>{stepLabels[currentStep]}</strong>
          </Typography>
        )}
      </Paper>
    );
  }

  // Stepper Variant
  if (variant === 'stepper') {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {showPercentage && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: isComplete ? 'success.main' : 'primary.main',
              }}
            >
              {progressPercentage}% Complete
            </Typography>
          </Box>
        )}

        <Stepper activeStep={currentStep} alternativeLabel>
          {stepLabels.map((label, index) => (
            <Step key={label} completed={index < currentStep}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon {...props} completed={index < currentStep} />
                )}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: index === currentStep ? 700 : 400,
                    color: index === currentStep ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    );
  }

  // Circular Variant
  if (variant === 'circular') {
    return (
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `conic-gradient(
                ${theme.palette.primary.main} ${progressPercentage}%,
                ${alpha(theme.palette.primary.main, 0.1)} ${progressPercentage}%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" fontWeight={700} color="primary">
                {progressPercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Complete
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Step {currentStep + 1} of {totalSteps}
        </Typography>
        
        {stepLabels && stepLabels[currentStep] && (
          <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
            {stepLabels[currentStep]}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};

/**
 * Custom Step Icon Component
 */
const CustomStepIcon = ({ completed, active }) => {
  const theme = useTheme();

  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <CheckCircleIcon
          sx={{
            color: theme.palette.success.main,
            fontSize: 28,
          }}
        />
      </motion.div>
    );
  }

  return (
    <RadioButtonUncheckedIcon
      sx={{
        color: active ? theme.palette.primary.main : theme.palette.grey[400],
        fontSize: 28,
      }}
    />
  );
};

/**
 * Compact Progress Bar (for inline use)
 */
export const CompactProgressBar = ({ current, total, showText = false }) => {
  const progress = Math.round((current / total) * 100);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }}
        />
      </Box>
      {showText && (
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
          {progress}%
        </Typography>
      )}
    </Box>
  );
};

export default FormProgressIndicator;
