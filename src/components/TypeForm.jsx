import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader, Palette } from 'lucide-react';
import { Type } from '../entities/Type';
import ImageUpload from './ImageUpload';

export default function TypeForm({ type, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6B7280',
    image_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

 
  const colorOptions = [
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Gray', value: '#6B7280' }
  ];

  useEffect(() => {
    if (type) {
      setFormData({
        name: type.name || '',
        description: type.description || '',
        color: type.color || '#6B7280',
        image_url: type.image_url || ''
      });
    }
  }, [type]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Type name is required';
    }

    if (formData.name.trim().length > 50) {
      newErrors.name = 'Type name must be 50 characters or less';
    }

    if (formData.color && !/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = 'Please select a valid color';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (type) {
        
        await Type.update(type.id, formData);
      } else {
        
        await Type.create(formData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving type:', error);
      setErrors({ submit: 'Error saving type. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
        >
          {}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              {type ? 'Edit Type' : 'Add New Type'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-6">
              {}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Type Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Enter type name"
                  maxLength={50}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter type description"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => handleInputChange('color', colorOption.value)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
                        formData.color === colorOption.value
                          ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                      title={colorOption.name}
                    />
                  ))}
                </div>
                
                {}
                <div className="mt-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 cursor-pointer"
                    title="Custom color"
                  />
                </div>
                
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                )}
              </div>

              {}
              <ImageUpload
                currentImage={formData.image_url}
                onImageUploaded={handleImageUpload}
                folder="types"
                label="Type Image (Optional)"
              />

              {}
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-semibold text-slate-900 mb-2">Preview:</p>
                <div className="flex items-center space-x-3">
                  {formData.image_url ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={formData.image_url}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-6 h-6 rounded-lg"
                      style={{ backgroundColor: formData.color }}
                    />
                  )}
                  <span className="font-medium text-slate-900">
                    {formData.name || 'Type Name'}
                  </span>
                </div>
              </div>
            </div>
          </form>

          {}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{type ? 'Update Type' : 'Create Type'}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
