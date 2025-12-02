# Contributing to MITC Web App

Thank you for your interest in contributing! This document provides guidelines for contributing to the MITC Web App project.

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Firebase account
- Cloudinary account

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Burhan-sheikh/mitc-store-2025.git
   cd mitc-store-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces/types
- Avoid `any` type when possible
- Use type inference where appropriate

### React

- Use functional components
- Use hooks (useState, useEffect, custom hooks)
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS utility classes
- Follow design system colors and spacing
- Mobile-first responsive design
- Use semantic HTML

### File Organization

```
src/
├── components/
│   ├── admin/          # Admin-specific
│   ├── public/         # Public-facing
│   └── shared/         # Shared/reusable
├── pages/              # Route pages
├── services/           # API calls
├── hooks/              # Custom hooks
├── utils/              # Helper functions
└── types/              # TypeScript types
```

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```bash
feat(products): add filter by brand
fix(auth): resolve login redirect issue
docs(readme): update installation steps
style(header): improve mobile navigation
refactor(api): simplify product service
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow code standards
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Works in Chrome, Firefox, Safari
- [ ] Accessibility (keyboard navigation, screen reader)

### Before Submitting

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] No unused imports or variables
- [ ] Meaningful commit messages
- [ ] Updated documentation if needed

## Code Review

All submissions require review. We look for:

- Code quality and readability
- Adherence to project standards
- Proper TypeScript usage
- Component reusability
- Performance considerations

## Questions?

Feel free to:
- Open an issue for bugs
- Start a discussion for feature ideas
- Ask questions in pull requests

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to MITC Web App! 🚀**