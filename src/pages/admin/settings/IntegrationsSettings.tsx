import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const IntegrationsSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    googleAnalytics: '',
    facebookPixel: '',
    googleMapsEmbed: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.integrations) {
        setFormData(settings.integrations);
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
      await updateSettings({ integrations: formData });
      toast.success('Integration settings saved successfully');
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
          <CardTitle>Analytics & Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Input
              label="Google Analytics Tracking ID"
              value={formData.googleAnalytics}
              onChange={(e) => setFormData({ ...formData, googleAnalytics: e.target.value })}
              fullWidth
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
              helperText="Get your tracking ID from Google Analytics"
            />
            <Input
              label="Facebook Pixel ID"
              value={formData.facebookPixel}
              onChange={(e) => setFormData({ ...formData, facebookPixel: e.target.value })}
              fullWidth
              placeholder="123456789012345"
              helperText="Get your pixel ID from Facebook Business Manager"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Maps</CardTitle>
        </CardHeader>
        <CardContent>
          <TextArea
            label="Google Maps Embed Code"
            value={formData.googleMapsEmbed}
            onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
            fullWidth
            rows={4}
            placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
            helperText="Paste the full iframe embed code from Google Maps"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Integration Settings
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsSettings;
