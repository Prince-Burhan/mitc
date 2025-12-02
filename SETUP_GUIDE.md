# MITC Web App - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

Get the app running locally in 5 minutes:

```bash
# 1. Clone repository
git clone https://github.com/Burhan-sheikh/mitc-store-2025.git
cd mitc-store-2025

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Add your credentials to .env (see below)
# 5. Start development server
npm run dev
```

App will open at `http://localhost:3000`

---

## 🔧 Detailed Setup

### 1. Firebase Setup (15 minutes)

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `mitc-store` (or your choice)
4. Disable Google Analytics (optional)
5. Create project

#### Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** sign-in

#### Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **production mode**
4. Choose location (closest to your users)
5. Click **Enable**

#### Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Web** icon (`</>`)
4. Register app: `MITC Web App`
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "mitc-store-xxxxx.firebaseapp.com",
  projectId: "mitc-store-xxxxx",
  storageBucket: "mitc-store-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

6. Add these to `.env`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=mitc-store-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mitc-store-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=mitc-store-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

#### Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Firestore, Hosting, Storage)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

#### Create Admin User

1. Go to **Authentication**
2. Click **Add user**
3. Email: `admin@mitc.com` (or your email)
4. Password: (create a strong password)
5. Copy the **User UID**

6. Go to **Firestore Database**
7. Create collection: `users`
8. Add document with ID = **User UID**:

```json
{
  "uid": "[paste User UID here]",
  "email": "admin@mitc.com",
  "displayName": "Admin",
  "role": "admin",
  "createdAt": [Timestamp - click "add field" > select Timestamp],
  "updatedAt": [Timestamp - click "add field" > select Timestamp]
}
```

---

### 2. Cloudinary Setup (5 minutes)

#### Create Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Confirm email

#### Get Credentials

1. Go to **Dashboard**
2. Copy:
   - **Cloud name**
   - **API Key**

#### Create Upload Preset

1. Go to **Settings** > **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Settings:
   - **Preset name**: `mitc-store`
   - **Signing mode**: **Unsigned**
   - **Folder**: `mitc-store`
   - **Upload manipulations**:
     - Enable **Auto optimize**
     - Format: **Auto**
     - Quality: **Auto**
5. Save

#### Add to .env

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=mitc-store
```

---

### 3. Complete .env File

Your final `.env` should look like:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=mitc-store-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mitc-store-12345
VITE_FIREBASE_STORAGE_BUCKET=mitc-store-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=123456789012345
VITE_CLOUDINARY_UPLOAD_PRESET=mitc-store
```

---

### 4. Run the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✅ Verification Checklist

### Local Development

- [ ] App starts without errors
- [ ] Can navigate all public pages
- [ ] Can login with admin account
- [ ] Admin dashboard loads
- [ ] Can access all admin modules

### Firebase

- [ ] Authentication works
- [ ] Can create/read Firestore data
- [ ] Security rules deployed
- [ ] Admin user created
- [ ] Storage accessible

### Cloudinary

- [ ] Upload preset created
- [ ] Can upload images
- [ ] Images display correctly

---

## 🎨 Add Branding Assets

### PWA Icons

Create and add to `public/` folder:

1. **pwa-192x192.png** (192x192px)
2. **pwa-512x512.png** (512x512px)
3. **apple-touch-icon.png** (180x180px)
4. **favicon.ico** (32x32px)

See `public/README.md` for details.

### Logo

1. Login to admin panel
2. Go to **Site Settings** > **Branding**
3. Upload your logo (recommended: PNG with transparency, max 700KB)

---

## 📊 Initial Data Setup

### 1. Configure Site Settings

1. Login as admin
2. Go to **Site Settings**
3. Configure:
   - **Logo**: Upload your logo
   - **Slogan**: "Your trusted laptop source"
   - **Phone**: +91-XXXXXXXXXX
   - **Address**: Your store address
   - **Social Links**: WhatsApp, Instagram, Facebook, etc.

### 2. Setup Contact Templates

In **Site Settings** > **Contact Templates**, add:

