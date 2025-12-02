# MITC Store 2025 - Implementation Roadmap

This document outlines all required fixes and missing features to align with the blueprint.

## ✅ **COMPLETED**

### Phase 0: Foundation
- [x] Types updated to match blueprint (Product model fixed)
- [x] Firebase config and auth service created
- [x] Environment template (.env.example)

---

## 🚧 **IN PROGRESS / REQUIRED**

### Phase 1: Authentication & Security (CRITICAL)

#### 1.1 Login Page
- [ ] Create `/src/pages/auth/LoginPage.tsx`
  - Email/password login form
  - Google sign-in (optional)
  - Error handling
  - Redirect logic (admin vs user)

#### 1.2 Protected Routes
- [ ] Create `/src/components/auth/ProtectedRoute.tsx`
  - Role-based access control
  - Redirect unauthenticated users to /login
  - Admin-only route wrapper

#### 1.3 Auth Store Fix
- [ ] Update `/src/store/authStore.ts`
  - Integrate with Firebase auth service
  - Subscribe to auth state changes
  - Persist user data
  - Handle login/logout

#### 1.4 Router Updates
- [ ] Update `/src/router/index.tsx`
  - Add /login route
  - Protect admin routes with ProtectedRoute
  - Add public routes
  - Redirect based on auth status

---

### Phase 2: Public Site (HIGH PRIORITY)

#### 2.1 Public Layout
- [ ] Create `/src/layouts/PublicLayout.tsx`
  - Header, main content, footer structure
  - Mobile responsive

#### 2.2 Public Header (Already Created)
- [x] `/src/components/public/PublicHeader.tsx`
  - Update with search functionality
  - Profile dropdown with notifications
  - Mobile menu

#### 2.3 Public Footer
- [ ] Create `/src/components/public/PublicFooter.tsx`
  - Store info (from SiteSettings)
  - Social icons (WhatsApp, Instagram, Facebook, YouTube)
  - Quick links (About, Terms, Privacy, Contact)
  - Copyright

#### 2.4 Homepage
- [ ] Create `/src/pages/public/HomePage.tsx`
  - Top Highlight Bar (auto slider, max 10 items)
  - Deals Banner Slider (full-width, max 10 items)
  - New Arrivals Section (2-col grid, max 10 items)
  - Limited Stock Section (horizontal/2-col, max 10 items)
  - Category Section (Premium/Standard/Basic, max 30 combined)
  - Bottom Highlight Bar (similar to top, max 10 items)
  - Footer

#### 2.5 Product Listing
- [ ] Create `/src/pages/public/ProductsPage.tsx`
  - Left filter panel (fixed)
    - Brand (multi-select)
    - Category (Premium/Standard/Basic)
    - Price range slider
    - Condition filter
    - Tags (chip filter)
    - Flags (New, Limited, Deals)
  - Right product grid
    - Card view / List view toggle
    - Sorting options
    - Pagination or infinite scroll

#### 2.6 Product Detail
- [ ] Create `/src/pages/public/ProductDetailPage.tsx`
  - Breadcrumb
  - Image gallery (main image + thumbnails)
  - Product info (title, brand, slogan, price, category badges, stock)
  - Contact Store modal trigger
  - Specifications table
  - Description section
  - Related products grid (4-8 items)

#### 2.7 Contact Modal
- [ ] Create `/src/components/public/ContactModal.tsx`
  - WhatsApp (with 10 pre-configured message templates)
  - Instagram
  - Email
  - Facebook
  - Phone call
  - Auto-insert product title in templates

#### 2.8 Static Pages
- [ ] Create `/src/pages/public/AboutPage.tsx`
- [ ] Create `/src/pages/public/TermsPage.tsx`
- [ ] Create `/src/pages/public/PrivacyPage.tsx`
- [ ] Create `/src/pages/public/ContactPage.tsx`
  - All content from SiteSettings

---

### Phase 3: Admin Product Management Fixes

