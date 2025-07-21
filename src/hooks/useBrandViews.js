import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useBrandViews = (user = null) => {
  const [brandViews, setBrandViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandViews = async () => {
      setLoading(true);
      setError(null);

      try {
        const viewsCollection = collection(db, "brandViews");
        let q;

        if (user && user.uid) {
          // Query for user-specific brand views
          q = query(viewsCollection, where("brandOwnerId", "==", user.uid));
        } else {
          // No query - we won't fetch any views if no user is provided
          setBrandViews([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(q);
        const viewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBrandViews(viewsData);
      } catch (err) {
        console.error("Error fetching brand views:", err);
        setError("Failed to load brand views. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandViews();
  }, [user]);

  return { brandViews, loading, error };
};
