import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const useBrand = (id) => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function now returns the brand state and its setter
  const setBrandLocally = (newBrand) => {
      setBrand(newBrand);
  };

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setLoading(false);
        setError("No brand ID provided.");
        return;
      }

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
        // Check for permission errors which might indicate a rules issue
        if (err.code === 'permission-denied') {
            setError("You do not have permission to view this brand. If it is pending, please log in as an admin.");
        } else {
            setError("Failed to load brand data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  return { brand, setBrand: setBrandLocally, loading, error };
};

export default useBrand;