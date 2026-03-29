import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const useAdminStats = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBrands: 0,
        pendingBrands: 0,
        activeBrands: 0,
        totalLeads: 0,
        totalViews: 0,
    });
    const [loading, setLoading] = useState(true);
    // Track per-collection readiness
    const [ready, setReady] = useState({ users: false, brands: false, leads: false, views: false });
    const [counts, setCounts] = useState({ users: 0, brands: 0, leads: 0, views: 0, pending: 0, active: 0 });

    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
            setCounts(prev => ({ ...prev, users: snap.size }));
            setReady(prev => ({ ...prev, users: true }));
        });

        const unsubBrands = onSnapshot(collection(db, 'brands'), (snap) => {
            let pending = 0;
            let active = 0;
            snap.forEach(doc => {
                if (doc.data().status === 'pending') pending++;
                if (doc.data().status === 'active') active++;
            });
            setCounts(prev => ({ ...prev, brands: snap.size, pending, active }));
            setReady(prev => ({ ...prev, brands: true }));
        });

        const unsubLeads = onSnapshot(collection(db, 'brandfranchiseInquiry'), (snap) => {
            setCounts(prev => ({ ...prev, leads: snap.size }));
            setReady(prev => ({ ...prev, leads: true }));
        });

        const unsubViews = onSnapshot(collection(db, 'brandViews'), (snap) => {
            const totalViews = snap.docs.reduce((sum, doc) => sum + (doc.data().totalViews || 0), 0);
            setCounts(prev => ({ ...prev, views: totalViews }));
            setReady(prev => ({ ...prev, views: true }));
        });

        return () => {
            unsubUsers();
            unsubBrands();
            unsubLeads();
            unsubViews();
        };
    }, []);

    useEffect(() => {
        if (ready.users && ready.brands && ready.leads && ready.views) {
            setStats({
                totalUsers: counts.users,
                totalBrands: counts.brands,
                pendingBrands: counts.pending,
                activeBrands: counts.active,
                totalLeads: counts.leads,
                totalViews: counts.views,
            });
            setLoading(false);
        }
    }, [ready, counts]);

    return { stats, loading };
};