# MITC Web App - Complete Project Overview

## 🎯 Project Vision

A **premium showroom-style web application** for Mateen IT Corp. (MITC) to showcase in-store laptop inventory with a professional, modern interface worth ₹2,00,000+.

**Key Philosophy**: Product discovery and customer contact — NOT e-commerce cart/payment.

---

## 📊 Project Status

**Repository**: [mitc-store-2025](https://github.com/Burhan-sheikh/mitc-store-2025)

**Current State**: ✅ **Foundation Complete**

### What's Implemented

✅ Complete project structure
✅ TypeScript configuration
✅ Tailwind CSS setup
✅ React Router v6 routing
✅ Firebase integration (Auth + Firestore)
✅ Cloudinary integration
✅ State management (Zustand)
✅ Public site layout
✅ Admin panel layout
✅ Authentication system
✅ Product CRUD services
✅ PWA configuration
✅ Deployment configs (Firebase + Netlify)
✅ Security rules (Firestore + Storage)

### What Needs Implementation

🔴 Customer service (warranty tracking)
🔴 Store reviews service
🔴 Complete product form
🔴 Settings management UI
🔴 Image upload components
🔴 Rich text editor integration
🔴 Export functionality (CSV/PDF)
🔴 Notification system

---

## 🏛️ Architecture

### Technology Stack

```
Frontend:
  - React 18.2.0
  - TypeScript 5.2.2
  - Tailwind CSS 3.3.6
  - Vite 5.0.8
  - React Router 6.20.0
  - Framer Motion 10.16.0
  - Zustand 4.4.7

Backend & Services:
  - Firebase 10.7.0
    - Authentication
    - Firestore Database
    - Storage
  - Cloudinary
    - Image hosting
    - Optimization

PWA:
  - Vite PWA Plugin
  - Workbox
  - Service Workers
```

### Application Structure

```
mitc-store/
├── Public Site (/)
│   ├── Homepage
│   │   ├── Top Highlight Bar (10 max)
│   │   ├── Deals Banner Slider (10 max)
│   │   ├── New Arrivals (10 max)
│   │   ├── Limited Stock (10 max)
│   │   ├── Category Grid (30 max total)
│   │   │   ├── Premium
│   │   │   ├── Standard
│   │   │   └── Basic
│   │   └── Bottom Highlight Bar (10 max)
│   ├── Products Listing
│   │   ├── Filter Sidebar
│   │   └── Product Grid
│   ├── Product Detail
│   │   ├── Image Gallery
│   │   ├── Specifications
│   │   ├── Description
│   │   └── Contact Modal
│   └── Static Pages
│       ├── About
│       ├── Terms & Conditions
│       ├── Privacy Policy
│       └── Contact
└── Admin Panel (/admin)
    ├── Dashboard
    ├── Customers Module
    ├── Products Module
    │   ├── List View
    │   ├── Create/Edit Form
    │   └── Duplicate/Delete
    ├── Store Reviews
    └── Site Settings
        ├── Branding
        ├── Pages Management
        └── Integrations
```

---

## 📊 Data Model

### Firestore Collections

#### Products Collection
```typescript
{
  id: string (auto)
  title: string
  slug: string
  brand: string
  model: string
  shortSlogan: string
  description: string
  price: number
  condition: 'New' | 'Like New' | 'Used' | 'Refurbished'
  ram: string
  cpu: string
  gpu?: string
  storage: string
  color: string
  stockCount: number
  isLimitedStock: boolean
  isNewArrival: boolean
  isDeal: boolean
  isTopHighlight: boolean
  isBottomHighlight: boolean
  category: ProductCategory[]
  tags: string[]
  featuredImage: string (Cloudinary URL)
  galleryImages: string[] (Cloudinary URLs)
  publishConfig: {
    featuredSlogan?: string
    featuredImage?: string
    tags: string[]
    brand: string
    category: ProductCategory[]
  }
  createdAt: Timestamp
  updatedAt: Timestamp
  published: boolean
}
```

**Product Limits:**
- Total: 80 products max
- Top Highlights: 10 max
- Deals: 10 max
- New Arrivals: 10 max
- Limited Stock: 10 max
- Category Grid: 30 max combined
- Bottom Highlights: 10 max

#### Customers Collection
```typescript
{
  id: string
  name: string
  phone: string
  email: string
  purchaseDate: Timestamp
  warrantyEndDate: Timestamp (purchaseDate + 15 days)
  productId: string
  productDetails: {
    title: string
    brand: string
    model: string
  }
  notes: string
  status: 'Active' | 'Warranty Expired' | 'Review Requested' | 'Completed'
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Warranty System:**
- 15-day testing warranty
- Automated status tracking
- Review request after warranty expiry

#### Store Reviews Collection
```typescript
{
  id: string
  customerName: string
  rating: number (1-5)
  title?: string
  comment: string
  createdAt: Timestamp
  status: 'Pending' | 'Approved' | 'Rejected'
  source: 'Manual' | 'Link' | 'Google' | 'Other'
}
```

#### Users Collection
```typescript
{
  uid: string
  email: string
  displayName?: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Settings Document
```typescript
{
  branding: {
    logo: string (Cloudinary URL)
    slogan: string
    phone: string
    address?: string
    social: {
      whatsapp?: string
      instagram?: string
      facebook?: string
      youtube?: string
      email?: string
    }
  }
  pages: {
    about: { title, content, featuredImage?, updatedAt }
    terms: { title, content, featuredImage?, updatedAt }
    privacy: { title, content, featuredImage?, updatedAt }
    contact: { title, content, phone, email, location }
  }
  plugins: {
    cloudinary: { cloudName, apiKey, mediaFolder }
    firebase: { projectId }
  }
  contactTemplates: [
    {
      id: string
      label: string
      message: string (supports [Product Title] placeholder)
      platform: 'whatsapp' | 'instagram' | 'email' | 'facebook' | 'phone'
    }
  ]
}
```

---

## 🔐 Security

### Firestore Rules

```javascript
// Products: Public can read published, admins can write
allow read: if resource.data.published == true || isAdmin();
allow write: if isAdmin();

// Customers: Admin only
allow read, write: if isAdmin();

// Reviews: Public can read approved, create new; admins can manage
allow read: if resource.data.status == 'Approved' || isAdmin();
allow create: if true;
allow update, delete: if isAdmin();

// Settings: Public read, admin write
allow read: if true;
allow write: if isAdmin();
```

### Storage Rules

```javascript
// Images: Public read, authenticated write (< 5MB, images only)
allow read: if true;
allow write: if request.auth != null && 
                request.resource.size < 5 * 1024 * 1024 &&
                request.resource.contentType.matches('image/.*');
```

---

## 🎨 Design System

### Color Palette

```css
primary: {
  50: '#f0f9ff',
  600: '#0284c7',  /* Main brand color */
  700: '#0369a1',
}

accent: {
  500: '#d946ef',  /* Highlight color */
  600: '#c026d3',
}
```

### Typography

```css
font-family: {
  sans: ['Inter', 'system-ui'],
  display: ['Poppins', 'system-ui'],
}

font-size: {
  base: '14px',
  lg: '16px',
  xl: '18px',
  2xl: '20px',
  3xl: '24px',
  4xl: '30px',
}
```

### Components

- Cards with hover effects
- Buttons (primary, secondary, outline)
- Form inputs with focus states
- Badges for status indicators
- Loading spinners
- Empty states
- Error messages
- Modals & overlays

---

## 📦 State Management

### Zustand Stores

**authStore:**
- Current user
- Loading state
- Login/logout actions

**productStore:**
- Products list
- Filtered products
- Selected product
- Search filters

**settingsStore:**
- Site settings
- Branding
- Pages content

**uiStore:**
- Sidebar state
- Mobile menu
- Modal states
- Search bar

---

## 🚀 PWA Features

### Manifest
```json
{
  "name": "MITC - Mateen IT Corp",
  "short_name": "MITC",
  "theme_color": "#1a1a1a",
  "display": "standalone",
  "icons": [
    { "src": "/pwa-192x192.png", "sizes": "192x192" },
    { "src": "/pwa-512x512.png", "sizes": "512x512" }
  ]
}
```

### Service Worker

- Offline fallback
- Cache Firestore API
- Cache Cloudinary images (30 days)
- Network-first for API
- Cache-first for images

### Installation

**Browser (Android):**
1. Visit site
2. Chrome: "Add to Home Screen"
3. Installed as PWA

**Play Store (Future):**
- Trusted Web Activity wrapper
- Published on Google Play

---

## 📝 Contact System

### Contact Modal

Triggered from product detail page:

**Quick Contact Options:**
- WhatsApp (with pre-filled message)
- Instagram DM
- Email
- Facebook
- Phone call

**Message Templates (10 max):**
```
1. "Hi, I'm interested in [Product Title]. Is it available?"
2. "Can I get more details about [Product Title]?"
3. "What is the best price for [Product Title]?"
4. "Is [Product Title] still in stock?"
5. "I would like to visit the store to see [Product Title]"
... (admin configurable)
```

---

## 📊 Analytics & Monitoring

### What to Track

**Public Site:**
- Page views
- Product views
- Search queries
- Contact modal opens
- Filter usage

**Admin Panel:**
- Login attempts
- Product CRUD operations
- Image uploads
- Settings updates

### Firebase Analytics

```javascript
import { logEvent } from 'firebase/analytics';

logEvent(analytics, 'product_view', {
  product_id: product.id,
  product_name: product.title,
});
```

---

## 🛠️ Development Workflow

### Local Development

```bash
# Install
npm install

# Configure
cp .env.example .env
# Edit .env with credentials

# Run
npm run dev
# Opens http://localhost:3000
```

### Building

```bash
# Production build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

### Deployment

**Firebase:**
```bash
firebase deploy
```

**Netlify:**
- Auto-deploy on push to main
- Environment variables in dashboard

---

## 🔧 Next Steps

### Immediate Tasks

1. **Complete Product Form**
   - All fields functional
   - Image upload integration
   - Validation
   - Preview mode

2. **Settings UI**
   - Branding form
   - Pages editor (rich text)
   - Social links
   - Contact templates

3. **Customer Module**
   - Customer CRUD
   - Warranty tracking
   - Notification system

4. **Reviews Module**
   - Review approval workflow
   - Export to CSV/PDF
   - Public display

### Future Enhancements

- Email notifications (SendGrid/Mailgun)
- SMS notifications (Twilio)
- Google Analytics integration
- Performance monitoring
- A/B testing
- Multi-language support
- Dark mode
- Advanced search (Algolia)
- Backup & restore

---

## 📚 Resources

### Documentation
- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [.env.example](./.env.example) - Environment template

### External Docs
- [Firebase](https://firebase.google.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)

---

## 👥 Team

**Developer**: Burhan Sheikh
**Client**: Mateen IT Corp (MITC)
**Location**: Srinagar, Kashmir 190019

---

## 📝 License

Proprietary - © 2025 Mateen IT Corp. All rights reserved.

---

**Project Status**: 🟢 Active Development

**Last Updated**: December 2024

**Version**: 1.0.0
