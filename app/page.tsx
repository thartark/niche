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
