import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export const useAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('lastLogin', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching users:', err);
                setError(err.message || 'Failed to load users');
                setUsers([]);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { users, loading, error };
};