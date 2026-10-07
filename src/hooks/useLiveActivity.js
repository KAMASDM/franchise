import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logger from '../utils/logger';

/**
 * Custom hook to fetch the public live activity feed from Firestore.
 * Shows recently listed (active) brands only — franchise inquiries are
 * investor PII and are deliberately not exposed on public pages.
 * Requires the composite index brands(status ASC, createdAt DESC).
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

        const brandsQuery = query(
          collection(db, 'brands'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const brandsSnapshot = await getDocs(brandsQuery);

        const brandActivities = brandsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: `brand-${doc.id}`,
            type: 'listing',
            brand: data.brandName || data.name || 'New Brand',
            location: data.brandLocation || data.city || null,
            timestamp: data.createdAt?.toDate?.() || new Date(),
            color: 'info',
            investment: data.brandInvestment
          };
        });

        setActivities(brandActivities);
      } catch (err) {
        logger.error('Error fetching live activities:', err);
        setError('Failed to load live activities');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};

export default useLiveActivity;
