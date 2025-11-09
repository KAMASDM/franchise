import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logger from '../utils/logger';

/**
 * Custom hook to fetch live activity feed from Firestore
 * Fetches recent franchise inquiries and brand registrations
 * @returns {Object} { activities, loading, error }
 */
export const useLiveActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent franchise inquiries
        const inquiriesRef = collection(db, 'brandfranchiseInquiry');
        const inquiriesQuery = query(
          inquiriesRef,
          orderBy('createdAt', 'desc'),
          limit(10)
        );

        // Fetch recent brand registrations
        const brandsRef = collection(db, 'brands');
        const brandsQuery = query(
          brandsRef,
          orderBy('createdAt', 'desc'),
          limit(10)
        );

        const [inquiriesSnapshot, brandsSnapshot] = await Promise.all([
          getDocs(inquiriesQuery),
          getDocs(brandsQuery)
        ]);

        // Process inquiries
        const inquiryActivities = inquiriesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: `inquiry-${doc.id}`,
            type: 'registration',
            user: data.fullName || data.name || 'Someone',
            brand: data.brandName || 'a franchise',
            location: data.city || data.location || null,
            timestamp: data.createdAt?.toDate() || new Date(),
            color: 'success'
          };
        });

        // Process brand registrations
        const brandActivities = brandsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: `brand-${doc.id}`,
            type: 'listing',
            brand: data.brandName || data.name || 'New Brand',
            location: data.brandLocation || data.city || null,
            timestamp: data.createdAt?.toDate() || new Date(),
            color: 'info',
            investment: data.brandInvestment
          };
        });

        // Combine and sort by timestamp
        const allActivities = [...inquiryActivities, ...brandActivities]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Keep only 10 most recent

        console.log('✅ Fetched live activities:', allActivities.length);
        setActivities(allActivities);
      } catch (err) {
        console.error('❌ Error fetching live activities:', err);
        logger.error('Error fetching live activities:', err);
        setError('Failed to load live activities');
        // Set some default activities on error
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Optional: Set up real-time listener for new activities
    // This will update the feed in real-time when new inquiries/brands are added
    const inquiriesRef = collection(db, 'brandfranchiseInquiry');
    const inquiriesQuery = query(
      inquiriesRef,
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(inquiriesQuery, (snapshot) => {
      const newInquiries = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: `inquiry-${doc.id}`,
          type: 'registration',
          user: data.fullName || data.name || 'Someone',
          brand: data.brandName || 'a franchise',
          location: data.city || data.location || null,
          timestamp: data.createdAt?.toDate() || new Date(),
          color: 'success'
        };
      });

      setActivities(prev => {
        // Merge new inquiries with existing, remove duplicates, and sort
        const merged = [...newInquiries, ...prev.filter(a => !a.id.startsWith('inquiry-'))];
        return merged
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10);
      });
    }, (err) => {
      console.error('Error in real-time listener:', err);
    });

    return () => unsubscribe();
  }, []);

  return { activities, loading, error };
};
