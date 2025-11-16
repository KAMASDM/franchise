/**
 * Financing Options Section
 * Real franchise financing options and partners
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Stack,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  ExpandMore,
  CheckCircle,
  CreditCard,
  HandshakeOutlined,
  VerifiedUser,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const FinancingOptions = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const financingOptions = [
    {
      title: 'Bank Loans',
      icon: <AccountBalance />,
      color: theme.palette.primary.main,
      description: 'Traditional business loans from major banks',
      features: [
        'Loan Amount: Up to ₹1 Crore',
        'Interest Rate: 9.5% - 14% per annum',
        'Tenure: 5-7 years',
        'Processing Time: 2-4 weeks',
      ],
      partners: ['SBI', 'HDFC', 'ICICI', 'Axis Bank'],
    },
    {
      title: 'MUDRA Loans',
      icon: <TrendingUp />,
      color: theme.palette.success.main,
      description: 'Government scheme for micro & small businesses',
      features: [
        'Shishu: Up to ₹50,000',
        'Kishore: ₹50,000 - ₹5 Lakhs',
        'Tarun: ₹5 Lakhs - ₹10 Lakhs',
        'No collateral required',
      ],
      partners: ['All Nationalized Banks', 'NBFCs', 'MFIs'],
    },
    {
      title: 'NBFC Financing',
      icon: <CreditCard />,
      color: theme.palette.info.main,
      description: 'Faster approvals with flexible terms',
      features: [
        'Loan Amount: ₹5 Lakhs - ₹50 Lakhs',
        'Interest Rate: 12% - 18% per annum',
        'Tenure: 3-5 years',
        'Quick Processing: 5-10 days',
      ],
      partners: ['Bajaj Finserv', 'Tata Capital', 'L&T Finance'],
    },
    {
      title: 'Franchisor Support',
      icon: <HandshakeOutlined />,
      color: theme.palette.warning.main,
      description: 'Direct financing from franchise brands',
      features: [
        'Deferred payment plans',
        'Equipment leasing options',
        'Revenue-based financing',
        'Partnered lender programs',
      ],
      partners: ['Brand-specific programs'],
    },
  ];

  const eligibilityCriteria = [
    {
      title: 'Credit Score Requirements',
      items: [
        'Minimum CIBIL Score: 650-700 for most lenders',
        'Higher score (750+) for better interest rates',
        'Clean credit history with no defaults',
        'Debt-to-income ratio below 40%',
      ],
    },
    {
      title: 'Documentation Needed',
      items: [
        'PAN Card & Aadhaar Card',
        'Bank statements (6-12 months)',
        'Income Tax Returns (last 2-3 years)',
        'Franchise Agreement copy',
        'Business plan & financial projections',
        'Property documents (if collateral)',
      ],
    },
    {
      title: 'Down Payment Expectations',
      items: [
        'Typically 20-30% of total investment',
        'Lower for government-backed schemes',
        'Some franchisors offer 10-15% options',
        'Can be funded through personal savings or assets',
      ],
    },
  ];

  const tips = [
    'Compare at least 3-4 lenders before deciding',
    'Negotiate interest rates - even 0.5% matters over tenure',
    'Consider subsidy schemes under Stand-Up India or Startup India',
    'Factor in processing fees, prepayment charges in total cost',
    'Maintain 6-12 months working capital separately',
    'Get pre-approved before finalizing franchise location',
  ];

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${theme.palette.background.paper} 100%)`,
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
              label="FINANCING OPTIONS"
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
              Fund Your Franchise Dream
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Multiple financing options to suit your budget and requirements
            </Typography>
          </motion.div>
        </Box>

        {/* Financing Options Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
          {financingOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(option.color, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
                  border: `2px solid ${alpha(option.color, 0.2)}`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: option.color,
                      mb: 2,
                    }}
                  >
                    {option.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="700" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {option.description}
                  </Typography>
                  <List dense>
                    {option.features.map((feature, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircle sx={{ fontSize: 16, color: option.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'caption', fontSize: '0.75rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(option.color, 0.1)}` }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Partners:
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                      {option.partners.map((partner, i) => (
                        <Chip
                          key={i}
                          label={partner}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            bgcolor: alpha(option.color, 0.1),
                            mb: 0.5,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Eligibility & Requirements */}
        <Grid container spacing={4} sx={{ mb: 6 }} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
              Eligibility & Requirements
            </Typography>
            {eligibilityCriteria.map((section, index) => (
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
                  <Typography variant="h6" fontWeight="600">
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {section.items.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <VerifiedUser sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} lg={4}>
            <MotionCard
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
                color: 'white',
                borderRadius: 3,
                position: 'sticky',
                top: 100,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  💡 Expert Tips
                </Typography>
                <List>
                  {tips.map((tip, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={tip}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Bottom Info */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" fontWeight="600" color="info.main" gutterBottom>
            🎯 Average Franchise Financing Success Rate: 78%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Most franchisees secure funding within 4-8 weeks with proper documentation and planning
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FinancingOptions;
