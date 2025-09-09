import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

/**
 * Custom hook to fetch ALL franchise inquiries (leads) for the admin dashboard.
 * It retrieves all documents from the 'brandfranchiseInquiry' collection.
 */
export const useAllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const leadsCollection = collection(db, "brandfranchiseInquiry");
        const q = query(leadsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Ensure createdAt is a JS Date object for sorting/display
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null,
        }));
        setLeads(leadsData);
      } catch (err) {
        console.error("Error fetching all leads:", err);
        setError("Failed to load franchise leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllLeads();
  }, []);

  return { leads, loading, error };
};

