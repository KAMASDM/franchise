import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logger from '../utils/logger';

/**
 * Custom hook to fetch About Us content from Firestore
 * @returns {Object} { aboutData, loading, error }
 */
export const useAboutUsContent = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, 'aboutUs', 'content');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          // Return default data if no content exists yet
          setAboutData(getDefaultAboutData());
        }
      } catch (err) {
        logger.error('Error fetching About Us data:', err);
        setError('Failed to load About Us content');
        // Use default data on error
        setAboutData(getDefaultAboutData());
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return { aboutData, loading, error };
};

// Default About Us data if nothing is in Firestore yet
const getDefaultAboutData = () => ({
  heroTitle: 'About ikama - Franchise Hub',
  heroSubtitle: 'Your trusted partner in franchise success',
  missionStatement: 'Our mission is to connect aspiring entrepreneurs with the perfect franchise opportunities.',
  visionStatement: 'To be the leading platform for franchise discovery and success worldwide.',
  stats: [
    { number: '500+', label: 'Franchise Brands', icon: 'Business' },
    { number: '5,000+', label: 'Successful Placements', icon: 'TrendingUp' },
    { number: '95%', label: 'Client Satisfaction', icon: 'Star' },
    { number: '15+', label: 'Years Experience', icon: 'Timeline' },
  ],
  values: [
    {
      title: 'Transparency',
      description: 'We provide honest, accurate information about every franchise opportunity.',
      icon: 'Verified',
    },
    {
      title: 'Expert Guidance',
      description: 'Our experienced consultants offer personalized advice throughout your journey.',
      icon: 'Support',
    },
    {
      title: 'Proven Results',
      description: 'Our track record speaks for itself with thousands of successful franchisees.',
      icon: 'TrendingUp',
    },
    {
      title: 'Long-term Partnership',
      description: 'We support you beyond the initial investment with ongoing guidance.',
      icon: 'People',
    },
  ],
  teamMembers: [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      experience: '20+ years in franchising',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      position: 'VP of Business Development',
      experience: 'Former franchise owner',
      avatar: 'MC',
    },
    {
      name: 'Lisa Rodriguez',
      position: 'Senior Franchise Consultant',
      experience: '15+ years consulting',
      avatar: 'LR',
    },
    {
      name: 'David Thompson',
      position: 'Financial Advisor',
      experience: 'Franchise financing expert',
      avatar: 'DT',
    },
  ],
  achievements: [
    'Recognized as "Best Franchise Consultant" by Franchise Times',
    'Member of International Franchise Association (IFA)',
    'Certified Franchise Executive (CFE) designation',
    'BBB A+ Rating with 5-star customer reviews',
    'Featured in Entrepreneur Magazine and Forbes',
  ],
  ctaTitle: 'Ready to Start Your Franchise Journey?',
  ctaDescription: 'Explore our extensive database of franchise opportunities and take the first step toward business ownership.',
  heroImage: '',
});
