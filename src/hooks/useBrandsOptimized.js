import { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, limit as firestoreLimit } from "firebase/firestore";

// Simple cache to prevent repeated API calls
const brandsCache = {
  data: null,
  timestamp: null,
  duration: 5 * 60 * 1000, // 5 minutes cache
};

export const useBrandsOptimized = (user = null, options = {}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  
  // Memoize these values to prevent unnecessary re-renders
  const limitValue = useMemo(() => options?.limit, [options?.limit]);
  const userId = useMemo(() => user?.uid, [user?.uid]);
  const cacheKey = useMemo(() => `${userId || 'public'}_${limitValue || 'all'}`, [userId, limitValue]);

  useEffect(() => {
    // Prevent duplicate fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first (only for public brands)
        if (!userId && brandsCache.data && brandsCache.timestamp) {
          const isCacheValid = Date.now() - brandsCache.timestamp < brandsCache.duration;
          if (isCacheValid) {
            console.log('Using cached brands data');
            setBrands(brandsCache.data);
            setLoading(false);
            return;
          }
        }

        console.log('Fetching brands from Firestore...');
        const brandsCollection = collection(db, "brands");
        let queryConstraints = [];

        // Optimized query constraints
        if (userId) {
          queryConstraints.push(where("userId", "==", userId));
          console.log("Fetching brands for user:", userId);
        } else {
          queryConstraints.push(where("status", "==", "active"));
          console.log("Fetching active brands (public view)");
        }

        if (limitValue) {
          queryConstraints.push(firestoreLimit(limitValue));
        }
        
        const q = query(brandsCollection, ...queryConstraints);

        const startTime = performance.now();
        const querySnapshot = await getDocs(q);
        const fetchTime = performance.now() - startTime;
        
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`✅ Fetched ${brandsData.length} brands in ${fetchTime.toFixed(2)}ms`);

        // Cache public brands only
        if (!userId) {
          brandsCache.data = brandsData;
          brandsCache.timestamp = Date.now();
          console.log('Brands cached for future requests');
        }

        setBrands(brandsData);
      } catch (err) {
        console.error("❌ Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [userId, limitValue]); // Only depend on essential values

  return { brands, loading, error };
};

// Export original hook as well for backward compatibility
// export { useBrands } from './useBrands';