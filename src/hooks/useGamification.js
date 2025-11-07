import { useState, useEffect, useCallback } from 'react';

/**
 * Gamification System Hook
 * 
 * Tracks user progress and awards badges for various achievements
 */

const STORAGE_KEY = 'user_progress';
const BADGES_KEY = 'earned_badges';

// Badge definitions
export const BADGES = {
  // Profile completion
  PROFILE_COMPLETE: {
    id: 'profile_complete',
    name: 'Profile Master',
    description: 'Complete your profile with all details',
    icon: '👤',
    tier: 'bronze',
    points: 10,
  },
  
  // Browsing achievements
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    description: 'View 10 different brands',
    icon: '🔍',
    tier: 'bronze',
    points: 15,
    requirement: 10,
  },
  RESEARCHER: {
    id: 'researcher',
    name: 'Researcher',
    description: 'View 50 different brands',
    icon: '📊',
    tier: 'silver',
    points: 50,
    requirement: 50,
  },
  BRAND_EXPERT: {
    id: 'brand_expert',
    name: 'Brand Expert',
    description: 'View 100 different brands',
    icon: '🎓',
    tier: 'gold',
    points: 100,
    requirement: 100,
  },
  
  // Engagement achievements
  FIRST_INQUIRY: {
    id: 'first_inquiry',
    name: 'Taking Action',
    description: 'Submit your first franchise inquiry',
    icon: '✉️',
    tier: 'bronze',
    points: 20,
  },
  ACTIVE_SEEKER: {
    id: 'active_seeker',
    name: 'Active Seeker',
    description: 'Submit 5 franchise inquiries',
    icon: '🚀',
    tier: 'silver',
    points: 75,
    requirement: 5,
  },
  SERIOUS_INVESTOR: {
    id: 'serious_investor',
    name: 'Serious Investor',
    description: 'Submit 10 franchise inquiries',
    icon: '💼',
    tier: 'gold',
    points: 150,
    requirement: 10,
  },
  
  // Favorites achievements
  COLLECTOR: {
    id: 'collector',
    name: 'Collector',
    description: 'Save 5 brands to favorites',
    icon: '⭐',
    tier: 'bronze',
    points: 10,
    requirement: 5,
  },
  CURATOR: {
    id: 'curator',
    name: 'Curator',
    description: 'Save 20 brands to favorites',
    icon: '📚',
    tier: 'silver',
    points: 40,
    requirement: 20,
  },
  
  // Comparison achievements
  DECISION_MAKER: {
    id: 'decision_maker',
    name: 'Decision Maker',
    description: 'Compare 3 or more brands',
    icon: '⚖️',
    tier: 'bronze',
    points: 15,
  },
  
  // Time-based achievements
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Visit during early hours (6am-9am)',
    icon: '🌅',
    tier: 'bronze',
    points: 5,
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visit during late hours (10pm-2am)',
    icon: '🦉',
    tier: 'bronze',
    points: 5,
  },
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Active on both Saturday and Sunday',
    icon: '📅',
    tier: 'bronze',
    points: 10,
  },
  
  // Streak achievements
  CONSISTENT: {
    id: 'consistent',
    name: 'Consistent',
    description: 'Visit 3 days in a row',
    icon: '🔥',
    tier: 'bronze',
    points: 20,
    requirement: 3,
  },
  DEDICATED: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Visit 7 days in a row',
    icon: '💪',
    tier: 'silver',
    points: 50,
    requirement: 7,
  },
  
  // Special achievements
  PIONEER: {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'One of the first 100 users',
    icon: '🏆',
    tier: 'platinum',
    points: 200,
  },
  AMBASSADOR: {
    id: 'ambassador',
    name: 'Ambassador',
    description: 'Share 10 brands with others',
    icon: '📢',
    tier: 'gold',
    points: 100,
    requirement: 10,
  },
};

