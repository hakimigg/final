import React, { useState, useEffect } from "react";
import { Product } from "@/entities/Product";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Home as HomeIcon, Star } from "lucide-react";
import { motion } from "framer-motion";


export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    loadFeaturedProducts();
  }, []);


  const loadFeaturedProducts = async () => {
    const products = await Product.filter({ featured: true }, "-created_date", 6);
    setFeaturedProducts(products);
    setIsLoading(false);
  };


  const categories = [
    { name: "Living Room", value: "living_room", color: "from-emerald-500 to-teal-600" },
    { name: "Bedroom", value: "bedroom", color: "from-rose-500 to-pink-600" },
    { name: "Kitchen", value: "kitchen", color: "from-amber-500 to-orange-600" },
    { name: "Lighting", value: "lighting", color: "from-yellow-500 to-amber-600" },
    { name: "Decor", value: "decor", color: "from-purple-500 to-indigo-600" },
    { name: "Outdoor", value: "outdoor", color: "from-green-500 to-emerald-600" }
  ];


  return (
    <div className="pb-20">
      {}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('./photo-1618221195710-dd6b41faaea6.jpeg')` ,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Transform Your Space
              </span>
              <br />
              <span className="text-stone-800">Into Art</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover handcrafted furniture and decor that brings elegance, warmth, and personality to every corner of your home
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={createPageUrl("Products")}>
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to={createPageUrl("About")}>
                <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-800 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-stone-200">
                  Our Story
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Shop by Room
              </span>
            </h2>
            <p className="text-lg text-stone-600">Find the perfect pieces for every space in your home</p>
          </motion.div>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`${createPageUrl("Products")}?category=${category.value}` }>
                  <div className={`group relative overflow-hidden rounded-2xl p-6 h-40 bg-gradient-to-br ${category.color} hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer` }>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                      <span className="font-bold text-lg">{category.name}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
                Featured Collection
              </span>
            </h2>
            <p className="text-lg text-stone-600">Handpicked pieces that define elegance</p>
          </motion.div>


          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 rounded-2xl h-80 mb-4" />
                  <div className="bg-stone-200 h-6 rounded mb-2" />
                  <div className="bg-stone-200 h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`${createPageUrl("ProductDetail")}?id=${product.id}` }>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-stone-100">
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
                        <div className="absolute top-4 right-4">
                          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-stone-800 group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-stone-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                          {product.price} DA
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}


          <div className="text-center mt-12">
            <Link to={createPageUrl("Products")}>
              <button className="px-8 py-4 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-full font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
