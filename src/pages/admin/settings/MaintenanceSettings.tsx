import { useState, useEffect } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import TextArea from '../../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Badge from '../../../components/ui/Badge';
import { getSettings, updateSettings } from '../../../services/settingsService';
import toast from 'react-hot-toast';

const MaintenanceSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
    allowedIPs: [] as string[],
  });
  const [ipInput, setIpInput] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      if (settings?.maintenance) {
        setFormData(settings.maintenance);
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
      await updateSettings({ maintenance: formData });
      toast.success('Maintenance settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addIP = () => {
    if (ipInput.trim() && !formData.allowedIPs.includes(ipInput.trim())) {
      setFormData({
        ...formData,
        allowedIPs: [...formData.allowedIPs, ipInput.trim()],
      });
      setIpInput('');
    }
  };

  const removeIP = (ip: string) => {
    setFormData({
      ...formData,
      allowedIPs: formData.allowedIPs.filter((i) => i !== ip),
    });
  };

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  return (
    <div className="space-y-6">
      {formData.maintenanceMode && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                Maintenance Mode Active
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Your store is currently in maintenance mode. Only allowed IPs can access the site.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Enable Maintenance Mode
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Put your store in maintenance mode for updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) =>
                    setFormData({ ...formData, maintenanceMode: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <TextArea
              label="Maintenance Message"
              value={formData.maintenanceMessage}
              onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
              fullWidth
              rows={3}
              placeholder="Message to display to visitors during maintenance"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allowed IP Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add IP addresses that can access the site during maintenance mode
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIP()}
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
              <Button variant="secondary" onClick={addIP}>
                Add IP
              </Button>
            </div>

            {formData.allowedIPs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.allowedIPs.map((ip) => (
                  <Badge key={ip} variant="default" className="px-3 py-1.5">
                    {ip}
                    <button
                      onClick={() => removeIP(ip)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
          Save Maintenance Settings
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceSettings;
