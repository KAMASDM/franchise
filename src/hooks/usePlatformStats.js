import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  limit as firestoreLimit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import logger from "../utils/logger";

const CACHE_KEY = "platform_stats_v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — stats don't need to be fresher

/**
 * Real platform stats for public marketing surfaces (hero, footer, etc.).
 * Uses a server-side aggregate count plus one bounded query, cached in
 * sessionStorage so repeat navigations cost zero reads.
 *
 * Returns { stats: { activeBrands, industries, totalOutlets } | null, loading }
 * stats stays null on failure so callers can hide the section gracefully.
 */
export const usePlatformStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Serve from session cache when fresh
      try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
        if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
          setStats(cached.stats);
          setLoading(false);
          return;
        }
      } catch {
        // ignore malformed cache
      }

      try {
        const brandsRef = collection(db, "brands");
        const activeQuery = query(brandsRef, where("status", "==", "active"));

        const [countSnap, docsSnap] = await Promise.all([
          getCountFromServer(activeQuery),
          getDocs(query(brandsRef, where("status", "==", "active"), firestoreLimit(200))),
        ]);

        const activeBrands = countSnap.data().count;

        const categories = new Set();
        let totalOutlets = 0;
        docsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.brandCategory) categories.add(data.brandCategory);
          const units = Number(data.totalUnits);
          if (Number.isFinite(units)) totalOutlets += units;
        });

        const result = {
          activeBrands,
          industries: categories.size,
          totalOutlets,
        };

        if (!cancelled) {
          setStats(result);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), stats: result }));
          } catch {
            // storage full/unavailable — stats still shown this visit
          }
        }
      } catch (error) {
        logger.error("Failed to load platform stats:", error);
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading };
};

export default usePlatformStats;
