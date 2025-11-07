import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  TrendingUp,
  People,
  AccessTime,
  Whatshot,
  Star,
  CheckCircle,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

/**
 * Social Proof Components
 * Display engagement metrics, activity, and trust signals
 */

export const ViewCounter = ({ views, trending = false }) => {
  const theme = useTheme();
  
  if (!views) return null;
  
  return (
    <Chip
      icon={trending ? <TrendingUp /> : <Visibility />}
      label={`${views.toLocaleString()} views`}
      size="small"
      sx={{
        backgroundColor: trending ? 'warning.light' : 'action.hover',
        color: trending ? 'warning.dark' : 'text.secondary',
        fontWeight: 500,
      }}
    />
  );
};

export const RecentActivity = ({ count, timeframe = 'week' }) => {
  if (!count || count === 0) return null;
  
  return (
    <Tooltip title={`${count} inquiries in the past ${timeframe}`}>
      <Chip
        icon={<Whatshot />}
        label={`${count} recent inquiries`}
        size="small"
        color="error"
        variant="outlined"
      />
    </Tooltip>
  );
};

export const LiveViewers = ({ count }) => {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!count || count === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'error.main',
          animation: isLive ? 'pulse 1s infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
          },
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {count} viewing now
      </Typography>
    </Box>
  );
};

export const PopularityBadge = ({ rank, total }) => {
  if (!rank) return null;

  const isTop = rank <= 10;
  
  return (
    <Chip
      icon={<Star />}
      label={isTop ? `Top ${rank}` : `#${rank} of ${total}`}
      size="small"
      color={isTop ? 'warning' : 'default'}
      sx={{
        fontWeight: 'bold',
      }}
    />
  );
};

export const VerifiedBadge = ({ verified }) => {
  if (!verified) return null;

  return (
    <Tooltip title="Verified Brand Owner">
      <Chip
        icon={<CheckCircle />}
        label="Verified"
        size="small"
        color="success"
        sx={{ fontWeight: 500 }}
      />
    </Tooltip>
  );
};

export const ResponseTime = ({ averageMinutes }) => {
  if (!averageMinutes) return null;

  const getResponseText = (minutes) => {
    if (minutes < 60) return `~${minutes} min`;
    if (minutes < 1440) return `~${Math.round(minutes / 60)} hr`;
    return `~${Math.round(minutes / 1440)} days`;
  };

  const isFast = averageMinutes < 120; // Less than 2 hours

  return (
    <Tooltip title="Average response time to inquiries">
      <Chip
        icon={<AccessTime />}
        label={`Responds in ${getResponseText(averageMinutes)}`}
        size="small"
        color={isFast ? 'success' : 'default'}
        variant="outlined"
      />
    </Tooltip>
  );
};

export const TrustScore = ({ score, maxScore = 100 }) => {
  if (!score) return null;

  const percentage = (score / maxScore) * 100;
  const color = percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Trust Score:
      </Typography>
      <Chip
        label={`${Math.round(percentage)}%`}
        size="small"
        color={color}
        sx={{ fontWeight: 'bold' }}
      />
    </Box>
  );
};

export const RecentInquiryProof = ({ recentInquiries = [] }) => {
  if (!recentInquiries || recentInquiries.length === 0) return null;

  // Get last 3 inquiries
  const recent = recentInquiries.slice(0, 3);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        Recent Interest:
      </Typography>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {recent.map((inquiry, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              backgroundColor: 'action.hover',
              borderRadius: 1,
            }}
          >
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
              {inquiry.name?.[0] || '?'}
            </Avatar>
            <Typography variant="caption">
              <strong>{inquiry.location || 'Someone'}</strong> inquired{' '}
              {inquiry.timestamp && formatDistanceToNow(inquiry.timestamp, { addSuffix: true })}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export const SocialProofBar = ({ brand, views, inquiries, responseTime }) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <ViewCounter views={views?.total} trending={views?.trending} />
      <RecentActivity count={inquiries?.recent} />
      {views?.live > 0 && <LiveViewers count={views.live} />}
      {brand?.verified && <VerifiedBadge verified={true} />}
      {responseTime && <ResponseTime averageMinutes={responseTime} />}
    </Stack>
  );
};

export default SocialProofBar;
