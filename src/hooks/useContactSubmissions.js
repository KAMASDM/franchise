import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export const useContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const submissionsCollection = collection(db, "contactUs");
        const q = query(submissionsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const submissionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : null,
        }));
        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error fetching contact submissions:", err);
        setError("Failed to load contact submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return { submissions, loading, error, setSubmissions };
};