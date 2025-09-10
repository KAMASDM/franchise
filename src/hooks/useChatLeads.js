import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export const useChatLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const leadsCollection = collection(db, "chatLeads");
        const q = query(leadsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null,
        }));
        setLeads(leadsData);
      } catch (err) {
        console.error("Error fetching chat leads:", err);
        setError("Failed to load chat leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatLeads();
  }, []);

  return { leads, loading, error, setLeads };
};