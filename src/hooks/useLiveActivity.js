import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
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

        const isSignedIn = !!auth.currentUser;

        // Fetch recent brand registrations (publicly readable)
        const brandsRef = collection(db, 'brands');
        const brandsQuery = query(
          brandsRef,
          orderBy('createdAt', 'desc'),
          limit(10)
        );

        const promises = [getDocs(brandsQuery)];

        // Only fetch inquiry data for authenticated users
        let inquiriesSnapshot = null;
        if (isSignedIn) {
          const inquiriesRef = collection(db, 'brandfranchiseInquiry');
          const inquiriesQuery = query(
            inquiriesRef,
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          promises.unshift(getDocs(inquiriesQuery));
        }

        const results = await Promise.all(promises);
        const brandsSnapshot = isSignedIn ? results[1] : results[0];
        if (isSignedIn) inquiriesSnapshot = results[0];

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

        // Process inquiries (authenticated only)
        const inquiryActivities = inquiriesSnapshot
          ? inquiriesSnapshot.docs.map(doc => {
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
            })
          : [];

        // Combine and sort
        const allActivities = [...inquiryActivities, ...brandActivities]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10);

        setActivities(allActivities);
      } catch (err) {
        logger.error('Error fetching live activities:', err);
        setError('Failed to load live activities');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Real-time listener — only subscribe when authenticated (brandfranchiseInquiry requires auth)
    if (!auth.currentUser) return;

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
      logger.error('Error in real-time listener:', err);
    });

    return () => unsubscribe();
  }, []);

  return { activities, loading, error };
};
