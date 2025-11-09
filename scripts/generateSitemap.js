import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://ikama.com'; // Update with your production URL

// Static pages
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/brands', changefreq: 'daily', priority: '0.9' },
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  { url: '/brand-registration', changefreq: 'monthly', priority: '0.8' },
  { url: '/how-it-works', changefreq: 'monthly', priority: '0.7' },
  { url: '/success-stories', changefreq: 'weekly', priority: '0.8' },
];

async function generateSitemap() {
  try {
    console.log('Fetching brands from Firestore...');
    
    // Fetch active brands
    const brandsQuery = query(
      collection(db, 'brands'),
      where('status', '==', 'active')
    );
    const brandsSnapshot = await getDocs(brandsQuery);
    
    console.log(`Found ${brandsSnapshot.size} active brands`);

    // Build sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    // Add brand pages
    brandsSnapshot.forEach(doc => {
      const brand = doc.data();
      const slug = brand.slug || doc.id;
      const lastModified = brand.updatedAt?.toDate?.() || brand.createdAt?.toDate?.() || new Date();
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${BASE_URL}/brand/${slug}</loc>\n`;
      sitemap += `    <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    // Write to public directory
    const sitemapPath = join(__dirname, '../public/sitemap.xml');
    writeFileSync(sitemapPath, sitemap);
    
    console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
    console.log(`Total URLs: ${staticPages.length + brandsSnapshot.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
