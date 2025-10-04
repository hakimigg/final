import React, { useState, useEffect } from "react";
import { Product } from "@/entities/Product";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Package, Truck, Shield, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";


export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");


  useEffect(() => {
    loadProduct();
  }, []);


  const loadProduct = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      const data = await Product.get(id);
      setProduct(data);
      if (data.colors_available?.length > 0) {
        setSelectedColor(data.colors_available[0]);
      }
    }
  };


  const contactViaPhone = () => {
    window.location.href = 'tel:+213555123456';
  };


  const contactViaEmail = () => {
    const subject = `Inquiry about ${product.name}` ;
    const body = `Hello,\n\nI am interested in the following product:\n\nProduct: ${product.name}\nPrice: ${product.price} DA\n${selectedColor ? ` Color: ${selectedColor}\n` : ''}\nPlease provide more information.\n\nThank you.` ;
    window.location.href = `mailto:contact@betawebsite.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` ;
  };


  const contactViaWhatsApp = () => {
    const message = `Hello, I am interested in ${product.name} (${product.price} DA)${selectedColor ? `  in ${selectedColor}` : ''}. Can you provide more information?` ;
    window.open(`https://wa.me/213555123456?text=${encodeURIComponent(message)}` , '_blank');
  };


  const contactViaInstagram = () => {
    window.open('https://instagram.com/betawebsite', '_blank');
  };


  const contactViaFacebook = () => {
    window.open('https://facebook.com/betawebsite', '_blank');
  };


  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }


  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl("Products")}>
          <Button variant="ghost" className="mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Button>
        </Link>


        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
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


          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200">
                {product.category?.replace(/_/g, ' ').toUpperCase()}
              </Badge>
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






            {/* Contact Section */}
            <div className="border-t border-stone-200 pt-6 space-y-4">
              <h3 className="text-xl font-bold text-stone-800 mb-4">Contact us to purchase:</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={contactViaPhone}
                  className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Phone
                </Button>


                <Button
                  onClick={contactViaEmail}
                  className="h-14 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </Button>


                <Button
                  onClick={contactViaWhatsApp}
                  className="h-14 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>


                <Button
                  onClick={contactViaInstagram}
                  className="h-14 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white"
                >
                  Instagram
                </Button>


                <Button
                  onClick={contactViaFacebook}
                  className="h-14 rounded-xl col-span-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white"
                >
                  Facebook
                </Button>
              </div>
            </div>


            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-sm font-medium text-stone-800">Fast Delivery</p>
                <p className="text-xs text-stone-500">Available</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-sm font-medium text-stone-800">Quality</p>
                <p className="text-xs text-stone-500">Guaranteed</p>
              </div>
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-sm font-medium text-stone-800">Returns</p>
                <p className="text-xs text-stone-500">Easy policy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
