import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export const useAllBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        const brandsCollection = collection(db, "brands");
        const q = query(brandsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrands(brandsData);
      } catch (err) {
        console.error("Error fetching all brands for admin:", err);
        setError("Failed to load brands for admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBrands();
  }, []);

  return { brands, loading, error, setBrands };
};