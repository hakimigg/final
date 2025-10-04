import React, { useState, useEffect } from 'react';
import { Product } from '../entities/Product';

const TestPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading products...');
        const data = await Product.list();
        console.log('Products loaded:', data);
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Page - Loading...</h1>
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Test Page - Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Success!</h1>
      <p className="mb-4">Products loaded: {products.length}</p>
      <div className="grid gap-4">
        {products.slice(0, 3).map(product => (
          <div key={product.id} className="p-4 border rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-stone-600">{product.price} DA</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
