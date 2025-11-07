import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FAQ Accordion Component
 * Displays frequently asked questions with expandable answers
 * 
 * @param {Object} props
 * @param {Array} props.faqs - Array of FAQ objects with { question, answer, category }
 * @param {string} props.title - Section title (default: "Frequently Asked Questions")
 * @param {boolean} props.showSearch - Show search filter (default: true)
 * @param {boolean} props.showCategories - Show category filters (default: true)
 * @param {boolean} props.defaultExpanded - Whether to expand first item by default
 */
const FAQAccordion = ({
  faqs = [],
  title = 'Frequently Asked Questions',
  showSearch = true,
  showCategories = true,
  defaultExpanded = false,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded ? 'faq-0' : false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories
  const categories = ['all', ...new Set(faqs.map(faq => faq.category).filter(Boolean))];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <HelpIcon color="primary" sx={{ fontSize: 36 }} />
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to common questions about this franchise
        </Typography>
      </Box>

      {/* Search and Filters */}
      {(showSearch || showCategories) && (
        <Box sx={{ mb: 3 }}>
          {/* Search Bar */}
          {showSearch && (
            <TextField
              fullWidth
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: showCategories ? 2 : 0 }}
            />
          )}

          {/* Category Filters */}
          {showCategories && categories.length > 1 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category === 'all' ? 'All' : category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* FAQ List */}
      <AnimatePresence mode="wait">
        {filteredFaqs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredFaqs.map((faq, index) => (
              <Accordion
                key={`faq-${index}`}
                expanded={expanded === `faq-${index}`}
                onChange={handleChange(`faq-${index}`)}
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:before': { display: 'none' },
                  boxShadow: expanded === `faq-${index}` 
                    ? theme.shadows[3]
                    : theme.shadows[1],
                  transition: 'all 0.3s',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: expanded === `faq-${index}`
                      ? alpha(theme.palette.primary.main, 0.05)
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        flex: 1,
                        pr: 2,
                      }}
                    >
                      {faq.question}
                    </Typography>
                    {faq.category && (
                      <Chip
                        label={faq.category}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 22,
                          textTransform: 'capitalize',
                        }}
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    pt: 2,
                    pb: 3,
                    px: 3,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.8 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 3,
                background: alpha(theme.palette.grey[100], 0.5),
                borderRadius: 2,
              }}
            >
              <HelpIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No FAQs Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

/**
 * Compact FAQ List (for sidebars)
 */
export const CompactFAQList = ({ faqs = [], limit = 5 }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(null);

  const displayedFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <Box>
      {displayedFaqs.map((faq, index) => (
        <Box
          key={index}
          onClick={() => setExpanded(expanded === index ? null : index)}
          sx={{
            mb: 1,
            p: 1.5,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {faq.question}
            <ExpandMoreIcon
              sx={{
                transform: expanded === index ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                fontSize: 20,
              }}
            />
          </Typography>
          <AnimatePresence>
            {expanded === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1, lineHeight: 1.6 }}
                >
                  {faq.answer}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      ))}
    </Box>
  );
};

/**
 * Default FAQs for franchises
 */
export const defaultFranchiseFAQs = [
  {
    question: 'What is the total investment required?',
    answer: 'The total investment varies based on location, size, and specific franchise requirements. Please refer to the investment details section for a breakdown of all costs including franchise fee, setup costs, and working capital.',
    category: 'Investment',
  },
  {
    question: 'What kind of training and support do you provide?',
    answer: 'We provide comprehensive initial training covering operations, marketing, and management. Ongoing support includes regular business reviews, marketing assistance, and access to our support team.',
    category: 'Support',
  },
  {
    question: 'How long does it take to break even?',
    answer: 'Break-even time varies by location and management, but typically ranges from 12 to 24 months. Factors affecting this include location, local market conditions, and operational efficiency.',
    category: 'ROI',
  },
  {
    question: 'What are the ongoing fees?',
    answer: 'Ongoing fees typically include royalty fees (percentage of gross sales), marketing fees, and technology/system fees. Specific percentages are outlined in the franchise agreement.',
    category: 'Fees',
  },
  {
    question: 'Can I operate multiple locations?',
    answer: 'Yes, we encourage multi-unit development for qualified franchisees. Multi-unit agreements offer territory protection and additional support for expansion.',
    category: 'Expansion',
  },
];

export default FAQAccordion;
