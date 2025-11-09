import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logger from '../utils/logger';

/**
 * Custom hook to fetch and manage demo video from Firestore
 * Stores a single demo video document in the 'settings' collection
 */
export const useDemoVideo = () => {
  const [demoVideo, setDemoVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemoVideo = async () => {
      try {
        setLoading(true);
        const demoVideoRef = doc(db, 'settings', 'demoVideo');
        const demoVideoSnap = await getDoc(demoVideoRef);
        
        if (demoVideoSnap.exists()) {
          setDemoVideo(demoVideoSnap.data());
          logger.info('✅ Successfully fetched demo video');
        } else {
          setDemoVideo(null);
          logger.info('ℹ️ No demo video configured');
        }
      } catch (err) {
        console.error('❌ Error fetching demo video:', err);
        logger.error('Error fetching demo video:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoVideo();
  }, []);

  return { demoVideo, loading, error };
};

/**
 * Function to update demo video in Firestore
 */
export const updateDemoVideo = async (videoData) => {
  try {
    const demoVideoRef = doc(db, 'settings', 'demoVideo');
    await setDoc(demoVideoRef, {
      ...videoData,
      updatedAt: new Date(),
    });
    logger.info('✅ Demo video updated successfully');
    return { success: true };
  } catch (err) {
    console.error('❌ Error updating demo video:', err);
    logger.error('Error updating demo video:', err);
    return { success: false, error: err.message };
  }
};
