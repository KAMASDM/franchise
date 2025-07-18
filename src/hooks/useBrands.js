import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useBrands = (user = null) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        const brandsCollection = collection(db, "brands");
        let q;

        if (user && user.uid) {
          // Query for user-specific brands
          q = query(
            brandsCollection,
            where("status", "==", "active"),
            where("userId", "==", user.uid)
          );
        } else {
          // Query for all active brands when no user is provided
          q = query(brandsCollection, where("status", "==", "active"));
        }

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
  }, [user]);

  return { brands, loading, error };
};
