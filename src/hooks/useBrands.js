import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, limit as firestoreLimit } from "firebase/firestore";

export const useBrands = (user = null, options = {}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Memoize these values to prevent unnecessary re-renders
  const limitValue = useMemo(() => options?.limit, [options?.limit]);
  const userId = useMemo(() => user?.uid, [user?.uid]);

  useEffect(() => {
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
          console.log("Fetching brands for user:", userId);
        } else {
          queryConstraints.push(where("status", "==", "active"));
          console.log("Fetching active brands (public view)");
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

        console.log(`Found ${brandsData.length} brands`, userId ? `for user ${userId}` : '(public)');
        setBrands(brandsData);
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