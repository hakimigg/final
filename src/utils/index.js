


export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Products': '/products',
    'ProductDetail': '/product-detail',
    'About': '/about'
  };
  
  return routes[pageName] || '/';
};
