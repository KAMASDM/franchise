/**
 * Script to initialize About Us content in Firestore
 * Run this once to populate default content
 * 
 * Usage: node scripts/initializeAboutUs.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config (update with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultAboutUsContent = {
  heroTitle: "About ikama - Franchise Hub",
  heroSubtitle: "Connecting Entrepreneurs with Premium Franchise Opportunities",
  heroImage: "",
  
  missionStatement: "Our mission is to empower entrepreneurs by connecting them with the right franchise opportunities. We provide comprehensive support, verified franchise listings, and expert guidance to help you make informed decisions and achieve your business goals.",
  
  visionStatement: "To become the most trusted franchise marketplace globally, where every entrepreneur finds their perfect franchise match and every franchisor discovers committed, qualified partners.",
  
  stats: [
    {
      icon: "Business",
      number: "500+",
      label: "Franchise Brands"
    },
    {
      icon: "TrendingUp",
      number: "95%",
      label: "Success Rate"
    },
    {
      icon: "People",
      number: "10,000+",
      label: "Happy Clients"
    },
    {
      icon: "Star",
      number: "4.9/5",
      label: "Client Rating"
    }
  ],
  
  values: [
    {
      icon: "Verified",
      title: "Transparency",
      description: "We believe in complete transparency. Every franchise listing is verified, and we provide all the information you need to make confident decisions."
    },
    {
      icon: "Support",
      title: "Expert Support",
      description: "Our team of franchise consultants has decades of combined experience, offering personalized guidance throughout your journey."
    },
    {
      icon: "TrendingUp",
      title: "Quality Focus",
      description: "We partner only with reputable franchises that meet our strict quality standards, ensuring you access the best opportunities."
    },
    {
      icon: "People",
      title: "Client Success",
      description: "Your success is our success. We're committed to supporting you from initial inquiry through franchise ownership and beyond."
    }
  ],
  
  teamMembers: [
    {
      name: "Rajesh Kumar",
      position: "CEO & Founder",
      experience: "15+ years in franchise consulting",
      avatar: "RK"
    },
    {
      name: "Priya Sharma",
      position: "Head of Operations",
      experience: "12+ years in business development",
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      position: "Lead Consultant",
      experience: "10+ years in franchise industry",
      avatar: "AP"
    },
    {
      name: "Sneha Verma",
      position: "Client Relations Manager",
      experience: "8+ years in customer success",
      avatar: "SV"
    }
  ],
  
  achievements: [
    "Helped 10,000+ entrepreneurs find their perfect franchise match",
    "Partnered with 500+ reputable franchise brands across 20+ industries",
    "Maintained a 95% client satisfaction rate over the past 5 years",
    "Recognized as 'Top Franchise Consultant' by Industry Awards 2023",
    "Expanded operations to 15 major cities across India",
    "Launched innovative AI-powered franchise matching system",
    "Conducted 100+ franchise awareness workshops and seminars"
  ],
  
  ctaTitle: "Ready to Start Your Franchise Journey?",
  ctaDescription: "Explore our verified franchise opportunities and take the first step toward business ownership with expert guidance.",
  
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function initializeAboutUs() {
  try {
    console.log('Initializing About Us content...');
    
    await setDoc(doc(db, 'aboutUs', 'content'), defaultAboutUsContent);
    
    console.log('✅ About Us content initialized successfully!');
    console.log('You can now edit this content from the Admin Dashboard > About Us Content');
    
  } catch (error) {
    console.error('❌ Error initializing About Us content:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

initializeAboutUs();
