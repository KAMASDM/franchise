import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, orderBy } from 'firebase/firestore';

export const useAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, orderBy('lastLogin', 'desc'));
                const querySnapshot = await getDocs(q);
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading };
};