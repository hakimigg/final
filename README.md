# Beta Website - Interior Design E-commerce

A modern React-based e-commerce website for furniture and home decor with Supabase backend integration.

## Features

- **Modern UI/UX** - Beautiful gradient designs with Tailwind CSS
- **Product Catalog** - Browse, search, and filter products
- **Product Details** - Detailed product pages with contact options
- **Responsive Design** - Works on all devices
- **Supabase Integration** - Real-time database with PostgreSQL
- **Contact Integration** - Phone, Email, WhatsApp contact options

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env`
3. Add your Supabase URL and anon key to `.env`:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database
1. Go to your Supabase SQL Editor
2. Run the SQL commands from `supabase-schema.sql`
3. This will create the products table with sample data

### 4. Run the Development Server
```bash
npm start
```

The app will open at http://localhost:3000

## Project Structure

```
src/
├── components/          # Reusable components
├── entities/           # Data models and Layout
│   ├── Product.js      # Product entity with Supabase integration
│   └── Layout.jsx      # Main layout component
├── lib/               # Utilities and configurations
│   └── supabase.js    # Supabase client setup
├── pages/             # Page components
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   └── AboutPage.jsx
├── utils/             # Helper functions
│   └── index.js       # URL utilities
├── App.js             # Main app component
├── index.js           # App entry point
└── index.css          # Global styles
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Contact Information

- Email: contact@betawebsite.com
- Phone: +213 555 123 456
- WhatsApp: +213 555 123 456

## License

Private project - All rights reserved.
