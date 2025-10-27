/**
 * Pagination Hook
 * Provides cursor-based pagination for Firestore collections
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logger from '../utils/logger';

/**
 * Custom hook for paginated data fetching
 * @param {string} collectionName - Firestore collection name
 * @param {Object} options - Configuration options
 * @returns {Object} - Pagination state and methods
 */
export function usePagination(collectionName, options = {}) {
  const {
    pageSize = 20,
    orderByField = 'createdAt',
    orderDirection = 'desc',
    filters = [],
    enabled = true,
  } = options;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalLoaded, setTotalLoaded] = useState(0);

  // Reset pagination when filters change
  useEffect(() => {
    if (enabled) {
      reset();
      loadMore();
    }
  }, [collectionName, JSON.stringify(filters), orderByField, orderDirection]);

  /**
   * Load more items
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Build query
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      // Apply filters
      filters.forEach(filter => {
        if (filter.field && filter.operator && filter.value !== undefined) {
          q = query(q, where(filter.field, filter.operator, filter.value));
        }
      });

      // Apply ordering
      q = query(q, orderBy(orderByField, orderDirection));

      // Apply cursor for pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      // Apply limit
      q = query(q, limit(pageSize));

      // Execute query
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Transform documents
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update state
      setItems(prev => [...prev, ...newItems]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(newItems.length === pageSize);
      setTotalLoaded(prev => prev + newItems.length);

      logger.log(`Loaded ${newItems.length} items from ${collectionName}`);
    } catch (err) {
      logger.error('Pagination error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    collectionName,
    pageSize,
    orderByField,
    orderDirection,
    filters,
    lastDoc,
    loading,
    hasMore,
    enabled,
  ]);

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setItems([]);
    setLastDoc(null);
    setHasMore(true);
    setTotalLoaded(0);
    setError(null);
  }, []);

  /**
   * Refresh (reload from beginning)
   */
  const refresh = useCallback(() => {
    reset();
    setTimeout(() => loadMore(), 100);
  }, [reset, loadMore]);

  return {
    items,
    loading,
    error,
    hasMore,
    totalLoaded,
    loadMore,
    reset,
    refresh,
  };
}

/**
 * Custom hook for simple offset-based pagination (for arrays)
 * @param {Array} data - Data array
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} - Pagination state and methods
 */
export function useArrayPagination(data = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  return {
    paginatedData: currentItems, // Alias for backward compatibility
    currentItems,
    currentPage,
    totalPages,
    totalItems: data.length,
    itemsPerPage,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, data.length),
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

/**
 * Custom hook for infinite scroll pagination
 * @param {string} collectionName - Firestore collection
 * @param {Object} options - Options
 * @returns {Object} - Pagination state
 */
export function useInfiniteScroll(collectionName, options = {}) {
  const pagination = usePagination(collectionName, options);
  const [scrollTarget, setScrollTarget] = useState(null);

  useEffect(() => {
    if (!scrollTarget || !pagination.hasMore || pagination.loading) return;

    const handleScroll = () => {
      const element = scrollTarget;
      const { scrollTop, scrollHeight, clientHeight } = element;

      // Load more when 80% scrolled
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        pagination.loadMore();
      }
    };

    scrollTarget.addEventListener('scroll', handleScroll);
    return () => scrollTarget.removeEventListener('scroll', handleScroll);
  }, [scrollTarget, pagination.hasMore, pagination.loading]);

  return {
    ...pagination,
    setScrollTarget,
  };
}

export default usePagination;
