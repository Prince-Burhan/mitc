# Deployment Guide - MITC Web App

## Prerequisites

- Node.js (v18 or higher)
- Firebase CLI
- Git
- Firebase Project
- Cloudinary Account

## Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
npm install
```

### 1.2 Configure Environment Variables

Create `.env` file in root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Step 2: Firebase Setup

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase

```bash
firebase login
```

### 2.3 Initialize Firebase Project

```bash
firebase init
```

Select:
- Firestore
- Hosting
- Storage

### 2.4 Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

### 2.5 Create Admin User

Manually add a user in Firebase Console:
1. Go to Authentication
2. Add user with email/password
3. Go to Firestore
4. Create document in `users` collection:
   ```json
   {
     "uid": "[user_uid_from_auth]",
     "email": "admin@mitc.com",
     "displayName": "Admin",
     "role": "admin",
     "createdAt": [timestamp],
     "updatedAt": [timestamp]
   }
   ```

## Step 3: Cloudinary Setup

### 3.1 Create Upload Preset

1. Go to Cloudinary Dashboard
2. Settings > Upload
3. Create unsigned upload preset
4. Set folder to `mitc-store`
5. Enable auto-optimization
6. Copy preset name to `.env`

## Step 4: Build & Deploy

### 4.1 Build for Production

```bash
npm run build
```

### 4.2 Test Production Build Locally

```bash
npm run preview
```

### 4.3 Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### 4.4 Deploy to Netlify (Alternative)

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

## Step 5: Post-Deployment

### 5.1 Initialize Site Settings

1. Login as admin
2. Go to Site Settings
3. Configure:
   - Logo upload
   - Store slogan
   - Contact information
   - Social media links

### 5.2 Add Products

1. Go to Products
2. Click "Add Product"
3. Fill in product details
4. Upload images to Cloudinary
5. Publish

### 5.3 Test PWA Installation

1. Visit site on mobile
2. Use "Add to Home Screen"
3. Test offline functionality

## Step 6: Monitoring & Maintenance

### 6.1 Firebase Console

- Monitor authentication
- Check Firestore usage
- Review storage usage

### 6.2 Cloudinary Dashboard

- Monitor storage usage
- Check bandwidth
- Optimize images

### 6.3 Performance

- Use Lighthouse for audits
- Monitor Core Web Vitals
- Check bundle sizes

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear build
rm -rf dist
npm run build
```

### Firebase Permission Errors

- Check Firestore rules
- Verify user role in Firestore
- Check authentication status

### Image Upload Issues

- Verify Cloudinary credentials
- Check upload preset settings
- Ensure images are < 700KB

## Security Checklist

- [ ] Environment variables secured
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Admin user created
- [ ] API keys restricted (Firebase Console)
- [ ] HTTPS enabled
- [ ] CORS configured

## Production URLs

- **Firebase Hosting**: `https://[project-id].web.app`
- **Netlify**: `https://[site-name].netlify.app`
- **Custom Domain**: Configure in hosting settings

## Support

For issues:
1. Check console logs
2. Review Firebase logs
3. Check Cloudinary logs
4. Contact developer

---

**Built with ❤️ for MITC**