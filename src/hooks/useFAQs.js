import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const useFAQs = (user = null) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);

      try {
        const faqsCollection = collection(db, "faqs");
        let q = query(faqsCollection, orderBy("createdAt", "desc"));

        if (user && user.uid) {
          q = query(q, where("userId", "==", user.uid));
        }

        const querySnapshot = await getDocs(q);
        const faqsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setFaqs(faqsData);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [user]);

  return { faqs, loading, error };
};
