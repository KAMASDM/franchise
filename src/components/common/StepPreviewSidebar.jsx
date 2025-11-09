import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  Collapse,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as EmptyIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  School as TrainingIcon,
  Photo as PhotoIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StepPreviewSidebar = ({
  steps,
  currentStep,
  formData,
  onStepClick,
  open = true,
  onToggle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSteps, setExpandedSteps] = useState([0, 1, 2, 3, 4, 5]);

  // Step icons
  const stepIcons = [
    <BusinessIcon />,
    <StoreIcon />,
    <MoneyIcon />,
    <MoneyIcon />,
    <TrainingIcon />,
    <PhotoIcon />,
    <DescriptionIcon />
  ];

  // Define which fields belong to which step
  const stepFields = {
    0: ['businessModelType'], // Business Model Selection
    1: ['brandName', 'brandLogo', 'industries', 'brandEmail', 'brandPhone', 'brandWebsite', 'brandDescription'],
    2: ['franchiseFee', 'royaltyFee', 'marketingFee', 'securityDeposit', 'avgRevenue'],
    3: ['investmentRange', 'areaMin', 'areaMax', 'staffRequired', 'breakEvenTime'],
    4: ['trainingDuration', 'trainingLocation', 'ongoingSupport', 'franchiseAgreementLength', 'minAge', 'educationRequired', 'experienceRequired'],
    5: ['franchiseImages', 'brandStory', 'keyDifferentiators', 'companyHistory'],
    6: [] // Review step - no fields
  };

  // Check if a field has a value
  const hasValue = (fieldName) => {
    const value = formData[fieldName];
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  // Calculate step completion
  const getStepCompletion = (stepIndex) => {
    const fields = stepFields[stepIndex] || [];
    if (fields.length === 0) return 0;
    const filledFields = fields.filter(hasValue).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Get filled and empty field counts
  const getFieldCounts = (stepIndex) => {
    const fields = stepFields[stepIndex] || [];
    const filled = fields.filter(hasValue).length;
    return { filled, total: fields.length, empty: fields.length - filled };
  };

  // Get user-friendly field labels
  const getFieldLabel = (fieldName) => {
    const labels = {
      businessModelType: 'Business Model',
      brandName: 'Brand Name',
      brandLogo: 'Brand Logo',
      industries: 'Industries',
      brandEmail: 'Email',
      brandPhone: 'Phone',
      brandWebsite: 'Website',
      brandDescription: 'Description',
      franchiseFee: 'Franchise Fee',
      royaltyFee: 'Royalty Fee',
      marketingFee: 'Marketing Fee',
      securityDeposit: 'Security Deposit',
      avgRevenue: 'Avg. Revenue',
      investmentRange: 'Investment Range',
      areaMin: 'Min Area',
      areaMax: 'Max Area',
      staffRequired: 'Staff Required',
      breakEvenTime: 'Break-even Time',
      trainingDuration: 'Training Duration',
      trainingLocation: 'Training Location',
      ongoingSupport: 'Ongoing Support',
      franchiseAgreementLength: 'Agreement Length',
      minAge: 'Min Age',
      educationRequired: 'Education',
      experienceRequired: 'Experience',
      franchiseImages: 'Gallery Images',
      brandStory: 'Brand Story',
      keyDifferentiators: 'Key Differentiators',
      companyHistory: 'Company History'
    };
    return labels[fieldName] || fieldName;
  };

  const toggleStep = (stepIndex) => {
    setExpandedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(s => s !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const sidebarWidth = 320;

  const renderFieldList = (stepIndex) => {
    const fields = stepFields[stepIndex] || [];
    if (fields.length === 0) return null;

    return (
      <List dense sx={{ pl: 2, py: 0 }}>
        {fields.map((fieldName) => (
          <ListItem key={fieldName} disablePadding sx={{ py: 0.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              {hasValue(fieldName) ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <EmptyIcon sx={{ fontSize: 16, color: 'grey.400' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: hasValue(fieldName) ? 'text.primary' : 'text.secondary',
                  fontWeight: hasValue(fieldName) ? 500 : 400
                }}
              >
                {getFieldLabel(fieldName)}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  const drawerContent = (
    <Box 
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      role="complementary"
      aria-label="Form progress sidebar"
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" fontWeight={600}>
          Form Progress
        </Typography>
        {!isMobile && (
          <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"}>
            <IconButton onClick={onToggle} size="small">
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Overall Progress */}
      <Box sx={{ p: 2, bgcolor: 'primary.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Overall Completion
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} color="primary">
            {Math.round(steps.reduce((sum, _, i) => sum + getStepCompletion(i), 0) / steps.length)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={Math.round(steps.reduce((sum, _, i) => sum + getStepCompletion(i), 0) / steps.length)}
          sx={{ 
            height: 8, 
            borderRadius: 1,
            bgcolor: 'background.paper',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1
            }
          }}
        />
      </Box>

      {/* Steps List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <List>
          {steps.map((step, index) => {
            const completion = getStepCompletion(index);
            const { filled, total, empty } = getFieldCounts(index);
            const isExpanded = expandedSteps.includes(index);
            const isCurrent = currentStep === index;

            return (
              <React.Fragment key={index}>
                <motion.div
                  initial={false}
                  animate={{ 
                    backgroundColor: isCurrent ? theme.palette.primary.lighter : 'transparent'
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ borderRadius: 8, marginBottom: 4 }}
                >
                  <ListItemButton
                    onClick={() => onStepClick(index)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      border: isCurrent ? '2px solid' : '1px solid',
                      borderColor: isCurrent ? 'primary.main' : 'divider',
                      '&:hover': {
                        bgcolor: 'primary.lighter'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      {/* Step Icon */}
                      <Box 
                        sx={{ 
                          color: isCurrent ? 'primary.main' : 'text.secondary',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {stepIcons[index]}
                      </Box>

                      {/* Step Info */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={isCurrent ? 700 : 600}
                            color={isCurrent ? 'primary.main' : 'text.primary'}
                          >
                            {step.label}
                          </Typography>
                          {total > 0 && (
                            <Chip 
                              label={`${filled}/${total}`}
                              size="small"
                              color={completion === 100 ? 'success' : 'default'}
                              sx={{ 
                                height: 20, 
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                        {total > 0 && (
                          <LinearProgress
                            variant="determinate"
                            value={completion}
                            sx={{
                              height: 4,
                              borderRadius: 1,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: completion === 100 ? 'success.main' : 'primary.main',
                                borderRadius: 1
                              }
                            }}
                          />
                        )}
                      </Box>

                      {/* Expand/Collapse Button */}
                      {total > 0 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStep(index);
                          }}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      )}
                    </Box>
                  </ListItemButton>

                  {/* Field List */}
                  {total > 0 && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 1, pr: 1, pb: 1 }}>
                        {renderFieldList(index)}
                      </Box>
                    </Collapse>
                  )}
                </motion.div>
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onToggle}
        sx={{
          '& .MuiDrawer-paper': {
            maxHeight: '70vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: Sidebar
  return (
    <Drawer
      variant="permanent"
      anchor="right"
      open={open}
      sx={{
        width: open ? sidebarWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          borderLeft: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default StepPreviewSidebar;
