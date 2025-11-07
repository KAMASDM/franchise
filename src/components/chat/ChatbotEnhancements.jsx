import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  LocationOn,
  Business,
  Help,
  Info,
  Support,
  Calculate,
  Schedule,
} from '@mui/icons-material';

/**
 * Suggested Questions Component
 * Quick-reply buttons with common questions for chatbot
 */
export const SuggestedQuestions = ({ onQuestionClick, variant = 'default' }) => {
  const questions = [
    {
      id: 'investment',
      text: 'What\'s the investment range?',
      icon: AttachMoney,
      category: 'Investment',
    },
    {
      id: 'popular',
      text: 'Show popular franchises',
      icon: TrendingUp,
      category: 'Browse',
    },
    {
      id: 'low-investment',
      text: 'Low investment options',
      icon: Calculate,
      category: 'Investment',
    },
    {
      id: 'location',
      text: 'Available locations',
      icon: LocationOn,
      category: 'Location',
    },
    {
      id: 'business-types',
      text: 'Types of franchises',
      icon: Business,
      category: 'Browse',
    },
    {
      id: 'support',
      text: 'What support is provided?',
      icon: Support,
      category: 'Support',
    },
    {
      id: 'timeline',
      text: 'How long to get started?',
      icon: Schedule,
      category: 'Process',
    },
    {
      id: 'roi',
      text: 'Expected ROI timeline',
      icon: TrendingUp,
      category: 'Investment',
    },
  ];

  // Compact variant for small spaces
  if (variant === 'compact') {
    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {questions.slice(0, 4).map(question => {
          const Icon = question.icon;
          return (
            <Tooltip key={question.id} title={question.text}>
              <IconButton
                size="small"
                onClick={() => onQuestionClick(question.text)}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>
    );
  }

  // Default variant - full with categories
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
        Quick questions:
      </Typography>
      <Stack spacing={1.5}>
        {['Investment', 'Browse', 'Support', 'Process'].map(category => {
          const categoryQuestions = questions.filter(q => q.category === category);
          if (categoryQuestions.length === 0) return null;
          
          return (
            <Box key={category}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                {category}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {categoryQuestions.map(question => {
                  const Icon = question.icon;
                  return (
                    <Chip
                      key={question.id}
                      icon={<Icon />}
                      label={question.text}
                      onClick={() => onQuestionClick(question.text)}
                      variant="outlined"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.50',
                          borderColor: 'primary.main',
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

/**
 * Contextual Quick Replies
 * Dynamic suggestions based on conversation context
 */
export const ContextualQuickReplies = ({ context, onReplyClick }) => {
  const getContextualReplies = () => {
    switch (context) {
      case 'greeting':
        return [
          'Show me popular franchises',
          'What are the investment ranges?',
          'I need help choosing',
        ];
      case 'investment':
        return [
          'Under $50,000',
          '$50,000 - $100,000',
          '$100,000 - $250,000',
          'Over $250,000',
        ];
      case 'category':
        return [
          'Food & Beverage',
          'Retail',
          'Services',
          'Health & Fitness',
          'Education',
        ];
      case 'location':
        return [
          'Urban areas',
          'Suburban areas',
          'Any location',
        ];
      case 'brand-shown':
        return [
          'Tell me more',
          'Show similar brands',
          'What\'s the ROI?',
          'Request information',
        ];
      default:
        return [
          'Yes',
          'No',
          'Tell me more',
          'Show other options',
        ];
    }
  };

  const replies = getContextualReplies();

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, my: 1 }}>
      {replies.map((reply, index) => (
        <Chip
          key={index}
          label={reply}
          onClick={() => onReplyClick(reply)}
          size="small"
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        />
      ))}
    </Stack>
  );
};

/**
 * Chatbot Help Menu
 * Shows available commands and tips
 */
export const ChatbotHelp = ({ onCommandClick }) => {
  const commands = [
    {
      command: 'Popular brands',
      description: 'Show trending franchise opportunities',
      icon: TrendingUp,
    },
    {
      command: 'Investment range',
      description: 'Filter by investment amount',
      icon: AttachMoney,
    },
    {
      command: 'Categories',
      description: 'Browse by industry type',
      icon: Business,
    },
    {
      command: 'Help',
      description: 'Get assistance',
      icon: Help,
    },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Info color="primary" />
        Quick Commands
      </Typography>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {commands.map((cmd, index) => {
          const Icon = cmd.icon;
          return (
            <Box
              key={index}
              onClick={() => onCommandClick(cmd.command)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Icon fontSize="small" color="primary" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {cmd.command}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cmd.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

/**
 * Conversation Starters
 * First-time user prompts
 */
export const ConversationStarters = ({ onStarterClick }) => {
  const starters = [
    {
      title: 'Find My Match',
      description: 'Answer a few questions to find perfect franchises',
      icon: '🎯',
    },
    {
      title: 'Browse Popular',
      description: 'See what others are interested in',
      icon: '🔥',
    },
    {
      title: 'Low Investment',
      description: 'Start with minimal capital',
      icon: '💰',
    },
    {
      title: 'High ROI',
      description: 'Maximum return potential',
      icon: '📈',
    },
  ];

  return (
    <Box>
      <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
        How can I help you today?
      </Typography>
      <Stack spacing={2}>
        {starters.map((starter, index) => (
          <Paper
            key={index}
            onClick={() => onStarterClick(starter.title)}
            sx={{
              p: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4">{starter.icon}</Typography>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {starter.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {starter.description}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default SuggestedQuestions;
