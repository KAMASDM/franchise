import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  updateDoc, 
  doc 
} from "firebase/firestore";

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const notificationsRef = collection(db, "users", user.uid, "notifications");
      const q = query(
        notificationsRef,
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const notificationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
          }));
          
          setNotifications(notificationsData);
          setUnreadCount(notificationsData.filter(n => !n.read).length);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching notifications:", err);
          setError("Failed to load notifications");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up notifications listener:", err);
      setError("Failed to setup notifications");
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "users", user.uid, "notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const updatePromises = unreadNotifications.map(notification => 
        updateDoc(doc(db, "users", user.uid, "notifications", notification.id), { read: true })
      );
      await Promise.all(updatePromises);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  return { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead 
  };
};