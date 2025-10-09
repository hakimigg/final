import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  LogOut, 
  BarChart3,
  Users,
  ShoppingBag,
  TrendingUp,
  Filter,
  MoreVertical,
  Tag,
  Palette
} from 'lucide-react';
import { Product } from '../entities/Product';
import { Type } from '../entities/Type';
import ProductForm from '../components/ProductForm';
import TypeForm from '../components/TypeForm';

export default function AdminDashboard() {
  const { logout, user } = useAdmin();
  const [activeTab, setActiveTab] = useState('products');
  
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  
  const [types, setTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: 0,
    totalTypes: 0
  });

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Living Room', value: 'living_room' },
    { name: 'Bedroom', value: 'bedroom' },
    { name: 'Kitchen', value: 'kitchen' },
    { name: 'Lighting', value: 'lighting' },
    { name: 'Decor', value: 'decor' },
    { name: 'Outdoor', value: 'outdoor' }
  ];

  useEffect(() => {
    loadProducts();
    loadTypes();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await Product.list('-created_date');
      setProducts(data);
      
      
      const totalProducts = data.length;
      const featuredProducts = data.filter(p => p.featured).length;
      const uniqueCategories = [...new Set(data.map(p => p.category))].length;
      
      setStats(prev => ({
        ...prev,
        totalProducts,
        featuredProducts,
        categories: uniqueCategories
      }));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await Product.delete(productId);
        await loadProducts(); 
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    handleCloseForm();
    loadProducts();
  };

  
  const loadTypes = async () => {
    try {
      setTypesLoading(true);
      const data = await Type.list('name');
      setTypes(data);
      
      setStats(prev => ({
        ...prev,
        totalTypes: data.length
      }));
    } catch (error) {
      console.error('Error loading types:', error);
    } finally {
      setTypesLoading(false);
    }
  };

  const handleDeleteType = async (typeId) => {
    if (window.confirm('Are you sure you want to delete this type?')) {
      try {
        await Type.delete(typeId);
        await loadTypes();
      } catch (error) {
        console.error('Error deleting type:', error);
        alert('Error deleting type');
      }
    }
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setShowTypeForm(true);
  };

  const handleCloseTypeForm = () => {
    setShowTypeForm(false);
    setEditingType(null);
  };

  const handleTypeSaved = () => {
    handleCloseTypeForm();
    loadTypes();
  };

  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTypes = types.filter(type => {
    return type.name.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
           (type.description && type.description.toLowerCase().includes(typeSearchTerm.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage your products and inventory</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Featured Products</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.featuredProducts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.categories}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Types</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalTypes}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Products ({stats.totalProducts})
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'types'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Types ({stats.totalTypes})
            </button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-80"
                />
              </div>

              {}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProductForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </motion.button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Products ({filteredProducts.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Featured</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-600 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {product.category?.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-900">{product.price} DA</span>
                      </td>
                      <td className="py-4 px-6">
                        {product.featured ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSave={handleProductSaved}
        />
      )}
    </div>
  );
}
