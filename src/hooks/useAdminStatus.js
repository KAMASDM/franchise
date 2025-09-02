import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useAdminStatus = () => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (user) {
                const adminRef = doc(db, 'admins', user.uid);
                const adminDoc = await getDoc(adminRef);
                setIsAdmin(adminDoc.exists());
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        };

        checkAdmin();
    }, [user]);

    return { isAdmin, loading };
};