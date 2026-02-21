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
