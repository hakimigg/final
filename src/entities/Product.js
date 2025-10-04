import { supabase, PRODUCTS_TABLE } from '../lib/supabase';

/**
 * Product Entity
 * Represents furniture and decor products in the e-commerce system
 */
export class Product {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category = data.category || 'decor';
    this.image_url = data.image_url || '';
    this.gallery_images = data.gallery_images || [];
    this.featured = data.featured !== undefined ? data.featured : false;
    this.created_date = data.created_date || new Date().toISOString();
  }

  /**
   * Validate product data
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Product name is required');
    }
    
    if (!this.price || this.price <= 0) {
      errors.push('Product price must be greater than 0');
    }
    
    const validCategories = [
      'living_room', 'bedroom', 'kitchen', 'bathroom', 
      'office', 'outdoor', 'lighting', 'decor'
    ];
    
    if (!this.category || !validCategories.includes(this.category)) {
      errors.push('Valid category is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      image_url: this.image_url,
      gallery_images: this.gallery_images,
      featured: this.featured,
      created_date: this.created_date
    };
  }

  /**
   * Get formatted price with currency
   * @returns {string} Formatted price
   */
  getFormattedPrice() {
    return `${this.price} DA`;
  }

  /**
   * Get category display name
   * @returns {string} Human-readable category name
   */
  getCategoryDisplayName() {
    return this.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Check if product has gallery images
   * @returns {boolean} True if gallery images exist
   */
  hasGalleryImages() {
    return this.gallery_images && this.gallery_images.length > 0;
  }


  // Static methods for data operations (Supabase implementation)
  
  /**
   * Get all products with optional sorting
   * @param {string} sortBy - Sort field (e.g., 'name', '-price', 'created_date')
   * @returns {Promise<Product[]>} Array of products
   */
  static async list(sortBy = '-created_date') {
    try {
      // Fallback to mock data if Supabase is not configured
      if (!supabase || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        return this.getMockData(sortBy);
      }

      let query = supabase.from(PRODUCTS_TABLE).select('*');
      
      // Handle sorting
      const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
      const ascending = !sortBy.startsWith('-');
      
      query = query.order(sortField, { ascending });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        return this.getMockData(sortBy);
      }
      
      return data.map(item => new Product(item));
    } catch (error) {
      console.error('Error in Product.list:', error);
      return this.getMockData(sortBy);
    }
  }

  static getMockData(sortBy = '-created_date') {
    const mockProducts = [
      new Product({
        id: '1',
        name: 'Modern Sofa Set',
        description: 'Comfortable 3-seater sofa with premium fabric upholstery',
        price: 45000,
        category: 'living_room',
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        featured: true,
      }),
      new Product({
        id: '2',
        name: 'Oak Dining Table',
        description: 'Solid oak dining table for 6 people',
        price: 35000,
        category: 'kitchen',
        image_url: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800',
        featured: true,
      }),
      new Product({
        id: '3',
        name: 'Bedside Lamp',
        description: 'Modern ceramic bedside lamp with warm lighting',
        price: 8500,
        category: 'lighting',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        featured: false,
      }),
      new Product({
        id: '4',
        name: 'Leather Armchair',
        description: 'Premium leather armchair with ergonomic design',
        price: 28000,
        category: 'living_room',
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        featured: true,
      }),
      new Product({
        id: '5',
        name: 'Kitchen Island',
        description: 'Multi-functional kitchen island with storage',
        price: 55000,
        category: 'kitchen',
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        featured: false,
      }),
      new Product({
        id: '6',
        name: 'Garden Bench',
        description: 'Weather-resistant outdoor bench',
        price: 15000,
        category: 'outdoor',
        image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
        featured: true,
      })
    ];

    // Simple sorting implementation
    const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    
    return mockProducts.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });
  }

  /**
   * Get products with filters
   * @param {Object} filters - Filter criteria
   * @param {string} sortBy - Sort field
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Product[]>} Filtered products
   */
  static async filter(filters = {}, sortBy = '-created_date', limit = null) {
    try {
      // Fallback to mock data if Supabase is not configured
      if (!supabase || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        const allProducts = this.getMockData(sortBy);
        
        let filtered = allProducts.filter(product => {
          for (const [key, value] of Object.entries(filters)) {
            if (product[key] !== value) {
              return false;
            }
          }
          return true;
        });
        
        if (limit) {
          filtered = filtered.slice(0, limit);
        }
        
        return filtered;
      }

      let query = supabase.from(PRODUCTS_TABLE).select('*');
      
      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
      
      // Handle sorting
      const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
      const ascending = !sortBy.startsWith('-');
      query = query.order(sortField, { ascending });
      
      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error filtering products:', error);
        // Fallback to mock data
        const allProducts = this.getMockData(sortBy);
        let filtered = allProducts.filter(product => {
          for (const [key, value] of Object.entries(filters)) {
            if (product[key] !== value) {
              return false;
            }
          }
          return true;
        });
        
        if (limit) {
          filtered = filtered.slice(0, limit);
        }
        
        return filtered;
      }
      
      return data.map(item => new Product(item));
    } catch (error) {
      console.error('Error in Product.filter:', error);
      // Fallback to mock data
      const allProducts = this.getMockData(sortBy);
      let filtered = allProducts.filter(product => {
        for (const [key, value] of Object.entries(filters)) {
          if (product[key] !== value) {
            return false;
          }
        }
        return true;
      });
      
      if (limit) {
        filtered = filtered.slice(0, limit);
      }
      
      return filtered;
    }
  }

  /**
   * Get single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Product|null>} Product or null if not found
   */
  static async get(id) {
    try {
      // Fallback to mock data if Supabase is not configured
      if (!supabase || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        const allProducts = this.getMockData();
        return allProducts.find(product => product.id === id) || null;
      }

      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching product:', error);
        // Fallback to mock data
        const allProducts = this.getMockData();
        return allProducts.find(product => product.id === id) || null;
      }
      
      return new Product(data);
    } catch (error) {
      console.error('Error in Product.get:', error);
      // Fallback to mock data
      const allProducts = this.getMockData();
      return allProducts.find(product => product.id === id) || null;
    }
  }

  /**
   * Create new product
   * @param {Object} data - Product data
   * @returns {Promise<Product>} Created product
   */
  static async create(data) {
    const product = new Product({
      ...data,
      created_date: new Date().toISOString()
    });
    
    const validation = product.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    try {
      const { data: insertedData, error } = await supabase
        .from(PRODUCTS_TABLE)
        .insert([product.toJSON()])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw new Error(`Failed to create product: ${error.message}`);
      }
      
      return new Product(insertedData);
    } catch (error) {
      console.error('Error in Product.create:', error);
      throw error;
    }
  }

  /**
   * Update existing product
   * @param {string} id - Product ID
   * @param {Object} data - Updated data
   * @returns {Promise<Product|null>} Updated product or null if not found
   */
  static async update(id, data) {
    try {
      // First check if product exists
      const existingProduct = await this.get(id);
      if (!existingProduct) {
        return null;
      }
      
      // Update properties
      Object.assign(existingProduct, data);
      
      const validation = existingProduct.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const { data: updatedData, error } = await supabase
        .from(PRODUCTS_TABLE)
        .update(existingProduct.toJSON())
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw new Error(`Failed to update product: ${error.message}`);
      }
      
      return new Product(updatedData);
    } catch (error) {
      console.error('Error in Product.update:', error);
      throw error;
    }
  }

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from(PRODUCTS_TABLE)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error in Product.delete:', error);
      throw error;
    }
  }
}
