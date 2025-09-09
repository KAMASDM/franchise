import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

// The hook now accepts an object with either a brandName or an id
export const useBrand = ({ brandName, id }, user = null) => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setBrandLocally = (newBrand) => {
    setBrand(newBrand);
  };

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);

      if (!id && !brandName) {
        setLoading(false);
        setError("No brand identifier provided.");
        return;
      }

      try {
        if (id) {
          // If an ID is provided, fetch the document directly
          const docRef = doc(db, "brands", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBrand({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError("Brand not found with the provided ID.");
          }
        } else if (brandName) {
          // If a brandName is provided, query the collection
          const q = query(
            collection(db, "brands"),
            where("brandName", "==", brandName)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const brandDoc = querySnapshot.docs[0];
            setBrand({ id: brandDoc.id, ...brandDoc.data() });
          } else {
            setError("Brand not found with the provided name.");
          }
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
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
  }, [brandName, id, user]);

  return { brand, setBrand: setBrandLocally, loading, error };
};

export default useBrand;