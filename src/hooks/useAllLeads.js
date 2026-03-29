import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

/**
 * Custom hook to fetch ALL franchise inquiries (leads) for the admin dashboard.
 * Uses a real-time listener so new leads appear instantly.
 */
export const useAllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const leadsCollection = collection(db, "brandfranchiseInquiry");
    const q = query(leadsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const leadsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Normalise to JS Date so all consumers get a consistent type
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null,
        }));
        setLeads(leadsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching all leads:", err);
        setError("Failed to load franchise leads.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { leads, loading, error, setLeads };
};