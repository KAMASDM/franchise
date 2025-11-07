import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing favorite brands with custom collections
 * 
 * Features:
 * - Add/remove brands from favorites
 * - Create custom collections (folders)
 * - Organize brands into multiple collections
 * - Persist to localStorage
 */

const STORAGE_KEY = 'favoriteBrands';
const COLLECTIONS_KEY = 'brandCollections';

// Default collections
const DEFAULT_COLLECTIONS = [
  { id: 'all', name: 'All Favorites', isDefault: true },
  { id: 'high-priority', name: 'High Priority', color: '#f44336' },
  { id: 'research-later', name: 'Research Later', color: '#2196f3' },
  { id: 'comparing', name: 'Comparing', color: '#ff9800' },
];

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [loading, setLoading] = useState(true);

  // Load favorites and collections from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY);
      const savedCollections = localStorage.getItem(COLLECTIONS_KEY);

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      } else {
        // Save default collections
        localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(DEFAULT_COLLECTIONS));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Save collections to localStorage
  const saveCollections = useCallback((newCollections) => {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(newCollections));
      setCollections(newCollections);
    } catch (error) {
      console.error('Error saving collections:', error);
    }
  }, []);

  // Check if a brand is in favorites
  const isFavorite = useCallback((brandId) => {
    return favorites.some(fav => fav.brandId === brandId);
  }, [favorites]);

  // Add brand to favorites
  const addFavorite = useCallback((brand, collectionIds = ['all']) => {
    const newFavorite = {
      brandId: brand.id,
      brand: brand,
      collections: collectionIds,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites.filter(f => f.brandId !== brand.id), newFavorite];
    saveFavorites(updatedFavorites);
    return true;
  }, [favorites, saveFavorites]);

  // Remove brand from favorites
  const removeFavorite = useCallback((brandId) => {
    const updatedFavorites = favorites.filter(fav => fav.brandId !== brandId);
    saveFavorites(updatedFavorites);
    return true;
  }, [favorites, saveFavorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((brand, collectionIds = ['all']) => {
    if (isFavorite(brand.id)) {
      removeFavorite(brand.id);
      return false;
    } else {
      addFavorite(brand, collectionIds);
      return true;
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  // Add brand to specific collection
  const addToCollection = useCallback((brandId, collectionId) => {
    const updatedFavorites = favorites.map(fav => {
      if (fav.brandId === brandId) {
        const collections = [...new Set([...fav.collections, collectionId])];
        return { ...fav, collections };
      }
      return fav;
    });
    saveFavorites(updatedFavorites);
  }, [favorites, saveFavorites]);

  // Remove brand from specific collection
  const removeFromCollection = useCallback((brandId, collectionId) => {
    const updatedFavorites = favorites.map(fav => {
      if (fav.brandId === brandId) {
        const collections = fav.collections.filter(id => id !== collectionId);
        // Keep 'all' collection at minimum
        if (collections.length === 0) collections.push('all');
        return { ...fav, collections };
      }
      return fav;
    });
    saveFavorites(updatedFavorites);
  }, [favorites, saveFavorites]);

  // Create new collection
  const createCollection = useCallback((name, color = '#9e9e9e') => {
    const newCollection = {
      id: `custom-${Date.now()}`,
      name,
      color,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    const updatedCollections = [...collections, newCollection];
    saveCollections(updatedCollections);
    return newCollection;
  }, [collections, saveCollections]);

  // Update collection
  const updateCollection = useCallback((collectionId, updates) => {
    const updatedCollections = collections.map(col =>
      col.id === collectionId ? { ...col, ...updates } : col
    );
    saveCollections(updatedCollections);
  }, [collections, saveCollections]);

  // Delete collection
  const deleteCollection = useCallback((collectionId) => {
    // Don't allow deleting default collections
    const collection = collections.find(c => c.id === collectionId);
    if (collection?.isDefault) return false;

    // Remove collection from all favorites
    const updatedFavorites = favorites.map(fav => ({
      ...fav,
      collections: fav.collections.filter(id => id !== collectionId),
    }));
    saveFavorites(updatedFavorites);

    // Delete collection
    const updatedCollections = collections.filter(col => col.id !== collectionId);
    saveCollections(updatedCollections);
    return true;
  }, [collections, favorites, saveCollections, saveFavorites]);

  // Get brands by collection
  const getBrandsByCollection = useCallback((collectionId) => {
    if (collectionId === 'all') {
      return favorites.map(fav => fav.brand);
    }
    return favorites
      .filter(fav => fav.collections.includes(collectionId))
      .map(fav => fav.brand);
  }, [favorites]);

  // Get collections for a brand
  const getBrandCollections = useCallback((brandId) => {
    const favorite = favorites.find(fav => fav.brandId === brandId);
    if (!favorite) return [];
    return collections.filter(col => favorite.collections.includes(col.id));
  }, [favorites, collections]);

  // Get collection stats
  const getCollectionStats = useCallback(() => {
    return collections.map(col => ({
      ...col,
      count: col.id === 'all' 
        ? favorites.length 
        : favorites.filter(fav => fav.collections.includes(col.id)).length,
    }));
  }, [collections, favorites]);

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    collections,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    addToCollection,
    removeFromCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    getBrandsByCollection,
    getBrandCollections,
    getCollectionStats,
    clearAllFavorites,
  };
};

export default useFavorites;
