import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

/**
 * Custom hook to fetch all brand view analytics for the admin dashboard.
 * It retrieves all documents from the 'brandViews' collection.
 */
export const useAllBrandViews = () => {
  const [brandViews, setBrandViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBrandViews = async () => {
      setLoading(true);
      setError(null);
      try {
        const viewsCollection = collection(db, "brandViews");
        const q = query(viewsCollection, orderBy("totalViews", "desc"));
        const querySnapshot = await getDocs(q);
        const viewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrandViews(viewsData);
      } catch (err)
      {
        console.error("Error fetching all brand views:", err);
        setError("Failed to load brand analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBrandViews();
  }, []);

  return { brandViews, loading, error };
};
