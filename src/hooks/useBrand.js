import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc, limit as firestoreLimit } from "firebase/firestore";
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
          const brandsRef = collection(db, "brands");
          let foundBrand = null;

          // Fast path: brands created/updated since the slug field was
          // denormalized resolve with a single-document query.
          const slugSnapshot = await getDocs(
            query(brandsRef, where("slug", "==", slug), firestoreLimit(1))
          );
          if (!slugSnapshot.empty) {
            const docSnap = slugSnapshot.docs[0];
            foundBrand = { id: docSnap.id, ...docSnap.data() };
          }

          // Legacy fallback: older docs have no slug field, so derive it from
          // brandName — the user's own brands first (owners can view their
          // pending brands), then active brands (all the public can see).
          // Run scripts/backfill-brand-slugs.mjs to retire this path.
          if (!foundBrand) {
            const scans = [query(brandsRef, where("status", "==", "active"))];
            if (user?.uid) {
              scans.unshift(query(brandsRef, where("userId", "==", user.uid)));
            }

            for (const scanQuery of scans) {
              const querySnapshot = await getDocs(scanQuery);
              querySnapshot.forEach((docSnap) => {
                const brandData = docSnap.data();
                if (!foundBrand && generateBrandSlug(brandData.brandName) === slug) {
                  foundBrand = { id: docSnap.id, ...brandData };
                }
              });
              if (foundBrand) break;
            }
          }

          if (foundBrand) {
            setBrand(foundBrand);
          } else {
            setError("Brand not found");
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