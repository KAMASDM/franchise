import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; // Corrected import

export const useAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                const usersRef = collection(db, 'users');
                const q = query(usersRef, orderBy('lastLogin', 'desc')); // Now 'query' is defined
                const querySnapshot = await getDocs(q);
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message || "Failed to load users");
                setUsers([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};