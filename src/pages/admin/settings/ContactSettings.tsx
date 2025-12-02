import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const ContactSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.contact) {
        setFormData(settings.contact);
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
      await updateSettings({ contact: formData });
      toast.success('Contact settings saved successfully');
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
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                placeholder="+91-1234567890"
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                placeholder="contact@example.com"
              />
            </div>

            <TextArea
              label="Physical Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              rows={3}
              placeholder="Enter your full business address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="WhatsApp Number"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              fullWidth
              placeholder="+91-1234567890"
            />
            <Input
              label="Instagram Handle"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              fullWidth
              placeholder="@yourbusiness"
            />
            <Input
              label="Facebook Page URL"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              fullWidth
              placeholder="https://facebook.com/yourbusiness"
            />
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
          Save Contact Settings
        </Button>
      </div>
    </div>
  );
};

export default ContactSettings;
