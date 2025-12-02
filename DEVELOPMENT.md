# Development Guide - MITC Web App

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/Burhan-sheikh/mitc-store-2025.git
cd mitc-store-2025

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin panel components
│   ├── public/         # Public site components
│   └── shared/         # Shared components
├── config/             # Configuration files
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── admin/         # Admin pages
│   └── public/        # Public pages
├── services/           # API services
├── store/              # Zustand state stores
├── types/              # TypeScript types
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Technologies

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Framer Motion**: Animations
- **Zustand**: State management

### Backend & Services
- **Firebase Auth**: Authentication
- **Firestore**: Database
- **Cloudinary**: Image hosting

### Build Tools
- **Vite**: Fast dev server & bundler
- **PWA**: Service worker & manifest

## Development Workflow

### Creating New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop feature**
   - Write components
   - Add types
   - Create services
   - Update routes

3. **Test locally**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components & hooks
- Keep components small & focused
- Use Tailwind utility classes
- Add comments for complex logic

### State Management

**Zustand Stores:**
- `authStore`: User authentication
- `productStore`: Product data
- `settingsStore`: Site settings
- `uiStore`: UI state (modals, sidebars)

### API Services

**Service Pattern:**
```typescript
// src/services/exampleService.ts
export const getData = async () => {
  try {
    // Firestore operations
    return data;
  } catch (error) {
    throw new Error('Error message');
  }
};
```

## Testing

### Manual Testing Checklist

**Public Site:**
- [ ] Homepage loads correctly
- [ ] Products page displays products
- [ ] Product detail shows all info
- [ ] Search works
- [ ] Filters work
- [ ] Contact modal opens
- [ ] Mobile responsive

**Admin Panel:**
- [ ] Login works
- [ ] Dashboard shows stats
- [ ] Product CRUD works
- [ ] Image upload works
- [ ] Settings update
- [ ] Mobile responsive

### Browser Testing

- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

## Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link
4. Test routing

### Adding a New Component

1. Create component file
2. Define props interface
3. Implement component
4. Export component
5. Use in pages

### Adding New Service

1. Create service file in `src/services/`
2. Define CRUD functions
3. Handle errors
4. Export functions
5. Use in components

### Updating Types

1. Edit `src/types/index.ts`
2. Update Firestore types in `src/types/firestore.ts`
3. Update affected components
4. Fix TypeScript errors

## Performance Optimization

### Images
- Use Cloudinary transformations
- Lazy load images
- Optimize formats (WebP)
- Set proper dimensions

### Code Splitting
- Route-based splitting (automatic)
- Component lazy loading
- Dynamic imports

### Bundle Size
```bash
# Analyze bundle
npm run build
# Check dist/ folder sizes
```

## Debugging

### React DevTools
- Install extension
- Inspect component tree
- Check state & props

### Firebase Debugging
- Check console logs
- Review Firestore rules
- Test security rules

### Network Debugging
- Use browser DevTools
- Check API calls
- Monitor Cloudinary uploads

## Git Workflow

### Branches
- `main`: Production code
- `develop`: Development code
- `feature/*`: New features
- `fix/*`: Bug fixes

### Commit Messages
```
feat: add new feature
fix: fix bug
style: styling changes
refactor: code refactoring
docs: documentation
chore: maintenance
```

## Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
rm -rf dist
npm run build
```

---

**Happy Coding! 🚀**