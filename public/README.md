# Public Assets

## Required PWA Icons

Create the following icon files and place them in this directory:

### Icon Sizes

1. **pwa-192x192.png** (192x192 pixels)
   - Standard PWA icon
   - Used for home screen

2. **pwa-512x512.png** (512x512 pixels)
   - High resolution PWA icon
   - Used for splash screens

3. **apple-touch-icon.png** (180x180 pixels)
   - iOS home screen icon

4. **favicon.ico** (32x32 pixels)
   - Browser tab icon

### Creating Icons

You can use tools like:
- **Figma/Canva**: Design your logo
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **PWA Asset Generator**: https://github.com/onderceylan/pwa-asset-generator

### Design Guidelines

**Logo Design:**
- Simple and recognizable
- Works well at small sizes
- High contrast
- Brand colors

**Icon Specifications:**
- Square format (1:1 ratio)
- PNG format with transparency
- Safe area: Keep important elements in center 80%
- No text (or minimal, large text only)

### Screenshots (Optional but Recommended)

For better PWA installation UX:

1. **screenshot-1.png** (1280x720 or 1920x1080)
   - Homepage screenshot

2. **screenshot-2.png** (1280x720 or 1920x1080)
   - Products page screenshot

### Quick Setup

If you don't have icons yet, use placeholder:

```bash
# Create placeholder icons (requires ImageMagick)
convert -size 192x192 xc:"#0284c7" -pointsize 80 -gravity center -annotate +0+0 "M" pwa-192x192.png
convert -size 512x512 xc:"#0284c7" -pointsize 200 -gravity center -annotate +0+0 "M" pwa-512x512.png
convert -size 180x180 xc:"#0284c7" -pointsize 72 -gravity center -annotate +0+0 "M" apple-touch-icon.png
```

### Verification

After adding icons:

1. **Test PWA locally:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check manifest:**
   - Open DevTools > Application > Manifest
   - Verify all icons load

3. **Test installation:**
   - Chrome: Address bar > Install button
   - Mobile: Add to Home Screen

### Current Status

- [ ] pwa-192x192.png
- [ ] pwa-512x512.png
- [ ] apple-touch-icon.png
- [ ] favicon.ico
- [ ] screenshot-1.png (optional)
- [ ] screenshot-2.png (optional)

---

**Note**: Replace placeholder icons before production deployment!