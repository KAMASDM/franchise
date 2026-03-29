import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

export const useAllBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const brandsCollection = collection(db, "brands");
    const q = query(brandsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrands(brandsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching all brands for admin:", err);
        setError("Failed to load brands for admin.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { brands, loading, error, setBrands };
};