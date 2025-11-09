import React from 'react';
import {
  Tooltip,
  IconButton,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  HelpOutline as HelpIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';

/**
 * FieldHelp Component
 * Displays contextual help information for form fields
 * 
 * @param {string} title - The help tooltip title
 * @param {string} why - Explanation of why this information is needed
 * @param {string} example - Example of what to enter
 * @param {string} tip - Additional helpful tip
 */
const FieldHelp = ({ title, why, example, tip }) => {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          {title && (
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
          )}
          
          {why && (
            <>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'info.light' }}>
                Why we ask this:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                {why}
              </Typography>
            </>
          )}
          
          {example && (
            <>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'success.light' }}>
                Example:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontFamily: 'monospace', bgcolor: 'rgba(0,0,0,0.1)', p: 0.5, borderRadius: 0.5 }}>
                {example}
              </Typography>
            </>
          )}
          
          {tip && (
            <>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'warning.light' }}>
                Tip:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                {tip}
              </Typography>
            </>
          )}
        </Box>
      }
      arrow
      placement="right"
      enterDelay={200}
      leaveDelay={200}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 3,
            maxWidth: 350,
            border: '1px solid',
            borderColor: 'divider'
          }
        },
        arrow: {
          sx: {
            color: 'background.paper',
            '&::before': {
              border: '1px solid',
              borderColor: 'divider'
            }
          }
        }
      }}
    >
      <IconButton size="small" sx={{ ml: 0.5, opacity: 0.6, '&:hover': { opacity: 1 } }}>
        <HelpIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default FieldHelp;
