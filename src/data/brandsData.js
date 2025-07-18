export const brandsData = [
  {
    id: 1,
    name: "Pizza Palace",
    category: "Pizza",
    investment: "₹150,000 - ₹300,000",
    description: "Premium pizza franchise with artisanal ingredients",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    locations: 150,
    founded: 2010,
    roi: "25-35%",
    paybackPeriod: "3-4 years",
    franchiseFee: "₹45,000",
    details: {
      about: "Pizza Palace is a leading pizza franchise known for its authentic Italian recipes and premium ingredients.",
      highlights: [
        "Proven business model",
        "Comprehensive training program",
        "Marketing support",
        "Premium ingredients"
      ],
      requirements: {
        totalInvestment: "₹150,000 - ₹300,000",
        liquidCapital: "₹100,000",
        experience: "Food service preferred but not required"
      }
    },
    currentLocations: [
      { city: "New York", state: "NY", address: "123 Main St", phone: "(555) 123-4567" },
      { city: "Los Angeles", state: "CA", address: "456 Oak Ave", phone: "(555) 234-5678" },
      { city: "Chicago", state: "IL", address: "789 Pine St", phone: "(555) 345-6789" }
    ]
  },
  {
    id: 2,
    name: "Burger Barn",
    category: "Burgers",
    investment: "₹200,000 - ₹400,000",
    description: "Classic American burgers with a modern twist",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    locations: 89,
    founded: 2015,
    roi: "30-40%",
    paybackPeriod: "2-3 years",
    franchiseFee: "₹55,000",
    details: {
      about: "Burger Barn combines classic American flavors with modern cooking techniques.",
      highlights: [
        "Fresh, never frozen beef",
        "Unique menu offerings",
        "Strong brand recognition",
        "Excellent profit margins"
      ],
      requirements: {
        totalInvestment: "₹200,000 - ₹400,000",
        liquidCapital: "₹150,000",
        experience: "Restaurant experience preferred"
      }
    },
    currentLocations: [
      { city: "Dallas", state: "TX", address: "321 Elm St", phone: "(555) 456-7890" },
      { city: "Miami", state: "FL", address: "654 Beach Blvd", phone: "(555) 567-8901" }
    ]
  },
  {
    id: 3,
    name: "Taco Fiesta",
    category: "Mexican",
    investment: "₹100,000 - ₹250,000",
    description: "Authentic Mexican cuisine with fresh ingredients",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
    locations: 75,
    founded: 2012,
    roi: "28-38%",
    paybackPeriod: "2.5-3.5 years",
    franchiseFee: "₹35,000",
    details: {
      about: "Taco Fiesta brings authentic Mexican flavors with a focus on fresh, quality ingredients.",
      highlights: [
        "Family recipes",
        "Fresh daily preparation",
        "Growing market demand",
        "Affordable investment"
      ],
      requirements: {
        totalInvestment: "₹100,000 - ₹250,000",
        liquidCapital: "₹75,000",
        experience: "Food service helpful"
      }
    },
    currentLocations: [
      { city: "Phoenix", state: "AZ", address: "987 Desert Rd", phone: "(555) 678-9012" },
      { city: "San Antonio", state: "TX", address: "147 River Walk", phone: "(555) 789-0123" }
    ]
  }
]

export const categories = [
  "All Categories",
  "Pizza", 
  "Burgers", 
  "Mexican", 
  "Asian", 
  "Coffee", 
  "Ice Cream",
  "Sandwiches",
  "Seafood",
  "Chicken"
]

export const investmentRanges = [
  "All Ranges",
  "Under ₹100K",
  "₹100K - ₹200K",
  "₹200K - ₹300K",
  "₹300K - ₹500K",
  "Over ₹500K"
]