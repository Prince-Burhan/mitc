# MITC Web App - Premium Laptop Showroom

![MITC Logo](https://via.placeholder.com/200x60?text=MITC)

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]() [![React](https://img.shields.io/badge/React-18.2-blue)]() [![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)]() [![License](https://img.shields.io/badge/License-Proprietary-red)]()

## 🎯 Overview

A **premium showroom-style web application** for **Mateen IT Corp. (MITC)** to showcase in-store laptop inventory. Built with modern web technologies for a fast, responsive, and professional experience worth ₹2,00,000+.

**Philosophy**: Product discovery and customer contact — NOT e-commerce cart/payment.

### ✨ Live Demo

- **Public Site**: Coming soon
- **Admin Panel**: Coming soon

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Burhan-sheikh/mitc-store-2025.git
cd mitc-store-2025

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Firebase & Cloudinary credentials

# Start development server
npm run dev
```

App opens at `http://localhost:3000`

---

## 📊 Repository Status

### ✅ **PRODUCTION READY - 95% Complete**

| Component | Status | Completion |
|-----------|--------|------------|
| Core Infrastructure | ✅ Complete | 100% |
| Public Site | ✅ Complete | 95% |
| Admin Panel | ✅ Complete | 90% |
| API Services | ✅ Complete | 100% |
| Security | ✅ Complete | 100% |
| Documentation | ✅ Complete | 100% |
| Deployment Config | ✅ Complete | 100% |

**Total Files**: 100+  
**Lines of Code**: 10,000+  
**Documentation**: 9 comprehensive guides  

📄 **[View Detailed Status Report](./IMPLEMENTATION_STATUS.md)**

---

## 💎 Key Features

### Customer-Facing (Public Site)

- ✅ **Homepage** with 7 dynamic sections
  - Top highlight bar (auto-slider)
  - Deals banner (full-width slider)
  - New arrivals grid
  - Limited stock alerts
  - Category grid (Premium/Standard/Basic)
  - Bottom highlight bar
- ✅ **Product Listing** with advanced search & filters
- ✅ **Product Detail** with image gallery & specs
- ✅ **Contact Modal** with 10 message templates
- ✅ **Mobile PWA** (installable on Android)
- ✅ **Static Pages** (About, Terms, Privacy, Contact)

### Admin Panel

- ✅ **Dashboard** with real-time statistics
- ✅ **Product Management**
  - Full CRUD operations
  - Image upload (Cloudinary)
  - Multi-image gallery (drag-to-reorder)
  - Rich text editor
  - Tags & categories
  - Duplicate & delete
  - Publish/draft toggle
- ✅ **Customer Module** (warranty tracking)
- ✅ **Reviews Module** (approve/reject workflow)
- ✅ **Site Settings** (branding & pages)
- ✅ **Role-Based Access** (admin-only routes)

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Tailwind CSS 3.3** - Utility-first styling
- **Vite 5.0** - Lightning-fast build tool
- **React Router 6.20** - Navigation
- **Framer Motion 10.16** - Smooth animations
- **Zustand 4.4** - State management

### Backend & Services
- **Firebase 10.7**
  - Authentication (email/password)
  - Firestore Database
  - Storage
- **Cloudinary** - Image hosting & optimization

### PWA
- **Vite PWA Plugin** - Service worker generation
- **Workbox** - Offline support & caching

---

## 📁 Project Structure

```
mitc-store-2025/
├── public/              # Static assets & PWA files
├── src/
│   ├── components/      # React components
│   │   ├── admin/      # Admin-specific (14 components)
│   │   ├── public/     # Public-facing (5 components)
│   │   └── shared/     # Shared/reusable (4 components)
│   ├── config/         # Firebase & Cloudinary config
│   ├── hooks/          # Custom React hooks (6 hooks)
│   ├── layouts/        # Layout components
│   ├── pages/          # Route pages
│   │   ├── admin/     # Admin pages (6 pages)
│   │   └── public/    # Public pages (7 pages)
│   ├── services/       # API services (6 services)
│   ├── store/          # Zustand stores (4 stores)
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── Configuration Files (12 files)
└── Documentation (9 guides)
```

---

## 📚 Documentation

### Setup & Deployment

1. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** ⭐
   - Step-by-step Firebase setup
   - Cloudinary configuration
   - Environment variables
   - Admin user creation

2. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - Firebase Hosting deployment
   - Netlify deployment
   - Custom domain setup
   - Security checklist

3. **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)**
   - Pre-deployment checks
   - Testing checklist
   - Post-deployment verification

### Development

4. **[DEVELOPMENT.md](./DEVELOPMENT.md)**
   - Development workflow
   - Code standards
   - Component patterns
   - State management

5. **[CONTRIBUTING.md](./CONTRIBUTING.md)**
   - Contribution guidelines
   - Code style
   - Pull request process

### Reference

6. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**
   - Complete architecture
   - Data models
   - Security rules
   - Feature specifications

7. **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)**
   - Current status
   - What's complete
   - What's pending
   - Launch steps

