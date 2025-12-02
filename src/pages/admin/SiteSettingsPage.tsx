import { Settings } from 'lucide-react';

const SiteSettingsPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure branding, pages, and integrations
        </p>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Branding</h2>
          <p className="text-gray-600">Logo, slogan, contact info, and social links</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pages</h2>
          <p className="text-gray-600">About, Terms, Privacy, and Contact page content</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Integrations</h2>
          <p className="text-gray-600">Cloudinary and Firebase configuration</p>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsPage;