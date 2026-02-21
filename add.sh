#!/bin/bash

echo "🔧 Fixing Niche app to use mock data instead of database..."

# Create backup directory
mkdir -p backups

# Backup original files
cp lib/db.ts backups/db.ts.backup 2>/dev/null
cp app/page.tsx backups/page.tsx.backup 2>/dev/null

# Method 1: Modify db.ts to use mock data
cat > lib/db.ts << 'EOF'
// Mock database adapter that returns mock data instead of querying SQLite

export interface Watch {
  id: number;
  seller_id: number;
  brand: string;
  model: string;
  reference_number: string;
  price: number;
  condition: string;
  year: number;
  description: string;
  images: string[];
  status: string;
  created_at: string;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  rating: number;
  total_sales: number;
  created_at: string;
}

// Mock data
const mockSellers: Seller[] = [
  {
    id: 1,
    name: "Timepiece Gallery",
    email: "contact@timepiece.com",
    rating: 4.8,
    total_sales: 125,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Luxury Watches NYC",
    email: "info@luxurywatchesnyc.com",
    rating: 4.9,
    total_sales: 342,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Vintage Watch Co",
    email: "sales@vintagewatchco.com",
    rating: 4.7,
    total_sales: 89,
    created_at: new Date().toISOString()
  }
];

const mockWatches: Watch[] = [
  {
    id: 1,
    seller_id: 1,
    brand: "Rolex",
    model: "Submariner",
    reference_number: "116610LN",
    price: 12500,
    condition: "Excellent",
    year: 2020,
    description: "Black ceramic bezel, stainless steel, excellent condition with box and papers",
    images: ["/watch1.jpg"],
    status: "available",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    seller_id: 2,
    brand: "Omega",
    model: "Speedmaster Professional",
    reference_number: "311.30.42.30.01.005",
    price: 6500,
    condition: "Very Good",
    year: 2021,
    description: "Moonwatch, hesalite crystal, stainless steel bracelet",
    images: ["/watch2.jpg"],
    status: "available",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    seller_id: 3,
    brand: "Patek Philippe",
    model: "Nautilus",
    reference_number: "5711/1A-010",
    price: 85000,
    condition: "New",
    year: 2022,
    description: "Blue dial, stainless steel, unworn with full set",
    images: ["/watch3.jpg"],
    status: "sold",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    seller_id: 1,
    brand: "Audemars Piguet",
    model: "Royal Oak",
    reference_number: "15500ST.OO.1220ST.01",
    price: 32000,
    condition: "Like New",
    year: 2021,
    description: "Blue dial, stainless steel, 41mm, with box and papers",
    images: ["/watch4.jpg"],
    status: "available",
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    seller_id: 2,
    brand: "TAG Heuer",
    model: "Carrera",
    reference_number: "CBN2A1A.BA0643",
    price: 5500,
    condition: "Excellent",
    year: 2022,
    description: "Green dial, stainless steel, 42mm, chronograph",
    images: ["/watch5.jpg"],
    status: "available",
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    seller_id: 3,
    brand: "IWC",
    model: "Portuguese Chronograph",
    reference_number: "IW371605",
    price: 7800,
    condition: "Good",
    year: 2019,
    description: "Blue dial, stainless steel, 41mm, with leather strap",
    images: ["/watch6.jpg"],
    status: "available",
    created_at: new Date().toISOString()
  }
];

// Database adapter that returns mock data instead of querying real DB
export function sql(query: string, ...args: any[]) {
  // Parse the query to determine what to return
  const queryLower = query.toLowerCase();
  
  // Return different mock data based on query type
  return {
    // For SELECT queries
    all: () => {
      if (queryLower.includes('from sellers')) {
        return mockSellers;
      }
      if (queryLower.includes('from watches')) {
        // Handle different WHERE clauses
        if (queryLower.includes('where status')) {
          return mockWatches.filter(w => w.status === 'available');
        }
        if (queryLower.includes('order by created_at desc limit')) {
          // Get featured watches (latest 3)
          return [...mockWatches]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
        }
        return mockWatches;
      }
      return [];
    },
    
    // For single row queries
    get: () => {
      if (queryLower.includes('from sellers where id =')) {
        const id = args[0];
        return mockSellers.find(s => s.id === id) || null;
      }
      if (queryLower.includes('from watches where id =')) {
        const id = args[0];
        return mockWatches.find(w => w.id === id) || null;
      }
      return null;
    },
    
    // For INSERT/UPDATE/DELETE queries
    run: () => {
      return { changes: 1, lastInsertRowid: mockWatches.length + 1 };
    }
  };
}

