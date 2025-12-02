import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const PagesSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    about: {
      title: 'About Us',
      content: '',
      image: '',
    },
    terms: {
      title: 'Terms of Service',
      content: '',
    },
    privacy: {
      title: 'Privacy Policy',
      content: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.pages) {
        setFormData(settings.pages);
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
      await updateSettings({ pages: formData });
      toast.success('Page content saved successfully');
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
          <CardTitle>About Us Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Input
              label="Page Title"
              value={formData.about.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about: { ...formData.about, title: e.target.value },
                })
              }
              fullWidth
            />
            <Input
              label="Header Image URL"
              value={formData.about.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about: { ...formData.about, image: e.target.value },
                })
              }
              fullWidth
              placeholder="https://example.com/about-header.jpg"
            />
            <TextArea
              label="Content"
              value={formData.about.content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about: { ...formData.about, content: e.target.value },
                })
              }
              fullWidth
              rows={6}
              placeholder="Tell your customers about your business..."
              helperText="Supports Markdown formatting"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Input
              label="Page Title"
              value={formData.terms.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  terms: { ...formData.terms, title: e.target.value },
                })
              }
              fullWidth
            />
            <TextArea
              label="Content"
              value={formData.terms.content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  terms: { ...formData.terms, content: e.target.value },
                })
              }
              fullWidth
              rows={8}
              placeholder="Your terms of service..."
              helperText="Supports Markdown formatting"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Input
              label="Page Title"
              value={formData.privacy.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  privacy: { ...formData.privacy, title: e.target.value },
                })
              }
              fullWidth
            />
            <TextArea
              label="Content"
              value={formData.privacy.content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  privacy: { ...formData.privacy, content: e.target.value },
                })
              }
              fullWidth
              rows={8}
              placeholder="Your privacy policy..."
              helperText="Supports Markdown formatting"
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
          Save Page Content
        </Button>
      </div>
    </div>
  );
};

export default PagesSettings;
