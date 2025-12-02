import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const SEOSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.seo) {
        setFormData(settings.seo);
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
      await updateSettings({ seo: formData });
      toast.success('SEO settings saved successfully');
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
          <CardTitle>Meta Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Input
              label="Meta Title"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              fullWidth
              placeholder="Your Store Name - Best Laptops in Kashmir"
              helperText="Recommended: 50-60 characters"
            />
            <TextArea
              label="Meta Description"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              fullWidth
              rows={3}
              placeholder="Brief description of your store for search engines"
              showCharCount
              maxLength={160}
              helperText="Recommended: 150-160 characters"
            />
            <TextArea
              label="Meta Keywords"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              fullWidth
              rows={2}
              placeholder="laptop, gaming laptop, business laptop, Kashmir"
              helperText="Comma-separated keywords"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Open Graph Image URL"
            value={formData.ogImage}
            onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
            fullWidth
            placeholder="https://example.com/og-image.jpg"
            helperText="Recommended size: 1200x630px"
          />
          {formData.ogImage && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview:
              </p>
              <img
                src={formData.ogImage}
                alt="OG preview"
                className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save SEO Settings
        </Button>
      </div>
    </div>
  );
};

export default SEOSettings;
