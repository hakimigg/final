import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/entities/Product";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, SlidersHorizontal, Home as HomeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");


  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    const data = await Product.list(sortBy);
    setProducts(data);
    setIsLoading(false);
  }, [sortBy]);


  const filterProducts = useCallback(() => {
    let filtered = [...products];


    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }


    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);


  useEffect(() => {
    loadProducts();
  }, [loadProducts]);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, []);


  useEffect(() => {
    filterProducts();
  }, [filterProducts]);


  const categories = [
    { label: "All Products", value: "all" },
    { label: "Living Room", value: "living_room" },
    { label: "Bedroom", value: "bedroom" },
    { label: "Kitchen", value: "kitchen" },
    { label: "Bathroom", value: "bathroom" },
    { label: "Office", value: "office" },
    { label: "Outdoor", value: "outdoor" },
    { label: "Lighting", value: "lighting" },
    { label: "Decor", value: "decor" }
  ];


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
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full border-2 border-stone-200 focus:border-emerald-500 bg-white"
              />
            </div>


            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-full border-2 border-stone-200 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-full border-2 border-stone-200 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_date">Newest First</SelectItem>
                <SelectItem value="created_date">Oldest First</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="-price">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
                <SelectItem value="-name">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>


          {/* Active Filters */}
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>
              Showing {filteredProducts.length} of {products.length} products
              {selectedCategory !== "all" && ` in ${categories.find(c => c.value === selectedCategory)?.label}` }
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
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full"
            >
              Clear Filters
            </Button>
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