// Export individual functions for common queries
export const db = {
  getFeaturedWatches: () => {
    return mockWatches
      .filter(w => w.status === 'available')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  },
  
  getWatchById: (id: number) => {
    return mockWatches.find(w => w.id === id) || null;
  },
  
  getWatchesBySeller: (sellerId: number) => {
    return mockWatches.filter(w => w.seller_id === sellerId);
  },
  
  getSellerById: (id: number) => {
    return mockSellers.find(s => s.id === id) || null;
  },
  
  getAllWatches: (filters?: any) => {
    let result = [...mockWatches];
    
    if (filters?.status) {
      result = result.filter(w => w.status === filters.status);
    }
    
    if (filters?.brand) {
      result = result.filter(w => w.brand === filters.brand);
    }
    
    if (filters?.maxPrice) {
      result = result.filter(w => w.price <= filters.maxPrice);
    }
    
    return result;
  }
};

export default db;
EOF

# Method 2: Modify page.tsx to use mock data directly
cat > app/page.tsx << 'EOF'
import Link from 'next/link';

// Mock data directly in the page to avoid any database calls
const mockWatches = [
  {
    id: 1,
    brand: "Rolex",
    model: "Submariner",
    reference_number: "116610LN",
    price: 12500,
    condition: "Excellent",
    year: 2020,
    images: ["/watch1.jpg"],
    seller: {
      name: "Timepiece Gallery",
      rating: 4.8
    }
  },
  {
    id: 2,
    brand: "Omega",
    model: "Speedmaster Professional",
    reference_number: "311.30.42.30.01.005",
    price: 6500,
    condition: "Very Good",
    year: 2021,
    images: ["/watch2.jpg"],
    seller: {
      name: "Luxury Watches NYC",
      rating: 4.9
    }
  },
  {
    id: 3,
    brand: "Patek Philippe",
    model: "Nautilus",
    reference_number: "5711/1A-010",
    price: 85000,
    condition: "New",
    year: 2022,
    images: ["/watch3.jpg"],
    seller: {
      name: "Vintage Watch Co",
      rating: 4.7
    }
  }
];

// Format price as currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function HomePage() {
  const featuredWatches = mockWatches;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">Discover Luxury Timepieces</h1>
          <p className="text-xl mb-8">Curated collection of premium watches from trusted sellers</p>
          <Link 
            href="/watches" 
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>

      {/* Featured Watches Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Watches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWatches.map((watch) => (
            <Link 
              href={`/watches/${watch.id}`} 
              key={watch.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {/* Placeholder for watch image */}
                <span className="text-gray-400">Watch Image</span>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{watch.brand} {watch.model}</h3>
                    <p className="text-gray-600 text-sm">{watch.reference_number}</p>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(watch.price)}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{watch.year}</span>
                  <span className="mx-2">•</span>
                  <span>{watch.condition}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{watch.seller.name}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{watch.seller.rating}</span>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Available</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/watches" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Watches
          </Link>
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Niche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-bold mb-2">Authenticity Guaranteed</h3>
              <p className="text-gray-600">All watches are verified by our experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-bold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Your payments and data are always safe</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-bold mb-2">Worldwide Shipping</h3>
              <p className="text-gray-600">Insured shipping to over 50 countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Create a simple placeholder for missing image directory
mkdir -p public
touch public/.gitkeep

echo "✅ Fix applied successfully!"
echo ""
echo "Next steps:"
echo "1. Restart your Next.js server:"
echo "   npm run dev"
echo ""
echo "The app will now use mock data instead of trying to query a database."
echo ""
echo "Original files backed up in: backups/"
EOF```

Make the script executable and run it:

```bash
chmod +x fix-niche.sh
./fix-niche.sh