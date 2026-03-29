import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

/**
 * Provides real-time unread/pending counts for admin sidebar badges.
 * Each count updates automatically when Firestore data changes.
 */
export const useAdminBadges = () => {
    const [badges, setBadges] = useState({
        pendingBrands: 0,
        newLeads: 0,
        newChatLeads: 0,
        newMessages: 0,
    });

    useEffect(() => {
        const unsubs = [
            onSnapshot(
                query(collection(db, 'brands'), where('status', '==', 'pending')),
                (snap) => setBadges(prev => ({ ...prev, pendingBrands: snap.size })),
                () => {}
            ),
            onSnapshot(
                query(collection(db, 'brandfranchiseInquiry'), where('status', '==', 'New')),
                (snap) => setBadges(prev => ({ ...prev, newLeads: snap.size })),
                () => {}
            ),
            onSnapshot(
                query(collection(db, 'chatLeads'), where('status', '==', 'New')),
                (snap) => setBadges(prev => ({ ...prev, newChatLeads: snap.size })),
                () => {}
            ),
            onSnapshot(
                query(collection(db, 'contactUs'), where('status', '==', 'New')),
                (snap) => setBadges(prev => ({ ...prev, newMessages: snap.size })),
                () => {}
            ),
        ];

        return () => unsubs.forEach(u => u());
    }, []);

    return badges;
};
