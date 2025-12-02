import { create } from 'zustand';
import { Product, SearchFilters } from '../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  filters: SearchFilters;
  loading: boolean;
  setProducts: (products: Product[]) => void;
  setFilteredProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
}

const initialFilters: SearchFilters = {
  query: '',
  brand: [],
  category: [],
  tags: [],
  condition: [],
  published: true,
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  filters: initialFilters,
  loading: false,
  
  setProducts: (products) => set({ products }),
  setFilteredProducts: (filteredProducts) => set({ filteredProducts }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  resetFilters: () => set({ filters: initialFilters }),
  setLoading: (loading) => set({ loading }),
}));