import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  contactModalOpen: boolean;
  selectedContactProduct: string | null;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  openContactModal: (productId: string) => void;
  closeContactModal: () => void;
  closeSidebar: () => void;
  closeMobileMenu: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  contactModalOpen: false,
  selectedContactProduct: null,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  
  openContactModal: (productId) =>
    set({ contactModalOpen: true, selectedContactProduct: productId }),
  
  closeContactModal: () =>
    set({ contactModalOpen: false, selectedContactProduct: null }),
  
  closeSidebar: () => set({ sidebarOpen: false }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
}));