#### 3.1 Update ProductFormPage
- [ ] Update `/src/pages/admin/ProductFormPage.tsx` with blueprint fields:
  - [x] Basic fields (title, brand, model)
  - [ ] Add `slug` field (auto-generate from title)
  - [ ] Add `shortSlogan` field
  - [ ] Update specs to use blueprint structure (ram, cpu, gpu, storage, color)
  - [ ] Add flags checkboxes:
    - isNewArrival
    - isDeal
    - isLimitedStock
    - isTopHighlight
    - isBottomHighlight
  - [ ] Update category to Premium/Standard/Basic
  - [ ] Add `featuredImage` upload (Cloudinary)
  - [ ] Add `galleryImages` multi-upload (Cloudinary)
  - [ ] Add `publishConfig` section
  - [ ] Add SEO fields (metaTitle, metaDescription)

#### 3.2 Product Duplication
- [ ] Add "Duplicate" action in ProductsPage
- [ ] Create duplicate function in productService
  - Copy all fields
  - Append " (Copy)" to title
  - Set published = false
  - Generate new slug

#### 3.3 Product Limits
- [ ] Add 80-product limit check in ProductFormPage
  - Show warning when approaching limit (75+)
  - Block creation at 80
- [ ] Add homepage section limit warnings:
  - Top Highlights: max 10
  - Deals: max 10
  - New Arrivals: max 10
  - Limited Stock: max 10
  - Category Grid: max 30
  - Bottom Highlights: max 10

#### 3.4 ProductsPage Updates
- [ ] Update `/src/pages/admin/ProductsPage.tsx`:
  - Add flag filters (New, Limited, Deal, Highlights)
  - Add "Duplicate" button in actions
  - Show warning badges for sections at/near limits

---

### Phase 4: Settings Enhancements

#### 4.1 Cloudinary Integration Settings
- [ ] Update `/src/pages/admin/settings/IntegrationsSettings.tsx`
  - Add Cloudinary section:
    - Cloud Name
    - API Key
    - Upload Preset
    - Test Connection button

#### 4.2 WhatsApp Templates
- [ ] Create `/src/pages/admin/settings/WhatsAppTemplatesSettings.tsx`
  - List of templates (max 10)
  - Add/Edit/Delete templates
  - Default template toggle
  - Message text with `[Product Title]` placeholder
  - Examples:
    - "Hi, I'm interested in [Product Title]. Is it available?"
    - "Can I get more details about [Product Title]?"
    - "What's the best price for [Product Title]?"

#### 4.3 Homepage Limits Config
- [ ] Update `/src/pages/admin/settings/BusinessSettings.tsx`
  - Add Homepage Limits section:
    - Top Highlights (default 10, max 10)
    - Deals (default 10, max 10)
    - New Arrivals (default 10, max 10)
    - Limited Stock (default 10, max 10)
    - Category Grid (default 30, max 30)
    - Bottom Highlights (default 10, max 10)

#### 4.4 Pages Settings Update
- [ ] Update `/src/pages/admin/settings/PagesSettings.tsx`
  - Add Contact page section
  - Add image upload for About page
  - Add rich text editor or markdown support

---

### Phase 5: Services & Data Layer

#### 5.1 Product Service Updates
- [ ] Update `/src/services/productService.ts`:
  - Update CRUD to handle new Product model
  - Add `duplicateProduct()` function
  - Add `getProductsByFlag()` function
  - Add `getPublishedProducts()` with filters
  - Add `getRelatedProducts()` function
  - Add limit enforcement checks

#### 5.2 Settings Service
- [ ] Create `/src/services/settingsService.ts`:
  - `getSiteSettings()`
  - `updateSiteSettings()`
  - `getWhatsAppTemplates()`
  - `addWhatsAppTemplate()`
  - `updateWhatsAppTemplate()`
  - `deleteWhatsAppTemplate()`

#### 5.3 Upload Service (Cloudinary)
- [ ] Create `/src/services/uploadService.ts`:
  - `uploadImage()` - single image upload to Cloudinary
  - `uploadMultipleImages()` - multiple images
  - `deleteImage()` - remove from Cloudinary
  - Client-side compression (<700KB)

---

### Phase 6: UI Components & Utilities

#### 6.1 Product Card Component
- [ ] Create `/src/components/public/ProductCard.tsx`
  - Image
  - Title
  - Brand
  - Short slogan
  - Price
  - Category badges
  - Stock indicator
  - Hover effects

