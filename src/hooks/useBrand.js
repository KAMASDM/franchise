import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { generateBrandSlug } from "../utils/brandUtils";

// The hook now accepts an object with either a brandName, slug, or an id
export const useBrand = ({ brandName, slug, id }, user = null) => {
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

      if (!id && !brandName && !slug) {
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
        } else if (slug) {
          // If a slug is provided, fetch all brands and find matching slug
          const brandsRef = collection(db, "brands");
          const querySnapshot = await getDocs(brandsRef);
          
          console.log(`[useBrand] Searching for slug: "${slug}"`);
          console.log(`[useBrand] Found ${querySnapshot.docs.length} total brands in database`);
          
          let foundBrand = null;
          const availableSlugsMissed = [];
          
          querySnapshot.forEach((doc) => {
            const brandData = doc.data();
            const brandSlug = generateBrandSlug(brandData.brandName);
            availableSlugsMissed.push({ 
              brandName: brandData.brandName, 
              generatedSlug: brandSlug,
              docId: doc.id
            });
            
            if (brandSlug === slug) {
              foundBrand = { id: doc.id, ...brandData };
              console.log(`[useBrand] Found matching brand: ${brandData.brandName}`);
            }
          });

          if (foundBrand) {
            setBrand(foundBrand);
          } else {
            console.log(`[useBrand] No match found for slug "${slug}"`);
            console.log(`[useBrand] Available brands and their slugs:`, availableSlugsMissed);
            setError(`Brand not found with the provided slug "${slug}". Available brands: ${availableSlugsMissed.length}`);
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
  }, [brandName, slug, id, user]);

  return { brand, setBrand: setBrandLocally, loading, error };
};

export default useBrand;