import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const BusinessSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    openingHours: '10:00 AM - 8:00 PM',
    workingDays: 'Monday - Saturday',
    warrantyPeriod: 15,
    maxProducts: 100,
    showPrices: true,
    allowReviews: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.business) {
        setFormData(settings.business);
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
      await updateSettings({ business: formData });
      toast.success('Business settings saved successfully');
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
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Opening Hours"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              fullWidth
              placeholder="10:00 AM - 8:00 PM"
            />
            <Input
              label="Working Days"
              value={formData.workingDays}
              onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
              fullWidth
              placeholder="Monday - Saturday"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product & Warranty Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Default Warranty Period (days)"
              type="number"
              value={formData.warrantyPeriod}
              onChange={(e) =>
                setFormData({ ...formData, warrantyPeriod: parseInt(e.target.value) })
              }
              fullWidth
              min="1"
            />
            <Input
              label="Maximum Products Display"
              type="number"
              value={formData.maxProducts}
              onChange={(e) =>
                setFormData({ ...formData, maxProducts: parseInt(e.target.value) })
              }
              fullWidth
              min="1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Show Prices</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Display product prices on the storefront
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showPrices}
                  onChange={(e) => setFormData({ ...formData, showPrices: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Allow Reviews</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable customer reviews and ratings
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowReviews}
                  onChange={(e) => setFormData({ ...formData, allowReviews: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Business Settings
        </Button>
      </div>
    </div>
  );
};

export default BusinessSettings;
