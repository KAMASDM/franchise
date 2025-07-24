import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useBrand = (brandName, user = null) => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, "brands"),
          where("brandName", "==", brandName)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setBrand({ id: doc.id, ...doc.data() });
          });
        } else {
          setError("Brand not found");
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("Failed to load brand data");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [brandName, user]);

  return { brand, loading, error };
};
