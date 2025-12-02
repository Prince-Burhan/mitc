import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Customer, 
  CustomerFilters, 
  CustomerStats,
  Product, 
  ProductFilters, 
  ProductStats,
  StoreReview, 
  ReviewFilters, 
  ReviewStats,
  Pagination 
} from '../types';

export interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  filters: CustomerFilters;
  pagination: Pagination;
  stats: CustomerStats | null;
  selectedCustomers: string[];
  searchQuery: string;

  setCustomers: (customers: Customer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: CustomerFilters) => void;
  setPagination: (pagination: Pagination) => void;
  setStats: (stats: CustomerStats) => void;
  setSelectedCustomers: (selected: string[]) => void;
  setSearchQuery: (query: string) => void;
  selectAll: (select: boolean) => void;
  clearSelection: () => void;
}

export const useCustomersStore = create<CustomersState>()(
  devtools(
    (set, get) => ({
      customers: [],
      loading: false,
      error: null,
      filters: {},
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        pageSize: 50,
        hasNext: false,
        hasPrev: false,
      },
      stats: null,
      selectedCustomers: [],
      searchQuery: '',

      setCustomers: (customers) => set({ customers }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),
      setStats: (stats) => set({ stats }),
      setSelectedCustomers: (selected) => set({ selectedCustomers: selected }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      selectAll: (select) => {
        const { customers } = get();
        if (select) {
          set({ selectedCustomers: customers.map((c) => c.id) });
        } else {
          set({ selectedCustomers: [] });
        }
      },

      clearSelection: () => set({ selectedCustomers: [] }),
    }),
    { name: 'customers-store' }
  )
);

// Product store
export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: Pagination;
  stats: ProductStats | null;
  selectedProducts: string[];
  searchQuery: string;

  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ProductFilters) => void;
  setPagination: (pagination: Pagination) => void;
  setStats: (stats: ProductStats) => void;
  setSelectedProducts: (selected: string[]) => void;
  setSearchQuery: (query: string) => void;
  selectAll: (select: boolean) => void;
  clearSelection: () => void;
}

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      filters: {},
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        pageSize: 50,
        hasNext: false,
        hasPrev: false,
      },
      stats: null,
      selectedProducts: [],
      searchQuery: '',

      setProducts: (products) => set({ products }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),
      setStats: (stats) => set({ stats }),
      setSelectedProducts: (selected) => set({ selectedProducts: selected }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      selectAll: (select) => {
        const { products } = get();
        if (select) {
          set({ selectedProducts: products.map((p) => p.id) });
        } else {
          set({ selectedProducts: [] });
        }
      },

      clearSelection: () => set({ selectedProducts: [] }),
    }),
    { name: 'products-store' }
  )
);

// Reviews store
export interface ReviewsState {
  reviews: StoreReview[];
  loading: boolean;
  error: string | null;
  filters: ReviewFilters;
  pagination: Pagination;
  stats: ReviewStats | null;
  selectedReviews: string[];
  searchQuery: string;

  setReviews: (reviews: StoreReview[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ReviewFilters) => void;
  setPagination: (pagination: Pagination) => void;
  setStats: (stats: ReviewStats) => void;
  setSelectedReviews: (selected: string[]) => void;
  setSearchQuery: (query: string) => void;
  selectAll: (select: boolean) => void;
  clearSelection: () => void;
}

export const useReviewsStore = create<ReviewsState>()(
  devtools(
    (set, get) => ({
      reviews: [],
      loading: false,
      error: null,
      filters: {},
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        pageSize: 50,
        hasNext: false,
        hasPrev: false,
      },
      stats: null,
      selectedReviews: [],
      searchQuery: '',

      setReviews: (reviews) => set({ reviews }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),
      setStats: (stats) => set({ stats }),
      setSelectedReviews: (selected) => set({ selectedReviews: selected }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      selectAll: (select) => {
        const { reviews } = get();
        if (select) {
          set({ selectedReviews: reviews.map((r) => r.id) });
        } else {
          set({ selectedReviews: [] });
        }
      },

      clearSelection: () => set({ selectedReviews: [] }),
    }),
    { name: 'reviews-store' }
  )
);

// UI store for modals, toasts, etc
export interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isModalOpen: boolean;
  modalType: 'customer' | 'product' | 'review' | 'settings' | null;
  modalData: any;
  toast: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  } | null;

  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  openModal: (type: UIState['modalType'], data?: any) => void;
  closeModal: () => void;
  showToast: (message: string, type: UIState['toast']['type'], duration?: number) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      isModalOpen: false,
      modalType: null,
      modalData: null,
      toast: null,

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      openModal: (type, data) =>
        set({ isModalOpen: true, modalType: type, modalData: data }),
      closeModal: () => set({ isModalOpen: false, modalType: null, modalData: null }),

      showToast: (message, type, duration = 4000) =>
        set({ toast: { message, type, duration } }),
      hideToast: () => set({ toast: null }),
    }),
    { name: 'ui-store' }
  )
);