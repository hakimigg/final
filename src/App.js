import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './entities/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import TestPage from './pages/TestPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import { AdminProvider } from './contexts/AdminContext';

function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            <Route path="/home" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            <Route path="/products" element={
              <Layout>
                <ProductsPage />
              </Layout>
            } />
            <Route path="/product-detail" element={
              <Layout>
                <ProductDetailPage />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout>
                <AboutPage />
              </Layout>
            } />
            <Route path="/test" element={
              <Layout>
                <TestPage />
              </Layout>
            } />
            
            {/* Secret Admin Routes - Hard to guess URL for security */}
            <Route path="/beta-secure-admin-portal-2024" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default App;
