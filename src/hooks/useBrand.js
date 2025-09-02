import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

<<<<<<< HEAD
const useBrand = (id) => {
=======
export const useBrand = (brandName, user = null) => {
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
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
<<<<<<< HEAD
  }, [id]);
=======
  }, [brandName, user]);
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd

  return { brand, setBrand: setBrandLocally, loading, error };
};

export default useBrand;