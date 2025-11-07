import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Tooltip,
  Badge as MuiBadge,
} from '@mui/material';
import {
  EmojiEvents,
  Close,
  Lock,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useGamification, { BADGES } from '../../hooks/useGamification';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

/**
 * Badge Display Component
 */
export const BadgeCard = ({ badge, earned = false, onClick }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#gray';
    }
  };

  return (
    <MotionCard
      whileHover={earned ? { scale: 1.05, boxShadow: 6 } : {}}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        opacity: earned ? 1 : 0.5,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {earned && (
        <Chip
          label={`+${badge.points} pts`}
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            zIndex: 1,
          }}
        />
      )}
      
      <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
        {!earned && (
          <Lock
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: 20,
              color: 'text.secondary',
            }}
          />
        )}
        
        <Box
          sx={{
            fontSize: 48,
            mb: 1,
            filter: earned ? 'none' : 'grayscale(100%)',
          }}
        >
          {badge.icon}
        </Box>
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {badge.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {badge.description}
        </Typography>
        
        <Chip
          label={badge.tier.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: getTierColor(badge.tier),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </CardContent>
    </MotionCard>
  );
};

/**
 * Progress Dashboard Component
 */
const GamificationDashboard = ({ compact = false }) => {
  const {
    progress,
    earnedBadges,
    totalPoints,
    loading,
    getNextBadgeProgress,
  } = useGamification();

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showAllBadges, setShowAllBadges] = useState(false);

  const nextBadge = getNextBadgeProgress();
  const totalBadges = Object.keys(BADGES).length;
  const earnedCount = earnedBadges.length;
  const completionPercentage = (earnedCount / totalBadges) * 100;

  if (loading) {
    return <Typography>Loading progress...</Typography>;
  }

  // Compact variant for sidebar
  if (compact) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEvents color="primary" />
              Your Progress
            </Typography>
            <Chip label={`${totalPoints} pts`} color="primary" />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Badges Earned
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {earnedCount}/{totalBadges}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {earnedBadges.slice(0, 6).map(badge => (
              <Tooltip key={badge.id} title={badge.name}>
                <Box sx={{ fontSize: 32 }}>
                  {badge.icon}
                </Box>
              </Tooltip>
            ))}
          </Stack>

          {nextBadge && (
            <Paper sx={{ p: 1.5, backgroundColor: 'primary.50' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Next Badge
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {nextBadge.icon} {nextBadge.name}
              </Typography>
              <Typography variant="caption">
                {nextBadge.description}
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full dashboard
  return (
    <Box>
      {/* Stats Header */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Star sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {totalPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Points
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 40, color: 'gold', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {earnedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Badges Earned
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {progress.currentStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Day Streak
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: 40, mb: 1 }}>📊</Box>
              <Typography variant="h4" fontWeight="bold">
                {completionPercentage.toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Next Badge Progress */}
      {nextBadge && (
        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'primary.50' }}>
          <Typography variant="h6" gutterBottom>
            Next Achievement
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 48 }}>{nextBadge.icon}</Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{nextBadge.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {nextBadge.description}
              </Typography>
              <Chip label={`+${nextBadge.points} points`} size="small" color="primary" />
            </Box>
          </Box>
        </Paper>
      )}

      {/* Badges Grid */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          All Badges
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`${earnedCount} Earned`} color="success" />
          <Chip label={`${totalBadges - earnedCount} Locked`} />
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {Object.entries(BADGES).map(([key, badge], index) => {
          const earned = earnedBadges.some(b => b.id === badge.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BadgeCard
                  badge={badge}
                  earned={earned}
                  onClick={() => setSelectedBadge(badge)}
                />
              </MotionBox>
            </Grid>
          );
        })}
      </Grid>

      {/* Badge Detail Dialog */}
      <Dialog
        open={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBadge && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ fontSize: 48 }}>{selectedBadge.icon}</Box>
                <Box>
                  <Typography variant="h6">{selectedBadge.name}</Typography>
                  <Chip label={selectedBadge.tier.toUpperCase()} size="small" />
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedBadge(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {selectedBadge.description}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Chip label={`${selectedBadge.points} Points`} color="primary" />
                {selectedBadge.requirement && (
                  <Chip label={`Requires: ${selectedBadge.requirement}`} />
                )}
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

/**
 * Badge Notification Component
 * Show when new badge is earned
 */
export const BadgeEarnedNotification = ({ badge, onClose }) => {
  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}
      >
        <Card sx={{ minWidth: 300, textAlign: 'center', p: 3 }}>
          <Typography variant="h5" gutterBottom>
            🎉 Badge Earned!
          </Typography>
          <Box sx={{ fontSize: 64, my: 2 }}>
            {badge.icon}
          </Box>
          <Typography variant="h6" gutterBottom>
            {badge.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {badge.description}
          </Typography>
          <Chip label={`+${badge.points} Points`} color="primary" />
        </Card>
      </MotionBox>
    </AnimatePresence>
  );
};

export default GamificationDashboard;
