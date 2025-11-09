/**
 * Sitemap Generator for ikama Franchise Hub
 * Generates sitemap.xml with static pages and dynamic content from Firestore
 */

import './load-env.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config (use environment variables in production)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SITE_URL = 'https://ikama.in';

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/brands', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'weekly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/blogs', priority: '0.8', changefreq: 'daily' },
  { url: '/login', priority: '0.5', changefreq: 'monthly' },
  { url: '/signup', priority: '0.5', changefreq: 'monthly' },
];

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toISOString().split('T')[0];
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');

  let urls = [];

  // Add static pages
  staticPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    // Fetch active brands
    console.log('📦 Fetching brands...');
    const brandsQuery = query(collection(db, 'brands'), where('status', '==', 'active'));
    const brandsSnapshot = await getDocs(brandsQuery);
    
    brandsSnapshot.forEach(doc => {
      const brand = doc.data();
      const slug = brand.slug || generateSlug(brand.brandName || brand.name);
      urls.push({
        loc: `${SITE_URL}/brands/${slug}`,
        lastmod: formatDate(brand.updatedAt || brand.createdAt),
        changefreq: 'weekly',
        priority: '0.8',
      });
    });
    console.log(`✅ Added ${brandsSnapshot.size} brands`);

    // Fetch published blogs
    console.log('📝 Fetching blogs...');
    const blogsQuery = query(collection(db, 'blogs'), where('status', '==', 'published'));
    const blogsSnapshot = await getDocs(blogsQuery);
    
    blogsSnapshot.forEach(doc => {
      const blog = doc.data();
      urls.push({
        loc: `${SITE_URL}/blogs/${blog.slug}`,
        lastmod: formatDate(blog.updatedAt || blog.publishedAt),
        changefreq: 'monthly',
        priority: '0.7',
      });
    });
    console.log(`✅ Added ${blogsSnapshot.size} blogs`);

  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to file
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  
  console.log(`\n✨ Sitemap generated successfully!`);
  console.log(`📄 Total URLs: ${urls.length}`);
  console.log(`📍 Location: ${outputPath}`);
  
  process.exit(0);
}

generateSitemap();
