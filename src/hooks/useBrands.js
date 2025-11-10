import { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, limit as firestoreLimit } from "firebase/firestore";
import { fetchWithDeduplication } from "../utils/requestDeduplication";

// Create a cache outside the component to persist across re-renders
const brandsCache = {
  data: null,
  timestamp: null,
  loading: false,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBrands = (user = null, options = {}) => {
  const [brands, setBrands] = useState(brandsCache.data || []); // Always start with empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);
  
  // Memoize these values to prevent unnecessary re-renders
  const limitValue = useMemo(() => options?.limit, [options?.limit]);
  const userId = useMemo(() => user?.uid, [user?.uid]);
  const cacheKey = useMemo(() => `${userId || 'public'}-${limitValue || 'all'}`, [userId, limitValue]);

  useEffect(() => {
    const fetchBrands = async () => {
      // Prevent duplicate fetches
      if (fetchedRef.current) {
        return;
      }

      const now = Date.now();
      
      // Return cached data if valid and matches current request
      if (!userId && // Only cache public brands for now
          brandsCache.data && 
          brandsCache.timestamp && 
          (now - brandsCache.timestamp) < CACHE_DURATION) {
        fetchedRef.current = true;
        setBrands(brandsCache.data);
        setLoading(false);
        return;
      }

      const requestKey = `brands-${userId || 'public'}-${limitValue || 'all'}`;
      
      try {
        setLoading(true);
        setError(null);
        fetchedRef.current = true;
        
        const result = await fetchWithDeduplication(requestKey, async () => {
          const brandsCollection = collection(db, "brands");
          let queryConstraints = [];

          // If user is provided, show all their brands (any status)
          // If no user, only show active brands (public view)
          if (userId) {
            queryConstraints.push(where("userId", "==", userId));
          } else {
            queryConstraints.push(where("status", "==", "active"));
          }

          if (limitValue) {
            queryConstraints.push(firestoreLimit(limitValue));
          }
          
          const q = query(brandsCollection, ...queryConstraints);
          const querySnapshot = await getDocs(q);
          
          const brandsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          return brandsData;
        });

        // Update cache for public brands only
        if (!userId) {
          brandsCache.data = result;
          brandsCache.timestamp = Date.now();
        }

        setBrands(result);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [userId, limitValue]); // Keep original dependencies

  return { brands, loading, error };
};