// Centralized constants for consistent data across the application

export const INVESTMENT_RANGES = [
  "Under ₹50K",
  "₹50K - ₹100K", 
  "₹100K - ₹250K",
  "₹250K - ₹500K",
  "₹500K - ₹1M",
  "Over ₹1M",
];

export const INDUSTRIES = [
  "Food & Beverage",
  "Hospitality",
  "Retail", 
  "Healthcare",
  "Education",
  "Fitness",
  "Beauty & Wellness",
  "Technology",
  "Automotive",
  "Real Estate",
  "Home Services",
  "Entertainment",
  "Travel & Hospitality",
  "Other",
];

export const FRANCHISE_MODELS = [
  "Unit",
  "Multicity", 
  "Dealer/Distributor",
  "Master Franchise",
];

export const BUSINESS_MODELS = [
  "Company Owned - Company Operated",
  "Company Owned - Franchise Operated",
];

export const LEAD_STATUSES = [
  "New",
  "Pending", 
  "Contacted",
  "Converted",
  "Rejected",
];

export const BRAND_STATUSES = [
  "pending",
  "active",
  "inactive",
];

export const BUSINESS_EXPERIENCE_OPTIONS = [
  "No Business Experience",
  "Some business experience", 
  "Restaurant experience",
  "Franchise experience",
  "Corporate executive",
];

export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 3 months",
  "Within 6 months", 
  "Within 1 year",
  "Just exploring",
];

export const AREA_UNITS = [
  "Sq.ft",
  "Sq.mt", 
  "Sq.yrd",
  "Acre",
];

export const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
  "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Rajkot",
  "Meerut", "Kalyan", "Vasai-Virar", "Aurangabad", "Dhanbad", "Amritsar",
  "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior",
  "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Chandigarh",
  "Guwahati", "Solapur", "Hubli-Dharwad", "Mysore", "Tiruchirappalli",
  "Bareilly", "Aligarh", "Tiruppur", "Moradabad", "Jalandhar", "Bhubaneswar",
  "Salem", "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur",
  "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai", "Cuttack",
  "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur",
  "Asansol", "Rourkela", "Nanded", "Kolhapur", "Ajmer", "Akola",
  "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi",
  "Ulhasnagar", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode",
  "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon",
  "Udaipur", "Maheshtala", "Davanagere", "Kozhikode", "Kurnool", "Rajpur Sonarpur",
  "Rajahmundry", "Bokaro", "South Dumdum", "Bellary", "Patiala", "Gopalpur",
  "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara", "Panihati", "Latur",
  "Dhule", "Rohtak", "Korba", "Bhilwara", "Berhampur", "Muzaffarpur",
  "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati",
  "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", "Bijapur", "Rampur",
  "Shivamogga", "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman",
  "Kulti", "Kakinada", "Nizamabad", "Parbhani", "Tumkur", "Khammam",
  "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga", "Bally", "Aizawl",
  "Dewas", "Ichalkaranji", "Karnal", "Bathinda", "Jalna", "Eluru",
  "Kirari Suleman Nagar", "Barabanki", "Purnia", "Satna", "Mau", "Sonipat",
  "Farrukhabad", "Sagar", "Rourkela", "Durg", "Imphal", "Ratlam",
  "Hapur", "Arrah", "Anantapur", "Karimnagar", "Etawah", "Ambernath",
  "North Dumdum", "Bharatpur", "Begusarai", "New Delhi", "Gandhidham",
  "Baranagar", "Tiruvottiyur", "Puducherry", "Sikar", "Thoothukudi",
  "Rewa", "Mirzapur", "Raichur", "Pali", "Ramagundam", "Silchar",
  "Jamalpur", "Kancheepuram", "Dehri", "Madanapalle", "Siwan", "Bettiah",
  "Guntakal", "Srikakulam", "Motihari", "Dharmavaram", "Gudivada", "Narasaraopet",
  "Bagaha", "Miryalaguda", "Tadipatri", "Kishanganj", "Karaikudi", "Suryapet",
  "Jagtial", "Nagapattinam", "Nandyal", "Koratla", "Tenali", "Proddatur",
  "Adilabad", "Saharsa", "Hindupur", "Nagaon", "Sasaram", "Hajipur",
  "Bhimavaram", "Kumbakonam", "Bongaigaon", "Dehri", "Madanapalle",
  "Siwan", "Bettiah", "Guntakal", "Srikakulam", "Motihari", "Dharmavaram",
  "Gudivada", "Narasaraopet", "Bagaha", "Miryalaguda", "Tadipatri", "Kishanganj"
];

export const INDIAN_LANGUAGES = [
  { code: "English", name: "English", native: "English" },
  { code: "Hindi", name: "Hindi", native: "हिंदी" },
  { code: "Gujarati", name: "Gujarati", native: "ગુજરાતી" },
  { code: "Marathi", name: "Marathi", native: "मराठी" },
  { code: "Tamil", name: "Tamil", native: "தமிழ்" },
  { code: "Telugu", name: "Telugu", native: "తెలుగు" },
  { code: "Bengali", name: "Bengali", native: "বাংলা" },
  { code: "Kannada", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "Malayalam", name: "Malayalam", native: "മലയാളം" },
  { code: "Punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

// File upload constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_GALLERY_IMAGES: 10,
};

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_LEAD: "new_lead",
  BRAND_APPROVED: "brand_approved", 
  BRAND_REJECTED: "brand_rejected",
  ADMIN_ALERT: "admin_alert",
  CHAT_LEAD: "chat_lead",
  BRAND_SUBMISSION: "brand_submission",
};

export default {
  INVESTMENT_RANGES,
  INDUSTRIES,
  FRANCHISE_MODELS,
  BUSINESS_MODELS,
  LEAD_STATUSES,
  BRAND_STATUSES,
  BUSINESS_EXPERIENCE_OPTIONS,
  TIMELINE_OPTIONS,
  AREA_UNITS,
  INDIAN_CITIES,
  INDIAN_LANGUAGES,
  FILE_UPLOAD,
  NOTIFICATION_TYPES,
};