import React, { useState, useEffect } from "react";
import { Product } from "../entities/Product";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowLeft, Package, Phone, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    
    const hash = window.location.hash;
    const href = window.location.href;
    
    console.log('ProductDetail - Full URL:', href); 
    console.log('ProductDetail - Hash:', hash); 
    
    let urlParams = new URLSearchParams();
    
    
    if (hash.includes('?')) {
      const hashParts = hash.split('?');
      urlParams = new URLSearchParams(hashParts[1]);
      console.log('ProductDetail - Hash params:', hashParts[1]); 
    }
    
    else if (window.location.search) {
      urlParams = new URLSearchParams(window.location.search);
      console.log('ProductDetail - Search params:', window.location.search); 
    }
    
    const id = urlParams.get('id');
    console.log('ProductDetail - Product ID:', id); 
    
    if (id) {
      try {
        console.log('ProductDetail - Loading product with ID:', id); 
        setLoading(true);
        setError(null);
        
        const data = await Product.get(id);
        console.log('ProductDetail - Product loaded:', data); 
        
        if (data) {
          setProduct(data);
        } else {
          console.error('ProductDetail - Product not found'); 
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError(`Failed to load product: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('ProductDetail - No product ID found in URL'); 
      setError('No product ID provided');
      setLoading(false);
    }
  };

  const contactViaPhone = () => {
    window.location.href = 'tel:+213555123456';
  };

  const contactViaEmail = () => {
    const subject = `Inquiry about ${product.name}` ;
    const body = `Hello,\n\nI am interested in the following product:\n\nProduct: ${product.name}\nPrice: ${product.price} DA\n\nPlease provide more information.\n\nThank you.` ;
    window.location.href = `mailto:contact@betawebsite.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` ;
  };

  const contactViaWhatsApp = () => {
    const message = `Hello, I am interested in ${product.name} (${product.price} DA). Can you provide more information?` ;
    window.open(`https://wa.me/213555123456?text=${encodeURIComponent(message)}` , '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link to={createPageUrl("Products")}>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Available</h2>
          <p className="text-slate-600 mb-6">This product is currently not available.</p>
          <Link to={createPageUrl("Products")}>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl("Products")}>
          <button className="mb-8 group flex items-center gap-2 text-stone-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br from-stone-100 to-stone-200 shadow-2xl">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-32 h-32 text-stone-300" />
                </div>
              )}
            </div>

            {product.gallery_images && product.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.gallery_images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-stone-100 cursor-pointer hover:opacity-75 transition-opacity">
                    <img src={img} alt={`${product.name} ${i + 1}` } className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block mb-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category?.replace(/_/g, ' ').toUpperCase()}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-stone-800 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  {product.price} DA
                </span>
              </div>
              <p className="text-lg text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>



            {}
            <div className="border-t border-stone-200 pt-6 space-y-4">
              <h3 className="text-xl font-bold text-stone-800 mb-4">Contact us to purchase:</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={contactViaPhone}
                  className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Phone
                </button>

                <button
                  onClick={contactViaEmail}
                  className="h-14 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>

                <button
                  onClick={contactViaWhatsApp}
                  className="h-14 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center justify-center gap-2 col-span-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
