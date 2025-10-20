import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Home, Package, Info } from "lucide-react";


export default function Layout({ children, currentPageName }) {
  const location = useLocation();


  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50">
      <style>{`
        :root {
          --emerald: #047857;
          --terracotta: #dc6b4a;
          --blush: #fcd5ce;
          --gold: #d4af37;
          --cream: #faf9f6;
          --charcoal: #2d3436;
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--emerald), var(--terracotta));
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--emerald), var(--terracotta));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>


      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Beta Website</h1>
                <p className="text-xs text-stone-500 -mt-1">Interior Design</p>
              </div>
            </Link>


            <nav className="hidden md:flex items-center gap-8">
              <Link 
                to={createPageUrl("Home")} 
                className={`nav-link text-stone-700 hover:text-emerald-700 font-medium ${isActive("Home") ? "active text-emerald-700" : ""}` }
              >
                Home
              </Link>
              <Link 
                to={createPageUrl("Products")} 
                className={`nav-link text-stone-700 hover:text-emerald-700 font-medium ${isActive("Products") ? "active text-emerald-700" : ""}` }
              >
                Shop
              </Link>
              <Link 
                to={createPageUrl("About")} 
                className={`nav-link text-stone-700 hover:text-emerald-700 font-medium ${isActive("About") ? "active text-emerald-700" : ""}` }
              >
                About
              </Link>
            </nav>
          </div>


          <div className="md:hidden flex justify-center gap-6 mt-4 pt-4 border-t border-stone-200">
            <Link 
              to={createPageUrl("Home")} 
              className={`flex flex-col items-center gap-1 ${isActive("Home") ? "text-emerald-700" : "text-stone-600"}` }
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link 
              to={createPageUrl("Products")} 
              className={`flex flex-col items-center gap-1 ${isActive("Products") ? "text-emerald-700" : "text-stone-600"}` }
            >
              <Package className="w-5 h-5" />
              <span className="text-xs font-medium">Shop</span>
            </Link>
            <Link 
              to={createPageUrl("About")} 
              className={`flex flex-col items-center gap-1 ${isActive("About") ? "text-emerald-700" : "text-stone-600"}` }
            >
              <Info className="w-5 h-5" />
              <span className="text-xs font-medium">About</span>
            </Link>
          </div>
        </div>
      </header>


      <main className="min-h-screen">
        {children}
      </main>


      <footer className="bg-gradient-to-r from-stone-900 via-emerald-900 to-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text bg-gradient-to-r from-amber-400 to-rose-400">Beta Website</h3>
              <p className="text-stone-300 leading-relaxed">
                Curating beautiful spaces with handpicked interior design pieces that transform houses into homes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-amber-400">Quick Links</h4>
              <div className="space-y-2">
                <Link to={createPageUrl("Products")} className="block text-stone-300 hover:text-amber-400 transition-colors">Shop All</Link>
                <Link to={createPageUrl("About")} className="block text-stone-300 hover:text-amber-400 transition-colors">Our Purpose</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-amber-400">Contact</h4>
              <p className="text-stone-300">Email: contact@betawebsite.com</p>
              <p className="text-stone-300">Phone: +213 555 123 456</p>
            </div>
          </div>
          <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-400 text-sm">
            © 2025 Beta Website. Crafted with love for beautiful spaces.
          </div>
        </div>
      </footer>
    </div>
  );
}
