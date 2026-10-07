import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useAdminStatus = () => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    // Which uid the current isAdmin answer belongs to — until it matches the
    // signed-in user we're still loading (avoids a stale "not admin" flash
    // that made AdminRoute bounce hard-refreshed /admin URLs to /dashboard).
    const [checkedUid, setCheckedUid] = useState(undefined);

    useEffect(() => {
        if (authLoading) return;
        let cancelled = false;

        const checkAdmin = async () => {
            let admin = false;
            if (user) {
                try {
                    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                    admin = adminDoc.exists();
                } catch {
                    admin = false;
                }
            }
            if (!cancelled) {
                setIsAdmin(admin);
                setCheckedUid(user?.uid ?? null);
            }
        };

        checkAdmin();
        return () => { cancelled = true; };
    }, [user, authLoading]);

    const loading = authLoading || checkedUid !== (user?.uid ?? null);

    return { isAdmin: loading ? false : isAdmin, loading };
};
