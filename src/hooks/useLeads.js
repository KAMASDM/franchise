import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useLeads = (user = null) => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);

      try {
        const leadsCollection = collection(db, "brandfranchiseInquiry");
        let q;

        if (user && user.uid) {
          // Query for user-specific leads - Fixed field name to match data structure
          q = query(leadsCollection, where("brandOwnerId", "==", user.uid));
        } else {
          // No user provided, don't fetch leads
          setLeads([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate
            ? doc.data().createdAt.toDate()
            : null,
          updatedAt: doc.data().updatedAt?.toDate
            ? doc.data().updatedAt.toDate()
            : null,
        }));

        setLeads(leadsData);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to load leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [user?.uid]);

  return { leads, loading, error };
};
