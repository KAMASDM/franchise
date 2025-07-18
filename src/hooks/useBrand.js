import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useBrand = (id, user = null) => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, "brands", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBrand({ id: docSnap.id, ...docSnap.data() });
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
  }, [id, user]);

  return { brand, loading, error };
};
