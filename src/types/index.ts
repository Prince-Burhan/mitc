// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Product Category
export type ProductCategory = 'Premium' | 'Standard' | 'Basic';

// Product Condition
export type ProductCondition = 'New' | 'Like New' | 'Refurbished' | 'Used';

// Publishing Configuration
export interface PublishConfig {
  featuredSlogan?: string; // Optional
  featuredImage?: string; // Optional
  tags?: string[]; // Optional
  brand: string;
  category: ProductCategory;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  shortSlogan?: string;
  description: string;
  price: number;
  condition: ProductCondition;
  
  // Specifications
  ram?: string;
  cpu?: string;
  gpu?: string;
  storage?: string;
  color?: string;
  
  stockCount: number;
  
  // Flags
  isLimitedStock?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  isTopHighlight?: boolean;
  isBottomHighlight?: boolean;
  
  // Category
  category: ProductCategory;
  tags?: string[];
  
  // Media
  featuredImage: string;
  galleryImages?: string[];
  
  // Backward compatibility
  images?: string[];
  
  // Publishing
  published: boolean;
  publishConfig?: PublishConfig;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  productId: string;
  productName: string;
  purchaseDate: Date;
  warrantyEndDate: Date;
  warrantyStatus: 'Active' | 'Expiring Soon' | 'Expired';
  daysUntilExpiry?: number;
  status: string;
  notes?: string;
  
  // Backward compatibility
  productDetails?: any;
  
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// Settings Types
export interface SiteSettings {
  branding: {
    logo: string;
    favicon: string;
    companyName: string;
    slogan: string;
    primaryColor: string;
    secondaryColor: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
  business: {
    openingHours: string;
    workingDays: string;
    warrantyPeriod: number;
    maxProducts: number;
    showPrices: boolean;
    allowReviews: boolean;
  };
  pages: {
    about: { title: string; content: string; image?: string };
    terms: { title: string; content: string };
    privacy: { title: string; content: string };
    contact?: { title: string; content: string };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
  };
  integrations: {
    googleAnalytics: string;
    facebookPixel: string;
    googleMapsEmbed: string;
  };
  notifications: {
    warrantyReminders: boolean;
    reviewRequests: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  whatsappTemplates?: WhatsAppTemplate[];
  homepageLimits?: {
    topHighlights: number;
    deals: number;
    newArrivals: number;
    limitedStock: number;
    categoryGrid: number;
    bottomHighlights: number;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIPs?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  type: 'warranty_reminder' | 'review_request' | 'custom';
  message: string;
  variables: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Filter Types
export interface ProductFilters {
  category?: ProductCategory;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  searchQuery?: string;
  tags?: string[];
  isNewArrival?: boolean;
  isDeal?: boolean;
  isLimitedStock?: boolean;
  published?: boolean;
}

export interface CustomerFilters {
  status?: string;
  warrantyStatus?: 'active' | 'expiringSoon' | 'expired';
  searchQuery?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ReviewFilters {
  status?: 'pending' | 'approved' | 'rejected';
  rating?: number;
  productId?: string;
  searchQuery?: string;
}

// Stats Types
export interface Stats {
  total: number;
  published?: number;
  unpublished?: number;
  newArrivals?: number;
  deals?: number;
  limitedStock?: number;
  activeWarranty?: number;
  expiringSoon?: number;
  expiredWarranty?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  averageRating?: number;
}

export interface DashboardStats {
  totalCustomers: number;
  activeWarranties: number;
  expiringSoon: number;
  totalProducts: number;
  publishedProducts: number;
  newStock: number;
  limitedStock: number;
  totalReviews: number;
  pendingReviews: number;
  averageRating: number;
}

// Pagination
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasMore?: boolean;
  endCursor?: string;
}