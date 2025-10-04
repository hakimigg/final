/**
 * Create page URL for routing
 * @param {string} pageName - Name of the page
 * @returns {string} URL path
 */
export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Products': '/products',
    'ProductDetail': '/product-detail',
    'About': '/about'
  };
  
  return routes[pageName] || '/';
};
