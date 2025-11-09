import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logger from '../utils/logger';

/**
 * Custom hook to fetch active video testimonials from Firestore
 * @returns {Object} { testimonials, loading, error }
 */
export const useVideoTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all documents without any query filters to avoid index requirements
        // This works immediately without waiting for index to build
        const testimonialsRef = collection(db, 'videoTestimonials');
        const querySnapshot = await getDocs(testimonialsRef);
        
        const testimonialsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          // Filter and sort client-side (no index needed)
          .filter(testimonial => testimonial.isActive === true)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log('✅ Successfully fetched video testimonials:', testimonialsData.length);
        setTestimonials(testimonialsData);
      } catch (err) {
        console.error('❌ Error fetching video testimonials:', err);
        logger.error('Error fetching video testimonials:', err);
        setError('Failed to load testimonials');
        // Set empty array on error so component doesn't break
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};
