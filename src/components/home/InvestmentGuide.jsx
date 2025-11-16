/**
 * Investment Guide Section
 * Comprehensive step-by-step franchise investment guide
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search,
  Assessment,
  Gavel,
  School,
  RocketLaunch,
  CheckCircle,
  ExpandMore,
  TrendingUp,
  Security,
  AttachMoney,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const InvestmentGuide = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState('panel1');

  const steps = [
    {
      label: 'Research & Discovery',
      icon: <Search />,
      description: 'Explore franchise opportunities that align with your goals',
      duration: '2-4 weeks',
      keyPoints: [
        'Identify industries matching your interests and expertise',
        'Research market demand in your target location',
        'Compare 3-5 franchise options in detail',
        'Analyze initial investment requirements',
      ],
      color: theme.palette.primary.main,
    },
    {
      label: 'Due Diligence',
      icon: <Assessment />,
      description: 'Thoroughly evaluate franchise opportunities',
      duration: '3-6 weeks',
      keyPoints: [
        'Review Franchise Disclosure Document (FDD)',
        'Speak with existing franchisees',
        'Analyze financial projections and ROI',
        'Assess brand reputation and support system',
      ],
      color: theme.palette.info.main,
    },
    {
      label: 'Legal & Financial',
      icon: <Gavel />,
      description: 'Finalize agreements and secure funding',
      duration: '4-8 weeks',
      keyPoints: [
        'Consult with franchise attorney',
        'Review and negotiate franchise agreement',
        'Secure financing (loan/investors)',
        'Complete background checks',
      ],
      color: theme.palette.warning.main,
    },
    {
      label: 'Training & Setup',
      icon: <School />,
      description: 'Get trained and establish your location',
      duration: '8-12 weeks',
      keyPoints: [
        'Complete franchisor training program',
        'Find and lease suitable location',
        'Hire and train initial staff',
        'Set up operations and systems',
      ],
      color: theme.palette.secondary.main,
    },
    {
      label: 'Grand Opening',
      icon: <RocketLaunch />,
      description: 'Launch your franchise successfully',
      duration: '2-4 weeks',
      keyPoints: [
        'Execute pre-launch marketing campaign',
        'Conduct soft opening with friends/family',
        'Host grand opening event',
        'Begin full operations',
      ],
      color: theme.palette.success.main,
    },
  ];

  const investmentConsiderations = [
    {
      title: 'Initial Investment Breakdown',
      icon: <AttachMoney />,
      items: [
        'Franchise Fee: ₹3-15 Lakhs (typically)',
        'Real Estate & Setup: ₹10-50 Lakhs',
        'Equipment & Inventory: ₹5-20 Lakhs',
        'Working Capital: ₹3-10 Lakhs',
        'Marketing & Promotion: ₹2-5 Lakhs',
      ],
    },
    {
      title: 'Ongoing Costs',
      icon: <TrendingUp />,
      items: [
        'Royalty Fees: 4-8% of gross revenue',
        'Marketing Fees: 1-3% of gross revenue',
        'Operating Expenses: Rent, utilities, payroll',
        'Inventory Replenishment: Varies by industry',
        'Insurance & Compliance: ₹50,000-2L annually',
      ],
    },
    {
      title: 'Risk Mitigation',
      icon: <Security />,
      items: [
        'Choose established brands with proven track record',
        'Ensure adequate working capital for 6-12 months',
        'Diversify with multi-unit ownership over time',
        'Maintain strong relationship with franchisor',
        'Stay updated with industry trends and adapt',
      ],
    },
  ];

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Chip
              label="INVESTMENT GUIDE"
              color="primary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Franchise Journey Roadmap
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              A comprehensive guide to launching your franchise in 5 strategic steps
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={6} justifyContent="center">
          {/* Step-by-Step Guide */}
          <Grid item xs={12} lg={7}>
            <MotionCard
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{
                background: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 4 }}>
                  Step-by-Step Timeline
                </Typography>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={index} expanded>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${step.color} 0%, ${alpha(step.color, 0.7)} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: `0 4px 12px ${alpha(step.color, 0.3)}`,
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        <Typography variant="h6" fontWeight="700">
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ ml: 1, pb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {step.description}
                          </Typography>
                          <Chip
                            label={`Duration: ${step.duration}`}
                            size="small"
                            sx={{ mt: 1, mb: 2, bgcolor: alpha(step.color, 0.1) }}
                          />
                          <List dense>
                            {step.keyPoints.map((point, i) => (
                              <ListItem key={i} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircle sx={{ fontSize: 18, color: step.color }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={point}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ mt: 3, p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight="600" color="success.main">
                    Total Timeline: 5-8 months from research to grand opening
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Investment Considerations */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Investment Considerations
              </Typography>
              {investmentConsiderations.map((section, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index + 1}`}
                  onChange={handleChange(`panel${index + 1}`)}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    '&:before': { display: 'none' },
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="700">
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {section.items.map((item, i) => (
                        <ListItem key={i}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                          </ListItemIcon>
                          <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestmentGuide;
