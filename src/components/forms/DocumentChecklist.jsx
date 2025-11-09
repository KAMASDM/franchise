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
  Checkbox,
  Chip,
  Divider,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Description as DocumentIcon,
  Image as ImageIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const DocumentChecklist = ({ open, onClose, onContinue }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    branding: true,
    business: false,
    financial: false,
    legal: false
  });

  const documentSections = [
    {
      id: 'branding',
      title: 'Branding Materials',
      icon: <ImageIcon />,
      color: '#1976d2',
      items: [
        {
          id: 'logo',
          name: 'Brand Logo',
          requirement: 'Required',
          details: 'High-quality PNG or JPG',
          specs: [
            'Minimum: 200x200 pixels',
            'Recommended: 512x512 pixels',
            'Max file size: 2MB',
            'Transparent background preferred'
          ]
        },
        {
          id: 'banner',
          name: 'Brand Banner',
          requirement: 'Optional',
          details: 'Wide format banner image',
          specs: [
            'Recommended: 1920x600 pixels',
            'Aspect ratio: 16:5',
            'Max file size: 5MB',
            'JPG or PNG format'
          ]
        },
        {
          id: 'gallery',
          name: 'Gallery Images',
          requirement: 'Recommended',
          details: '3-10 high-quality photos',
          specs: [
            'Show your outlets/products',
            'Minimum: 800x600 pixels',
            'Max 5MB per image',
            'Professional photography preferred'
          ]
        }
      ]
    },
    {
      id: 'business',
      title: 'Business Information',
      icon: <BusinessIcon />,
      color: '#388e3c',
      items: [
        {
          id: 'registration',
          name: 'Business Registration Details',
          requirement: 'Required',
          details: 'Official company information',
          specs: [
            'Registered business name',
            'Year of establishment',
            'Business registration number',
            'GST number (if applicable)'
          ]
        },
        {
          id: 'description',
          name: 'Brand Story & Description',
          requirement: 'Required',
          details: 'Detailed brand narrative',
          specs: [
            'Minimum 50 characters',
            'Include: Origin, mission, USP',
            'Target audience details',
            'Market positioning'
          ]
        },
        {
          id: 'outlets',
          name: 'Existing Outlet Information',
          requirement: 'Required',
          details: 'Current locations and details',
          specs: [
            'Number of outlets',
            'Locations (cities/states)',
            'Average outlet size',
            'Performance metrics (optional)'
          ]
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Details',
      icon: <MoneyIcon />,
      color: '#f57c00',
      items: [
        {
          id: 'fees',
          name: 'Fee Structure',
          requirement: 'Required',
          details: 'Complete pricing information',
          specs: [
            'Initial franchise fee',
            'Royalty fee percentage',
            'Marketing fee (if applicable)',
            'Security deposit (if any)'
          ]
        },
        {
          id: 'investment',
          name: 'Investment Breakdown',
          requirement: 'Required',
          details: 'Detailed cost estimates',
          specs: [
            'Total investment range',
            'Equipment costs',
            'Setup & infrastructure costs',
            'Working capital requirements',
            'Area/space requirements'
          ]
        },
        {
          id: 'financing',
          name: 'Financing Options',
          requirement: 'Optional',
          details: 'Available funding support',
          specs: [
            'Bank tie-ups (if any)',
            'Payment plans',
            'EMI facilities',
            'Partner investment options'
          ]
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal Documents',
      icon: <DocumentIcon />,
      color: '#d32f2f',
      items: [
        {
          id: 'agreement',
          name: 'Franchise Agreement Details',
          requirement: 'Required',
          details: 'Terms and conditions',
          specs: [
            'Contract duration',
            'Renewal terms',
            'Territory rights',
            'Exit clauses',
            'Non-compete terms'
          ]
        },
        {
          id: 'compliance',
          name: 'Compliance Information',
          requirement: 'Required',
          details: 'Legal requirements',
          specs: [
            'FSSAI license (for F&B)',
            'Trade license',
            'Industry-specific permits',
            'Compliance certifications'
          ]
        },
        {
          id: 'support',
          name: 'Training & Support Documentation',
          requirement: 'Required',
          details: 'Partner support details',
          specs: [
            'Training duration & location',
            'Training cost (included/extra)',
            'Ongoing support types',
            'Operations manual availability'
          ]
        }
      ]
    }
  ];

  const handleToggle = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getTotalItems = () => {
    return documentSections.reduce((total, section) => total + section.items.length, 0);
  };

  const getCheckedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const getCompletionPercentage = () => {
    return Math.round((getCheckedCount() / getTotalItems()) * 100);
  };

  const allItemsChecked = getCheckedCount() === getTotalItems();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Document Preparation Checklist
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Gather these documents before starting your registration
            </Typography>
          </Box>
          <Chip 
            label={`${getCompletionPercentage()}% Ready`}
            color={allItemsChecked ? "success" : "primary"}
            icon={allItemsChecked ? <CheckCircleIcon /> : <InfoIcon />}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Tip:</strong> Having all these documents ready will help you complete the registration in 15-20 minutes.
            You can still start without everything, but required items must be provided to submit.
          </Typography>
        </Alert>

        {documentSections.map((section) => (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                bgcolor: `${section.color}10`,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: `${section.color}20`
                }
              }}
              onClick={() => handleToggleSection(section.id)}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: section.color,
                  color: 'white',
                  mr: 2
                }}
              >
                {section.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {section.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {section.items.filter(item => checkedItems[item.id]).length} / {section.items.length} items ready
                </Typography>
              </Box>
              <IconButton
                sx={{
                  transform: expandedSections[section.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>

            <Collapse in={expandedSections[section.id]}>
              <List sx={{ pl: 2 }}>
                {section.items.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Checkbox
                            edge="start"
                            checked={checkedItems[item.id] || false}
                            onChange={() => handleToggle(item.id)}
                            sx={{
                              color: section.color,
                              '&.Mui-checked': {
                                color: section.color
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {item.name}
                              </Typography>
                              <Chip
                                label={item.requirement}
                                size="small"
                                color={item.requirement === 'Required' ? 'error' : 'default'}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={item.details}
                        />
                      </Box>
                      
                      <Box sx={{ pl: 7, mt: 1, width: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Specifications:
                        </Typography>
                        <List dense sx={{ mt: 0.5 }}>
                          {item.specs.map((spec, idx) => (
                            <ListItem key={idx} sx={{ py: 0.25, pl: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                • {spec}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </ListItem>
                    {section.items.indexOf(item) < section.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={onContinue}
          variant="contained"
          color="primary"
          disabled={!allItemsChecked}
        >
          {allItemsChecked ? "I'm Ready - Start Registration" : `Ready ${getCheckedCount()}/${getTotalItems()} Items`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentChecklist;
