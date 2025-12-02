import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Palette,
  Phone,
  Building2,
  FileText,
  Search as SearchIcon,
  Globe,
  Bell,
  Shield,
  Wrench,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';

const SettingsPage = () => {
  const location = useLocation();
  const isMainSettings = location.pathname === '/admin/settings';

  const settingsSections = [
    {
      id: 'branding',
      name: 'Branding',
      icon: Palette,
      path: '/admin/settings/branding',
      description: 'Logo, colors, and company identity',
    },
    {
      id: 'contact',
      name: 'Contact Information',
      icon: Phone,
      path: '/admin/settings/contact',
      description: 'Phone, email, address, and social media',
    },
    {
      id: 'business',
      name: 'Business Settings',
      icon: Building2,
      path: '/admin/settings/business',
      description: 'Hours, warranty period, and limits',
    },
    {
      id: 'pages',
      name: 'Page Content',
      icon: FileText,
      path: '/admin/settings/pages',
      description: 'About, Terms, and Privacy pages',
    },
    {
      id: 'seo',
      name: 'SEO & Analytics',
      icon: SearchIcon,
      path: '/admin/settings/seo',
      description: 'Meta tags and tracking codes',
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: Globe,
      path: '/admin/settings/integrations',
      description: 'Third-party services and APIs',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      path: '/admin/settings/notifications',
      description: 'Email and SMS notification settings',
    },
    {
      id: 'maintenance',
      name: 'Maintenance Mode',
      icon: Wrench,
      path: '/admin/settings/maintenance',
      description: 'Site maintenance and allowed IPs',
    },
  ];

  if (isMainSettings) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your store settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <NavLink key={section.id} to={section.path}>
                <Card hover className="h-full transition-all duration-200 hover:border-primary-500">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </NavLink>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <NavLink
                key={section.id}
                to={section.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {section.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <Outlet />
    </div>
  );
};

export default SettingsPage;
