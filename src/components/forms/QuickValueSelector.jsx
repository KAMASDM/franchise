import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Quick Value Selector - For simple options like investment ranges, locations, etc.
 */
const QuickValueSelector = ({ 
  options = [], 
  value = null, 
  onChange, 
  multiSelect = false,
  title,
  subtitle,
  columns = { xs: 2, sm: 3, md: 4 },
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const theme = useTheme();

  const handleSelection = (option) => {
    if (multiSelect) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.value || option.label)
        ? currentValue.filter(val => val !== (option.value || option.label))
        : [...currentValue, (option.value || option.label)];
      onChange(newValue);
    } else {
      onChange(option.value || option.label);
    }
  };

  const isSelected = (option) => {
    const optionValue = option.value || option.label;
    return multiSelect 
      ? Array.isArray(value) && value.includes(optionValue)
      : value === optionValue;
  };

  const getCardHeight = () => {
    switch (size) {
      case 'small': return 80;
      case 'large': return 120;
      default: return 100;
    }
  };

  const getCardStyles = (selected, option) => ({
    height: getCardHeight(),
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: selected 
      ? `2px solid ${option.color || theme.palette.primary.main}`
      : `1px solid ${alpha(theme.palette.grey[300], 0.8)}`,
    backgroundColor: selected 
      ? alpha(option.color || theme.palette.primary.main, 0.1)
      : theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      borderColor: option.color || theme.palette.primary.main,
      backgroundColor: alpha(option.color || theme.palette.primary.main, 0.05)
    }
  });

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      
      <Grid container spacing={1.5}>
        {options.map((option, index) => (
          <Grid item {...columns} key={option.value || option.label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card
                sx={getCardStyles(isSelected(option), option)}
                onClick={() => handleSelection(option)}
              >
                <CardContent 
                  sx={{ 
                    p: size === 'small' ? 1 : 1.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '&:last-child': { pb: size === 'small' ? 1 : 1.5 }
                  }}
                >
                  {/* Icon or Avatar */}
                  {option.icon && (
                    <Avatar 
                      sx={{ 
                        width: size === 'small' ? 24 : size === 'large' ? 40 : 32,
                        height: size === 'small' ? 24 : size === 'large' ? 40 : 32,
                        backgroundColor: alpha(option.color || theme.palette.primary.main, 0.1),
                        color: option.color || theme.palette.primary.main,
                        mb: size === 'small' ? 0.5 : 1,
                        fontSize: size === 'small' ? '0.8rem' : '1rem'
                      }}
                    >
                      {typeof option.icon === 'string' ? option.icon : option.icon}
                    </Avatar>
                  )}
                  
                  {/* Label */}
                  <Typography 
                    variant={size === 'small' ? 'caption' : 'body2'}
                    sx={{ 
                      fontWeight: isSelected(option) ? 600 : 500,
                      color: isSelected(option) 
                        ? option.color || theme.palette.primary.main
                        : theme.palette.text.primary,
                      lineHeight: 1.2,
                      textAlign: 'center'
                    }}
                  >
                    {option.label}
                  </Typography>

                  {/* Subtitle */}
                  {option.subtitle && size !== 'small' && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ mt: 0.5, textAlign: 'center' }}
                    >
                      {option.subtitle}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      {/* Selected values display for multi-select */}
      {multiSelect && Array.isArray(value) && value.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Selected ({value.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {value.map((val, idx) => (
              <Chip 
                key={idx}
                label={val}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => {
                  const newValue = value.filter(v => v !== val);
                  onChange(newValue);
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QuickValueSelector;