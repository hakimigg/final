import React, { useState, useEffect, useCallback } from "react";
import { Product } from "../entities/Product";
import { Type } from "../entities/Type";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Search, SlidersHorizontal, Home as HomeIcon, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await Product.list(sortBy);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
    setIsLoading(false);
  }, [sortBy]);

  const loadTypes = useCallback(async () => {
    try {
      const data = await Type.list('name');
      setTypes(data);
    } catch (error) {
      console.error('Error loading types:', error);
      setTypes([]);
    }
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    // Filter by type (match product category/name with type name)
    if (selectedType !== "all") {
      const selectedTypeName = selectedType.toLowerCase();
      console.log('Filtering by type:', selectedTypeName); // Debug log
      
      filtered = filtered.filter(p => {
        const productName = p.name?.toLowerCase() || '';
        const productCategory = p.category?.toLowerCase() || '';
        const productDescription = p.description?.toLowerCase() || '';
        
        // More precise matching - check if type name matches category or is contained in name/description
        const matches = 
          productCategory === selectedTypeName ||
          productCategory.includes(selectedTypeName) ||
          productName.includes(selectedTypeName) ||
          productDescription.includes(selectedTypeName) ||
          // Also check reverse - if category contains the type (e.g., "living_room" contains "furniture")
          selectedTypeName.includes(productCategory.replace(/_/g, ' ')) ||
          // Check if type matches common category mappings
          (selectedTypeName === 'furniture' && ['living_room', 'bedroom', 'kitchen', 'office'].includes(productCategory)) ||
          (selectedTypeName === 'lighting' && productCategory === 'lighting') ||
          (selectedTypeName === 'decor' && productCategory === 'decor') ||
          (selectedTypeName === 'storage' && productCategory === 'storage');
          
        console.log(`Product: ${p.name}, Category: ${productCategory}, Matches: ${matches}`); // Debug log
        return matches;
      });
      
      console.log(`Filtered ${filtered.length} products for type: ${selectedTypeName}`); // Debug log
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedType]);

  useEffect(() => {
    loadProducts();
    loadTypes();
  }, [loadProducts, loadTypes]);

  useEffect(() => {
    // Method 1: Try React Router's useSearchParams
    const type = searchParams.get('type');
    
    console.log('React Router params - type:', type); // Debug log
    
    // Method 2: Manual URL parsing as fallback
    const hash = window.location.hash;
    const search = window.location.search;
    const href = window.location.href;
    
    console.log('Full URL:', href); // Debug log
    console.log('Hash:', hash); // Debug log  
    console.log('Search:', search); // Debug log
    
    let fallbackType = null;
    
    // Try multiple approaches to get parameters
    if (hash.includes('?')) {
      const hashParts = hash.split('?');
      const fallbackParams = new URLSearchParams(hashParts[1]);
      fallbackType = fallbackParams.get('type');
      console.log('Fallback hash params - type:', fallbackType); // Debug log
    }
    
    // Use React Router params first, then fallback
    const finalType = type || fallbackType;
    
    console.log('Final params - type:', finalType); // Debug log
    
    if (finalType) {
      console.log('Setting selected type to:', finalType); // Debug log
      setSelectedType(finalType);
    }
  }, [searchParams]);

  // Also listen for hash changes (when user navigates)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const hashParts = hash.split('?');
      let urlParams = new URLSearchParams();
      
      if (hashParts.length > 1) {
        urlParams = new URLSearchParams(hashParts[1]);
      }
      
      const type = urlParams.get('type');
      
      console.log('Hash changed - type:', type); // Debug log
      
      if (type) {
        setSelectedType(type);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSortBy("-created_date");
    console.log('Filters cleared'); // Debug log
  };

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);


  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-4">
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Our Beta Collection
            </span>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1 text-base font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              BETA
            </span>
          </h1>
          <p className="text-lg text-stone-600">Explore our beta collection and discover pieces that speak to your style</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 w-full rounded-full border-2 border-stone-200 focus:border-emerald-500 bg-white px-4 outline-none"
              />
            </div>


            {/* Type Filter */}
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full md:w-48 h-12 rounded-full border-2 border-stone-200 bg-white px-4 outline-none focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type.id || type.name} value={type.name.toLowerCase()}>
                  {type.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 h-12 rounded-full border-2 border-stone-200 bg-white px-4 outline-none focus:border-emerald-500"
            >
              <option value="-created_date">Newest First</option>
              <option value="created_date">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="-name">Name: Z-A</option>
            </select>

            {/* Clear Filters Button */}
            {(searchQuery || selectedType !== "all" || sortBy !== "-created_date") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors h-12"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </motion.button>
            )}
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>
              Showing {filteredProducts.length} of {products.length} products
              {selectedType !== "all" && ` for ${types.find(t => t.name.toLowerCase() === selectedType)?.name || selectedType}` }
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-stone-200 rounded-2xl h-80 mb-4" />
                <div className="bg-stone-200 h-6 rounded mb-2" />
                <div className="bg-stone-200 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
              <HomeIcon className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">No products found</h3>
            <p className="text-stone-600 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full px-6 py-3"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`${createPageUrl("ProductDetail")}?id=${product.id}` }>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-gradient-to-br from-stone-100 to-stone-200 shadow-md hover:shadow-xl transition-shadow">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HomeIcon className="w-20 h-20 text-stone-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-stone-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-stone-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                      {product.price} DA
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
