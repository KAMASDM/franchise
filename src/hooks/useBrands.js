import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, limit as firestoreLimit } from "firebase/firestore";

export const useBrands = (user = null, options = {}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        const brandsCollection = collection(db, "brands");
        let queryConstraints = [];

        // If user is provided, show all their brands (any status)
        // If no user, only show active brands (public view)
        if (user && user.uid) {
          queryConstraints.push(where("userId", "==", user.uid));
        } else {
          queryConstraints.push(where("status", "==", "active"));
        }

        if (options.limit) {
          queryConstraints.push(firestoreLimit(options.limit));
        }
        
        const q = query(brandsCollection, ...queryConstraints);

        const querySnapshot = await getDocs(q);
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBrands(brandsData);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [user?.uid, options.limit]);

  return { brands, loading, error };
};