```
1. "Hi, I'm interested in [Product Title]. Is it available?"
2. "Can I get more details about [Product Title]?"
3. "What is the best price for [Product Title]?"
4. "Is [Product Title] still in stock?"
5. "I would like to visit the store to see [Product Title]"
```

### 3. Create Static Pages

In **Site Settings** > **Pages**, update:

- **About**: Your company story
- **Terms & Conditions**: Your terms
- **Privacy Policy**: Your privacy policy
- **Contact**: Your contact info

### 4. Add Your First Product

1. Go to **Products** > **Add Product**
2. Fill in all fields:
   - Basic info (title, brand, model, slogan)
   - Pricing & stock
   - Specifications (RAM, CPU, storage, etc.)
   - Categories (Premium/Standard/Basic)
   - Tags (gaming, business, etc.)
   - Upload images
   - Mark as published
3. Save

---

## 🚀 Deployment

### Option 1: Firebase Hosting

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

Your app will be live at: `https://mitc-store-xxxxx.web.app`

### Option 2: Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click **New site from Git**
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables (from .env)
7. Deploy

Your app will be live at: `https://your-site.netlify.app`

### Custom Domain

#### Firebase Hosting

1. Go to **Hosting** > **Add custom domain**
2. Enter your domain
3. Follow DNS configuration steps

#### Netlify

1. Go to **Domain settings**
2. Click **Add custom domain**
3. Follow DNS configuration steps

---

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] Firebase security rules deployed
- [ ] Storage rules deployed
- [ ] Admin account created with strong password
- [ ] API keys restricted in Firebase console
- [ ] HTTPS enabled (automatic with Firebase/Netlify)
- [ ] `.env` file in `.gitignore`

---

## 📝 Post-Deployment

### 1. Test Everything

- [ ] Visit public homepage
- [ ] Browse products
- [ ] Test search and filters
- [ ] Test product detail page
- [ ] Test contact modal
- [ ] Login to admin
- [ ] Create a test product
- [ ] Upload images
- [ ] Verify mobile responsive

### 2. SEO Setup

1. Update `index.html` meta tags
2. Add Google Analytics (optional)
3. Submit sitemap to Google Search Console
4. Add structured data for products

### 3. PWA Installation

#### Android (Browser)

1. Visit site on Chrome/Edge
2. Tap **Add to Home Screen**
3. Confirm installation
4. App appears on home screen

#### iOS (Limited PWA support)

1. Visit site in Safari
2. Tap Share button
3. Tap **Add to Home Screen**

---

## 👥 User Accounts

### Creating Customer Accounts

Customers can sign up at `/login` page.

### Adding Admin Users

1. Create user in **Authentication**
2. Add document in **Firestore** > `users` collection
3. Set `role: "admin"`

---

## 📊 Monitoring

### Firebase Console

- **Authentication**: Monitor user signups
- **Firestore**: Check database usage
- **Storage**: Monitor image storage
- **Hosting**: Check bandwidth usage

### Cloudinary Dashboard

- Monitor storage usage
- Check transformations
- View bandwidth

---

## ❓ Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear build
rm -rf dist
npm run build
```

### Firebase Errors

- Check security rules are deployed
- Verify API key in .env
- Check user role in Firestore
- Ensure indexes are created

### Image Upload Errors

- Verify Cloudinary credentials
- Check upload preset is unsigned
- Ensure images are < 700KB
- Check network connectivity

### Login Issues

- Verify email/password in Firebase Auth
- Check user document exists in Firestore
- Verify `role` field is set correctly
- Clear browser cache/cookies

---

## 📞 Support

### Documentation

- [README.md](./README.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [DEVELOPMENT.md](./DEVELOPMENT.md)
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

### External Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)

### Getting Help

1. Check documentation above
2. Review error messages carefully
3. Check browser console
4. Review Firebase logs
5. Contact developer

---

## 🎉 You're All Set!

Your MITC Web App is now ready for production!

### Next Steps

1. ✅ Add your products
2. ✅ Configure site settings
3. ✅ Upload branding assets
4. ✅ Test all features
5. ✅ Launch to customers

**Happy selling! 🚀**

---

**Last Updated**: December 2024
**Version**: 1.0.0