import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useTestimonials = (user = null) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const testimonialsCollection = collection(db, "testimonials");
      let q;

      if (user && user.uid) {
        // Query for user-specific testimonials
        q = query(
          testimonialsCollection,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
      } else {
        // Query for all testimonials when no user is provided
        q = query(testimonialsCollection, orderBy("createdAt", "desc"));
      }

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const testimonialsData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            testimonialsData.push({
              id: doc.id,
              brand: data.brand,
              content: data.content,
              createdAt: data.createdAt,
              rating: data.rating,
              userId: data.userId,
              userName: data.userName,
            });
          });
          setTestimonials(testimonialsData);
          setLoading(false);
        },
        (error) => {
          console.error("Error listening to testimonials:", error);
          setError("Failed to load testimonials. Please try again later.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up testimonials listener:", err);
      setError("Failed to load testimonials. Please try again later.");
      setLoading(false);
    }
  }, [user]);

  return { testimonials, loading, error };
};