#### 6.2 Image Gallery Component
- [ ] Create `/src/components/public/ImageGallery.tsx`
  - Main image display
  - Thumbnail navigation
  - Next/Previous arrows
  - Pagination dots
  - Zoom on click (optional)

#### 6.3 Slider Components
- [ ] Create `/src/components/public/HighlightSlider.tsx` (top/bottom bars)
- [ ] Create `/src/components/public/DealsSlider.tsx` (hero banners)

#### 6.4 Filter Panel Component
- [ ] Create `/src/components/public/FilterPanel.tsx`
  - Reusable filter UI
  - Multi-select checkboxes
  - Price range slider
  - Clear filters button

#### 6.5 Breadcrumb Component
- [ ] Create `/src/components/ui/Breadcrumb.tsx`

#### 6.6 Image Upload Component
- [ ] Create `/src/components/ui/ImageUpload.tsx`
  - Cloudinary integration
  - Drag & drop
  - Preview
  - Progress indicator
  - Compression

---

### Phase 7: PWA & Performance

#### 7.1 PWA Setup
- [ ] Create `manifest.json`
  - App name: MITC Store
  - Icons from branding logo
  - Theme color
  - Start URL
- [ ] Create service worker for offline support
- [ ] Add to `index.html`

#### 7.2 Performance Optimizations
- [ ] Lazy load images
- [ ] Code splitting for routes
- [ ] Optimize Cloudinary image delivery (auto format, quality)
- [ ] Add loading states everywhere
- [ ] Implement infinite scroll or pagination

---

### Phase 8: Testing & Deployment

#### 8.1 Testing
- [ ] Test all user roles (guest, user, admin)
- [ ] Test mobile responsiveness
- [ ] Test all CRUD operations
- [ ] Test product limits enforcement
- [ ] Test WhatsApp templates
- [ ] Test image uploads
- [ ] Test filters and search

#### 8.2 Deployment
- [ ] Set up Firebase project
- [ ] Configure Firestore security rules
- [ ] Set up Cloudinary account
- [ ] Deploy to Netlify/Vercel
- [ ] Configure custom domain
- [ ] Enable HTTPS

---

## 📊 **Progress Tracking**

### Completion Summary
- **Phase 0**: ✅ 100% (3/3)
- **Phase 1**: ⏳ 25% (1/4)
- **Phase 2**: ⏳ 10% (1/10)
- **Phase 3**: ⏳ 20% (1/5)
- **Phase 4**: ⏳ 0% (0/4)
- **Phase 5**: ⏳ 0% (0/3)
- **Phase 6**: ⏳ 0% (0/6)
- **Phase 7**: ⏳ 0% (0/2)
- **Phase 8**: ⏳ 0% (0/2)

### Overall: ~12% Complete (6/49 tasks)

---

## 🎯 **Priority Order for Next Implementation**

1. **Phase 1.2-1.4**: Protected routes + auth integration (CRITICAL)
2. **Phase 2.1-2.4**: Public layout + homepage (HIGH)
3. **Phase 3.1**: Update ProductFormPage with all blueprint fields (HIGH)
4. **Phase 2.5-2.6**: Product listing + detail pages (HIGH)
5. **Phase 4.2**: WhatsApp templates settings (MEDIUM)
6. **Phase 5.1-5.3**: Services layer updates (MEDIUM)
7. **Phase 6**: UI components (MEDIUM)
8. **Phase 7-8**: PWA + deployment (LOW - final step)

---

## 💡 **Quick Start Guide**

### To continue development:

1. **Set up Firebase**:
   ```bash
   cp .env.example .env
   # Fill in your Firebase credentials
   ```

2. **Install dependencies**:
   ```bash
   npm install firebase
   ```

3. **Next files to create** (in priority order):
   - `src/components/auth/ProtectedRoute.tsx`
   - `src/pages/auth/LoginPage.tsx`
   - `src/layouts/PublicLayout.tsx`
   - `src/pages/public/HomePage.tsx`

---

## 📝 **Notes**

- All Cloudinary integrations require account setup
- WhatsApp templates should support `[Product Title]` placeholder
- Product duplication should create exact copies with " (Copy)" suffix
- Homepage section limits are hard limits (not recommendations)
- 80-product total limit should be enforced at creation time
- All images should be compressed client-side before Cloudinary upload
- Public site and admin panel are separate routing contexts
