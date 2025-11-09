import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

/**
 * Hook to fetch all published blogs with optional filtering
 */
export const useBlogs = (options = {}) => {
  const { 
    category = null, 
    searchTerm = '', 
    limitCount = 100,
    includeDrafts = false // Only admins should set this to true
  } = options;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const blogsRef = collection(db, 'blogs');
      let q;

      // For admins (includeDrafts = true), order by createdAt only
      // For public, we'll fetch all and filter client-side until index is ready
      if (includeDrafts) {
        q = query(blogsRef, orderBy('createdAt', 'desc'));
      } else {
        // Simple query - filter by status client-side to avoid needing index immediately
        q = query(blogsRef, orderBy('createdAt', 'desc'));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let blogsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to Date objects
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            publishedAt: doc.data().publishedAt?.toDate() || null,
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }));

          // Client-side filtering for status (until index is built)
          if (!includeDrafts) {
            blogsData = blogsData.filter(blog => blog.status === 'published');
          }

          // Sort by publishedAt for published blogs, createdAt for drafts
          blogsData.sort((a, b) => {
            const dateA = a.publishedAt || a.createdAt;
            const dateB = b.publishedAt || b.createdAt;
            return dateB - dateA;
          });

          // Client-side filtering for category
          if (category && category !== 'All') {
            blogsData = blogsData.filter(blog => blog.category === category);
          }

          // Client-side filtering for search
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            blogsData = blogsData.filter(blog => 
              blog.title?.toLowerCase().includes(term) ||
              blog.excerpt?.toLowerCase().includes(term) ||
              blog.content?.toLowerCase().includes(term) ||
              blog.tags?.some(tag => tag.toLowerCase().includes(term))
            );
          }

          setBlogs(blogsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching blogs:', err);
          setError(err.message);
          setLoading(false);
          setBlogs([]);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up blogs listener:', err);
      setError(err.message);
      setLoading(false);
      setBlogs([]);
    }
  }, [category, searchTerm, limitCount, includeDrafts]);

  return { blogs, loading, error };
};

/**
 * Hook to fetch a single blog by ID or slug
 */
export const useBlog = (identifier) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);

        // Try to fetch by ID first
        const blogRef = doc(db, 'blogs', identifier);
        const blogSnap = await getDoc(blogRef);

        if (blogSnap.exists()) {
          const data = blogSnap.data();
          setBlog({
            id: blogSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            publishedAt: data.publishedAt?.toDate() || null,
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
          setError(null);
        } else {
          // Try to fetch by slug
          const blogsRef = collection(db, 'blogs');
          const q = query(blogsRef, where('slug', '==', identifier), limit(1));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            setBlog({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              publishedAt: data.publishedAt?.toDate() || null,
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
            setError(null);
          } else {
            setBlog(null);
            setError('Blog not found');
          }
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [identifier]);

  return { blog, loading, error };
};

/**
 * Helper function to generate URL-friendly slug from title
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Helper function to upload blog featured image
 */
export const uploadBlogImage = async (file, blogId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `blogs/${blogId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

/**
 * Helper function to delete blog image
 */
export const deleteBlogImage = async (imageUrl) => {
  try {
    // Extract path from URL
    const path = imageUrl.split('/o/')[1]?.split('?')[0];
    if (!path) return;
    
    const decodedPath = decodeURIComponent(path);
    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting blog image:', error);
    // Don't throw - image deletion failure shouldn't stop blog deletion
  }
};

/**
 * Function to create a new blog
 */
export const createBlog = async (blogData) => {
  try {
    const slug = generateSlug(blogData.title);
    
    const newBlog = {
      ...blogData,
      slug,
      status: blogData.status || 'draft',
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: blogData.status === 'published' ? serverTimestamp() : null,
    };

    const docRef = await addDoc(collection(db, 'blogs'), newBlog);
    return { id: docRef.id, ...newBlog };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

/**
 * Function to update an existing blog
 */
export const updateBlog = async (blogId, updates) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    
    // If title changed, regenerate slug
    if (updates.title) {
      updates.slug = generateSlug(updates.title);
    }

    // If status changed to published and not published before, set publishedAt
    const currentBlog = await getDoc(blogRef);
    if (updates.status === 'published' && currentBlog.data()?.status !== 'published') {
      updates.publishedAt = serverTimestamp();
    }

    await updateDoc(blogRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

/**
 * Function to delete a blog
 */
export const deleteBlog = async (blogId, imageUrl) => {
  try {
    // Delete associated image if exists
    if (imageUrl) {
      await deleteBlogImage(imageUrl);
    }

    // Delete blog document
    await deleteDoc(doc(db, 'blogs', blogId));
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

/**
 * Function to increment blog view count
 */
export const incrementBlogViews = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (blogSnap.exists()) {
      const currentViews = blogSnap.data().views || 0;
      await updateDoc(blogRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    // Don't throw - view count failure shouldn't affect user experience
  }
};

/**
 * Hook to get blog categories with counts
 */
export const useBlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('status', '==', 'published'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoryCount = {};
      
      snapshot.docs.forEach(doc => {
        const category = doc.data().category;
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });

      const categoriesArray = Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count
      }));

      setCategories(categoriesArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { categories, loading };
};
