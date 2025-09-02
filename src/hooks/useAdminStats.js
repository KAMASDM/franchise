import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const brandsSnapshot = await getDocs(collection(db, 'brands'));
                const leadsSnapshot = await getDocs(collection(db, 'brandfranchiseInquiry'));
                const viewsSnapshot = await getDocs(collection(db, 'brandViews'));

                let pending = 0;
                let active = 0;
                brandsSnapshot.forEach(doc => {
                    if (doc.data().status === 'pending') pending++;
                    if (doc.data().status === 'active') active++;
                });

                const totalViews = viewsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalViews || 0), 0);

                setStats({
                    totalUsers: usersSnapshot.size,
                    totalBrands: brandsSnapshot.size,
                    pendingBrands: pending,
                    activeBrands: active,
                    totalLeads: leadsSnapshot.size,
                    totalViews: totalViews,
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading };
};