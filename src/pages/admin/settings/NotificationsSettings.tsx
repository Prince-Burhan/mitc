import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const NotificationsSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    warrantyReminders: true,
    reviewRequests: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.notifications) {
        setFormData(settings.notifications);
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
      await updateSettings({ notifications: formData });
      toast.success('Notification settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
    </label>
  );

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automated Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Warranty Expiry Reminders
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically send reminders before warranty expires
                </p>
              </div>
              <ToggleSwitch
                checked={formData.warrantyReminders}
                onChange={(checked) => setFormData({ ...formData, warrantyReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Review Requests</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request reviews from customers after warranty period
                </p>
              </div>
              <ToggleSwitch
                checked={formData.reviewRequests}
                onChange={(checked) => setFormData({ ...formData, reviewRequests: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Email Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send notifications via email
                </p>
              </div>
              <ToggleSwitch
                checked={formData.emailNotifications}
                onChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  SMS Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send notifications via SMS (requires integration)
                </p>
              </div>
              <ToggleSwitch
                checked={formData.smsNotifications}
                onChange={(checked) => setFormData({ ...formData, smsNotifications: checked })}
              />
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
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;
