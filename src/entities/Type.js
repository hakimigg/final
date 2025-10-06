import { supabase, TYPES_TABLE } from '../lib/supabase';

/**
 * Type Entity
 * Represents product types/categories in the system
 */
export class Type {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.color = data.color || '#6B7280';
    this.image_url = data.image_url || '';
    this.created_date = data.created_date || new Date().toISOString();
  }

  /**
   * Validate type data
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Type name is required');
    }
    
    if (this.name && this.name.trim().length > 50) {
      errors.push('Type name must be 50 characters or less');
    }
    
    // Validate color format (hex)
    if (this.color && !/^#[0-9A-F]{6}$/i.test(this.color)) {
      errors.push('Color must be a valid hex color (e.g., #FF0000)');
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
      color: this.color,
      image_url: this.image_url,
      created_date: this.created_date
    };
  }

  // Static methods for data operations

  /**
   * Get all types with optional sorting
   * @param {string} sortBy - Sort field (e.g., 'name', '-created_date')
   * @returns {Promise<Type[]>} Array of types
   */
  static async list(sortBy = 'name') {
    try {
      // Fallback to mock data if Supabase is not configured
      if (!supabase || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        return this.getMockData(sortBy);
      }

      let query = supabase.from(TYPES_TABLE).select('*');
      
      // Handle sorting
      const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
      const ascending = !sortBy.startsWith('-');
      
      query = query.order(sortField, { ascending });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching types:', error);
        return this.getMockData(sortBy);
      }
      
      return data.map(item => new Type(item));
    } catch (error) {
      console.error('Error in Type.list:', error);
      return this.getMockData(sortBy);
    }
  }

  static getMockData(sortBy = 'name') {
    const mockTypes = [
      new Type({
        id: '1',
        name: 'Furniture',
        description: 'Tables, chairs, sofas, and other furniture pieces',
        color: '#8B5CF6',
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
      }),
      new Type({
        id: '2',
        name: 'Lighting',
        description: 'Lamps, chandeliers, and lighting fixtures',
        color: '#F59E0B',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
      }),
      new Type({
        id: '3',
        name: 'Decor',
        description: 'Decorative items and accessories',
        color: '#EF4444',
        image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'
      }),
      new Type({
        id: '4',
        name: 'Storage',
        description: 'Cabinets, shelves, and storage solutions',
        color: '#10B981',
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
      })
    ];

    // Simple sorting implementation
    const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    
    return mockTypes.sort((a, b) => {
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
   * Get single type by ID
   * @param {string} id - Type ID
   * @returns {Promise<Type|null>} Type or null if not found
   */
  static async get(id) {
    try {
      // Fallback to mock data if Supabase is not configured
      if (!supabase || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        const allTypes = this.getMockData();
        return allTypes.find(type => type.id === id) || null;
      }

      const { data, error } = await supabase
        .from(TYPES_TABLE)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching type:', error);
        const allTypes = this.getMockData();
        return allTypes.find(type => type.id === id) || null;
      }
      
      return new Type(data);
    } catch (error) {
      console.error('Error in Type.get:', error);
      const allTypes = this.getMockData();
      return allTypes.find(type => type.id === id) || null;
    }
  }

  /**
   * Create new type
   * @param {Object} data - Type data
   * @returns {Promise<Type>} Created type
   */
  static async create(data) {
    const type = new Type({
      ...data,
      created_date: new Date().toISOString()
    });
    
    const validation = type.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    try {
      // Check if Supabase is configured
      if (!supabase || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        throw new Error('Supabase not configured. Please check your environment variables.');
      }

      // Remove id from data when creating (let database generate it)
      const typeData = type.toJSON();
      delete typeData.id;

      const { data: insertedData, error } = await supabase
        .from(TYPES_TABLE)
        .insert([typeData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating type:', error);
        // Provide more specific error messages
        if (error.code === '42501') {
          throw new Error('Permission denied. Please ensure you are logged in as admin.');
        } else if (error.code === '23505') {
          throw new Error('Type with this name already exists.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      return new Type(insertedData);
    } catch (error) {
      console.error('Error in Type.create:', error);
      throw error;
    }
  }

  /**
   * Update existing type
   * @param {string} id - Type ID
   * @param {Object} data - Updated data
   * @returns {Promise<Type|null>} Updated type or null if not found
   */
  static async update(id, data) {
    try {
      // First check if type exists
      const existingType = await this.get(id);
      if (!existingType) {
        return null;
      }
      
      // Update properties
      Object.assign(existingType, data);
      
      const validation = existingType.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const { data: updatedData, error } = await supabase
        .from(TYPES_TABLE)
        .update(existingType.toJSON())
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating type:', error);
        throw new Error(`Failed to update type: ${error.message}`);
      }
      
      return new Type(updatedData);
    } catch (error) {
      console.error('Error in Type.update:', error);
      throw error;
    }
  }

  /**
   * Delete type
   * @param {string} id - Type ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from(TYPES_TABLE)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting type:', error);
        throw new Error(`Failed to delete type: ${error.message}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error in Type.delete:', error);
      throw error;
    }
  }
}