export const useGamification = () => {
  const [progress, setProgress] = useState({
    brandsViewed: [],
    inquiriesSubmitted: 0,
    favoritesSaved: 0,
    comparisons: 0,
    shares: 0,
    visitDays: [],
    currentStreak: 0,
  });
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      const savedBadges = localStorage.getItem(BADGES_KEY);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }

      if (savedBadges) {
        const badges = JSON.parse(savedBadges);
        setEarnedBadges(badges);
        setTotalPoints(badges.reduce((sum, badge) => sum + (BADGES[badge]?.points || 0), 0));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
      checkForNewBadges(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, []);

  // Check if user earned new badges
  const checkForNewBadges = useCallback((currentProgress) => {
    const newBadges = [];

    // Check each badge requirement
    Object.entries(BADGES).forEach(([key, badge]) => {
      if (earnedBadges.includes(key)) return; // Already earned

      let earned = false;

      switch (key) {
        case 'EXPLORER':
          earned = currentProgress.brandsViewed.length >= 10;
          break;
        case 'RESEARCHER':
          earned = currentProgress.brandsViewed.length >= 50;
          break;
        case 'BRAND_EXPERT':
          earned = currentProgress.brandsViewed.length >= 100;
          break;
        case 'FIRST_INQUIRY':
          earned = currentProgress.inquiriesSubmitted >= 1;
          break;
        case 'ACTIVE_SEEKER':
          earned = currentProgress.inquiriesSubmitted >= 5;
          break;
        case 'SERIOUS_INVESTOR':
          earned = currentProgress.inquiriesSubmitted >= 10;
          break;
        case 'COLLECTOR':
          earned = currentProgress.favoritesSaved >= 5;
          break;
        case 'CURATOR':
          earned = currentProgress.favoritesSaved >= 20;
          break;
        case 'DECISION_MAKER':
          earned = currentProgress.comparisons >= 1;
          break;
        case 'AMBASSADOR':
          earned = currentProgress.shares >= 10;
          break;
        case 'CONSISTENT':
          earned = currentProgress.currentStreak >= 3;
          break;
        case 'DEDICATED':
          earned = currentProgress.currentStreak >= 7;
          break;
        case 'EARLY_BIRD':
          const hour = new Date().getHours();
          earned = hour >= 6 && hour < 9;
          break;
        case 'NIGHT_OWL':
          const nightHour = new Date().getHours();
          earned = nightHour >= 22 || nightHour < 2;
          break;
        default:
          break;
      }

      if (earned) {
        newBadges.push(key);
      }
    });

    if (newBadges.length > 0) {
      const updatedBadges = [...earnedBadges, ...newBadges];
      localStorage.setItem(BADGES_KEY, JSON.stringify(updatedBadges));
      setEarnedBadges(updatedBadges);
      
      const newPoints = newBadges.reduce((sum, badge) => sum + (BADGES[badge]?.points || 0), 0);
      setTotalPoints(prev => prev + newPoints);

      return newBadges.map(key => BADGES[key]);
    }

    return [];
  }, [earnedBadges]);

  // Track brand view
  const trackBrandView = useCallback((brandId) => {
    const viewedSet = new Set(progress.brandsViewed);
    if (!viewedSet.has(brandId)) {
      viewedSet.add(brandId);
      const newProgress = {
        ...progress,
        brandsViewed: Array.from(viewedSet),
      };
      saveProgress(newProgress);
    }
  }, [progress, saveProgress]);

  // Track inquiry submission
  const trackInquiry = useCallback(() => {
    const newProgress = {
      ...progress,
      inquiriesSubmitted: progress.inquiriesSubmitted + 1,
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Track favorite
  const trackFavorite = useCallback(() => {
    const newProgress = {
      ...progress,
      favoritesSaved: progress.favoritesSaved + 1,
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Track comparison
  const trackComparison = useCallback(() => {
    const newProgress = {
      ...progress,
      comparisons: progress.comparisons + 1,
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Track share
  const trackShare = useCallback(() => {
    const newProgress = {
      ...progress,
      shares: progress.shares + 1,
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  // Track daily visit
  const trackVisit = useCallback(() => {
    const today = new Date().toDateString();
    if (!progress.visitDays.includes(today)) {
      const newVisitDays = [...progress.visitDays, today];
      const newStreak = calculateStreak(newVisitDays);
      
      const newProgress = {
        ...progress,
        visitDays: newVisitDays,
        currentStreak: newStreak,
      };
      saveProgress(newProgress);
    }
  }, [progress, saveProgress]);

  // Get progress percentage for next badge
  const getNextBadgeProgress = useCallback(() => {
    const unearnedBadges = Object.entries(BADGES)
      .filter(([key]) => !earnedBadges.includes(key))
      .map(([key, badge]) => ({ key, ...badge }));

    if (unearnedBadges.length === 0) return null;

    // Find the closest achievable badge
    const nextBadge = unearnedBadges.find(badge => {
      if (badge.key.includes('EXPLORER') || badge.key.includes('RESEARCHER') || badge.key.includes('BRAND_EXPERT')) {
        return progress.brandsViewed.length < badge.requirement;
      }
      if (badge.key.includes('INQUIRY')) {
        return progress.inquiriesSubmitted < (badge.requirement || 1);
      }
      if (badge.key.includes('COLLECTOR') || badge.key.includes('CURATOR')) {
        return progress.favoritesSaved < badge.requirement;
      }
      return true;
    });

    if (!nextBadge) return unearnedBadges[0];

    return nextBadge;
  }, [progress, earnedBadges]);

  return {
    progress,
    earnedBadges: earnedBadges.map(key => BADGES[key]),
    totalPoints,
    loading,
    trackBrandView,
    trackInquiry,
    trackFavorite,
    trackComparison,
    trackShare,
    trackVisit,
    getNextBadgeProgress,
  };
};

// Helper function to calculate visit streak
const calculateStreak = (visitDays) => {
  if (visitDays.length === 0) return 0;

  const sortedDays = visitDays
    .map(day => new Date(day))
    .sort((a, b) => b - a);

  let streak = 1;
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const diff = (sortedDays[i] - sortedDays[i + 1]) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export default useGamification;
