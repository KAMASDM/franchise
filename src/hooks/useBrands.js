import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, limit as firestoreLimit } from "firebase/firestore";

export const useBrands = (user = null, options = {}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use refs to track if we've already fetched to prevent double fetching
  const hasFetched = useRef(false);
  const limitValue = options.limit;
  const userId = user?.uid;

  useEffect(() => {
    // Skip if already fetched on initial mount
    if (hasFetched.current && !userId && !limitValue) {
      return;
    }

    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
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

        setBrands(brandsData);
        hasFetched.current = true;
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [userId, limitValue]);

  return { brands, loading, error };
};