8. **[CHANGELOG.md](./CHANGELOG.md)**
   - Version history
   - Feature additions
   - Updates & fixes

9. **[.env.example](./.env.example)**
   - Environment template
   - Required variables

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Cloudinary account

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/Burhan-sheikh/mitc-store-2025.git
   cd mitc-store-2025
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # Firebase
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Cloudinary
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_API_KEY=your_api_key
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. **Deploy Security Rules**
   ```bash
   firebase login
   firebase init
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

4. **Create Admin User**
   - Add user in Firebase Authentication
   - Create document in Firestore `users` collection with `role: "admin"`
   - See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for details

5. **Start Development**
   ```bash
   npm run dev
   ```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
firebase deploy
```

---

## 📊 Product Limits

- **Total Products**: 80 max
- **Top Highlights**: 10 max
- **Deals Banner**: 10 max
- **New Arrivals**: 10 max
- **Limited Stock**: 10 max
- **Category Grid**: 30 max (combined)
- **Bottom Highlights**: 10 max

---

## 🔐 Security

### Firestore Rules

```javascript
// Products: Public can read published, admins can write
allow read: if resource.data.published == true || isAdmin();
allow write: if isAdmin();
```

### Storage Rules

```javascript
// Images: Public read, authenticated write (< 5MB)
allow read: if true;
allow write: if request.auth != null && 
                request.resource.size < 5 * 1024 * 1024;
```

### Input Validation

- Email format validation
- Phone number validation
- Password strength requirements
- Image size & type validation
- Price & stock validation

---

## 🎨 Design System

### Colors

```css
primary: #0284c7 (Sky Blue)
accent: #d946ef (Purple)
success: #10b981 (Green)
error: #ef4444 (Red)
warning: #f59e0b (Orange)
```

### Typography

- **Font Family**: Inter (sans-serif), Poppins (display)
- **Font Sizes**: 12px - 30px (responsive)
- **Font Weights**: 400, 500, 600, 700

### Components

- Buttons (primary, secondary, outline)
- Cards with hover effects
- Form inputs with validation
- Badges for status
- Modals & overlays
- Loading states
- Empty states

---

## 🤝 Contributing

This is a proprietary project for Mateen IT Corp. For contributions:

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Follow code standards
3. Create feature branch
4. Submit pull request

---

## 📝 License

Proprietary - © 2024 Mateen IT Corp. All rights reserved.

---

## 👨‍💻 Developer

**Burhan Sheikh**  
Full-Stack Web Developer  
Based in Srinagar, Kashmir

---

## 📞 Contact

For support or inquiries:

- **Email**: contact@mitc.com
- **Phone**: +91-XXXXXXXXXX
- **Location**: Maisuma, Srinagar, Kashmir 190019
- **GitHub**: [@Burhan-sheikh](https://github.com/Burhan-sheikh)

---

## ⭐ Features Highlight

### What Makes This Special

✅ **Modern Stack** - React 18, TypeScript, Tailwind  
✅ **PWA Ready** - Installable on mobile devices  
✅ **Fast** - Vite build, optimized images, lazy loading  
✅ **Secure** - Production-grade security rules  
✅ **Responsive** - Mobile-first design  
✅ **Professional** - Clean code, comprehensive docs  
✅ **Scalable** - Well-structured architecture  
✅ **Maintainable** - TypeScript, ESLint, proper patterns  

---

## 🛣️ Roadmap

### Phase 1: Launch (Complete ✅)
- [x] Core infrastructure
- [x] Public site
- [x] Admin panel
- [x] Product management
- [x] Security rules
- [x] Documentation

### Phase 2: Enhancements (Planned)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Performance monitoring

### Phase 3: Advanced Features (Future)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced search (Algolia)
- [ ] A/B testing
- [ ] Mobile app (React Native)

---

## 📊 Stats

```
Total Files:        100+
Lines of Code:      10,000+
Components:         23
Pages:              13
Services:           6
Hooks:              6
Stores:             4
Documentation:      9 guides
Configuration:      12 files
```
---

**Built with ❤️ in Kashmir**

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: December 2, 2024