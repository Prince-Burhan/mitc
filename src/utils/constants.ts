export const PRODUCT_LIMITS = {
  TOTAL: 80,
  TOP_HIGHLIGHT: 10,
  DEALS: 10,
  NEW_ARRIVALS: 10,
  LIMITED_STOCK: 10,
  CATEGORY_GRID: 30,
  BOTTOM_HIGHLIGHT: 10,
} as const;

export const WARRANTY_DAYS = 15;

export const PRODUCT_CONDITIONS = [
  'New',
  'Like New',
  'Used',
  'Refurbished',
] as const;

export const PRODUCT_CATEGORIES = [
  'Premium',
  'Standard',
  'Basic',
  'New',
  'Limited',
  'Deal',
  'HighlightTop',
  'HighlightBottom',
] as const;

export const REVIEW_STATUS = [
  'Pending',
  'Approved',
  'Rejected',
] as const;

export const CUSTOMER_STATUS = [
  'Active',
  'Warranty Expired',
  'Review Requested',
  'Completed',
] as const;

export const CONTACT_PLATFORMS = [
  'whatsapp',
  'instagram',
  'email',
  'facebook',
  'phone',
] as const;

export const DEFAULT_CONTACT_TEMPLATES = [
  {
    id: '1',
    label: 'General Inquiry',
    message: "Hi, I'm interested in [Product Title]. Is it available?",
    platform: 'whatsapp' as const,
  },
  {
    id: '2',
    label: 'Request Details',
    message: 'Can I get more details about [Product Title]?',
    platform: 'whatsapp' as const,
  },
  {
    id: '3',
    label: 'Price Inquiry',
    message: 'What is the best price for [Product Title]?',
    platform: 'whatsapp' as const,
  },
  {
    id: '4',
    label: 'Availability Check',
    message: 'Is [Product Title] still in stock?',
    platform: 'whatsapp' as const,
  },
  {
    id: '5',
    label: 'Visit Store',
    message: 'I would like to visit the store to see [Product Title]',
    platform: 'whatsapp' as const,
  },
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
} as const;

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:productId',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  CONTACT: '/contact',
  LOGIN: '/login',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_PRODUCTS_EDIT: '/admin/products/:productId/edit',
  ADMIN_REVIEWS: '/admin/store-reviews',
  ADMIN_SETTINGS: '/admin/site-settings',
} as const;