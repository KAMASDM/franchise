import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Reusable Card Selector Component
 * Creates beautiful, interactive cards for form selections
 */
const CardSelector = ({ 
  options = [], 
  value = null, 
  onChange, 
  multiSelect = false,
  title,
  subtitle,
  columns = { xs: 1, sm: 2, md: 3 },
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const theme = useTheme();

  const handleSelection = (option) => {
    if (multiSelect) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.id)
        ? currentValue.filter(id => id !== option.id)
        : [...currentValue, option.id];
      onChange(newValue);
    } else {
      onChange(option.id);
    }
  };

  const isSelected = (optionId) => {
    return multiSelect 
      ? Array.isArray(value) && value.includes(optionId)
      : value === optionId;
  };

  const getCardStyles = (selected) => ({
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: selected 
      ? `2px solid ${theme.palette.primary.main}`
      : `2px solid ${alpha(theme.palette.grey[300], 0.5)}`,
    backgroundColor: selected 
      ? alpha(theme.palette.primary.main, 0.08)
      : theme.palette.background.paper,
    transform: selected ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: selected 
      ? theme.shadows[8]
      : theme.shadows[2],
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[12],
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.04)
    }
  });

  return (
    <Box>
      {title && (
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {options.map((option, index) => (
          <Grid item {...columns} key={option.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={getCardStyles(isSelected(option.id))}
                onClick={() => handleSelection(option)}
              >
                <CardContent sx={{ p: variant === 'compact' ? 2 : 3 }}>
                  {/* Selection Indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      {/* Icon */}
                      {option.icon && (
                        <Box 
                          sx={{ 
                            display: 'inline-flex',
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: alpha(option.color || theme.palette.primary.main, 0.1),
                            color: option.color || theme.palette.primary.main,
                            mb: 1
                          }}
                        >
                          {typeof option.icon === 'string' ? (
                            <Box component="span" sx={{ fontSize: 24 }}>
                              {option.icon}
                            </Box>
                          ) : (
                            option.icon
                          )}
                        </Box>
                      )}
                      
                      {/* Title */}
                      <Typography 
                        variant={variant === 'compact' ? 'subtitle1' : 'h6'} 
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {option.label}
                      </Typography>
                    </Box>
                    
                    {/* Check Icon */}
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: isSelected(option.id) 
                          ? theme.palette.primary.main 
                          : theme.palette.grey[400]
                      }}
                    >
                      {isSelected(option.id) ? <CheckIcon /> : <UncheckedIcon />}
                    </IconButton>
                  </Box>

                  {/* Description */}
                  {option.description && variant !== 'compact' && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 1.5, lineHeight: 1.4 }}
                    >
                      {option.description}
                    </Typography>
                  )}

                  {/* Features */}
                  {option.features && variant === 'detailed' && (
                    <Box sx={{ mb: 1.5 }}>
                      {option.features.slice(0, 3).map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            mr: 0.5, 
                            mb: 0.5, 
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Investment Level */}
                  {option.investmentType && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={option.investmentType}
                        size="small"
                        color="primary"
                        variant={isSelected(option.id) ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.7rem' }}
                      />
                      
                      {option.commitmentLevel && variant === 'detailed' && (
                        <Typography variant="caption" color="text.secondary">
                          {option.commitmentLevel}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Custom Content */}
                  {option.customContent && (
                    <Box sx={{ mt: 1 }}>
                      {option.customContent}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardSelector;