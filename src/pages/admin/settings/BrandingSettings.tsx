import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ImageUpload from '../../../components/ui/ImageUpload';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const BrandingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    logo: '',
    favicon: '',
    companyName: '',
    slogan: '',
    primaryColor: '#21808d',
    secondaryColor: '#5e5240',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.branding) {
        setFormData(settings.branding);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings({ branding: formData });
      toast.success('Branding settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Identity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Slogan / Tagline"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                fullWidth
                placeholder="Your brand tagline"
              />
            </div>

            {/* Logo and Favicon with ImageUpload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                folder="settings/branding"
                label="Company Logo"
                description="Recommended: SVG or PNG with transparent background (500x200px)"
                aspectRatio="5/2"
                maxSize={2}
              />

              <ImageUpload
                value={formData.favicon}
                onChange={(url) => setFormData({ ...formData, favicon: url })}
                folder="settings/branding"
                label="Favicon"
                description="Small icon for browser tabs (32x32px or 64x64px)"
                aspectRatio="1/1"
                maxSize={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  fullWidth
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Main brand color for buttons, links, and accents
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  fullWidth
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supporting color for hover states
              </p>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview
            </p>
            <div className="flex gap-4">
              <button
                style={{ backgroundColor: formData.primaryColor }}
                className="px-6 py-2 text-white rounded-lg font-medium"
              >
                Primary Button
              </button>
              <button
                style={{ backgroundColor: formData.secondaryColor }}
                className="px-6 py-2 text-white rounded-lg font-medium"
              >
                Secondary Button
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={loadSettings}
          disabled={saving}
        >
          Reset Changes
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Branding Settings
        </Button>
      </div>
    </div>
  );
};

export default BrandingSettings;
