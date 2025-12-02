import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';

// Admin imports
import DashboardPage from '../pages/admin/DashboardPage';
import CustomersPage from '../pages/admin/CustomersPage';
import CustomerFormPage from '../pages/admin/CustomerFormPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import AdminProductsPage from '../pages/admin/ProductsPage';
import ProductFormPage from '../pages/admin/ProductFormPage';
import ReviewsPage from '../pages/admin/ReviewsPage';
import SettingsPage from '../pages/admin/SettingsPage';
import BrandingSettings from '../pages/admin/settings/BrandingSettings';
import ContactSettings from '../pages/admin/settings/ContactSettings';
import BusinessSettings from '../pages/admin/settings/BusinessSettings';
import SEOSettings from '../pages/admin/settings/SEOSettings';
import PagesSettings from '../pages/admin/settings/PagesSettings';
import IntegrationsSettings from '../pages/admin/settings/IntegrationsSettings';
import NotificationsSettings from '../pages/admin/settings/NotificationsSettings';
import MaintenanceSettings from '../pages/admin/settings/MaintenanceSettings';

// Auth imports
import LoginPage from '../pages/auth/LoginPage';

// Public imports
import HomePage from '../pages/public/HomePage';
import PublicProductsPage from '../pages/public/ProductsPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import AboutPage from '../pages/public/AboutPage';
import TermsPage from '../pages/public/TermsPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import ContactPage from '../pages/public/ContactPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'customers/new',
        element: <CustomerFormPage />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
      {
        path: 'customers/:id/edit',
        element: <CustomerFormPage />,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'products/new',
        element: <ProductFormPage />,
      },
      {
        path: 'products/:id/edit',
        element: <ProductFormPage />,
      },
      {
        path: 'reviews',
        element: <ReviewsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        children: [
          {
            path: 'branding',
            element: <BrandingSettings />,
          },
          {
            path: 'contact',
            element: <ContactSettings />,
          },
          {
            path: 'business',
            element: <BusinessSettings />,
          },
          {
            path: 'seo',
            element: <SEOSettings />,
          },
          {
            path: 'pages',
            element: <PagesSettings />,
          },
          {
            path: 'integrations',
            element: <IntegrationsSettings />,
          },
          {
            path: 'notifications',
            element: <NotificationsSettings />,
          },
          {
            path: 'maintenance',
            element: <MaintenanceSettings />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <PublicProductsPage />,
      },
      {
        path: 'products/:slug',
        element: <ProductDetailPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
