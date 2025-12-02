import { useState, useEffect } from 'react';
import { Cloud, CheckCircle, XCircle, Loader, Eye, EyeOff } from 'lucide-react';
import Button from '../../../components/ui/Button';
import {
  getCloudinarySettings,
  saveCloudinarySettings,
  testCloudinaryConnection,
} from '../../../services/cloudinaryService';
import { CloudinarySettings } from '../../../types/settings';
import toast from 'react-hot-toast';

const IntegrationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

  const [cloudinarySettings, setCloudinarySettings] = useState<CloudinarySettings>({
    cloudName: '',
    apiKey: '',
    apiSecret: '',
    uploadPreset: '',
    enabled: false,
  });

  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getCloudinarySettings();
      if (settings) {
        setCloudinarySettings(settings);
        if (settings.lastTested) {
          setTestResult({
            tested: true,
            success: settings.testStatus === 'success',
            message:
              settings.testStatus === 'success'
                ? 'Last test: Connection successful'
                : 'Last test: Connection failed',
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!cloudinarySettings.cloudName || !cloudinarySettings.apiKey || !cloudinarySettings.uploadPreset) {
        toast.error('Please fill in all required fields');
        return;
      }

      setSaving(true);
      await saveCloudinarySettings(cloudinarySettings);
      toast.success('Cloudinary settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      // Validate required fields
      if (!cloudinarySettings.cloudName || !cloudinarySettings.apiKey || !cloudinarySettings.uploadPreset) {
        toast.error('Please fill in all required fields first');
        return;
      }

      setTesting(true);
      setTestResult(null);

      const result = await testCloudinaryConnection(cloudinarySettings);

      setTestResult({
        tested: true,
        success: result.success,
        message: result.message,
      });

      // Save test result
      await saveCloudinarySettings({
        ...cloudinarySettings,
        lastTested: new Date(),
        testStatus: result.success ? 'success' : 'failed',
      });

      if (result.success) {
        toast.success('Connection test successful!');
      } else {
        toast.error(`Connection test failed: ${result.message}`);
      }
    } catch (error: any) {
      setTestResult({
        tested: true,
        success: false,
        message: error.message || 'Test failed',
      });
      toast.error(error.message || 'Failed to test connection');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Integrations</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Connect third-party services to enhance your store functionality
        </p>
      </div>

      {/* Cloudinary Integration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Cloudinary</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Image and video management platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cloudinarySettings.enabled}
                  onChange={(e) =>
                    setCloudinarySettings({ ...cloudinarySettings, enabled: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cloudinarySettings.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cloud Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cloud Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cloudinarySettings.cloudName}
              onChange={(e) =>
                setCloudinarySettings({ ...cloudinarySettings, cloudName: e.target.value })
              }
              placeholder="your-cloud-name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Found in your Cloudinary Dashboard
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cloudinarySettings.apiKey}
              onChange={(e) =>
                setCloudinarySettings({ ...cloudinarySettings, apiKey: e.target.value })
              }
              placeholder="123456789012345"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          {/* API Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Secret <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showApiSecret ? 'text' : 'password'}
                value={cloudinarySettings.apiSecret}
                onChange={(e) =>
                  setCloudinarySettings({ ...cloudinarySettings, apiSecret: e.target.value })
                }
                placeholder="••••••••••••••••••••••••"
                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowApiSecret(!showApiSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showApiSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Store securely. In production, use backend storage.
            </p>
          </div>

          {/* Upload Preset */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Preset <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cloudinarySettings.uploadPreset}
              onChange={(e) =>
                setCloudinarySettings({ ...cloudinarySettings, uploadPreset: e.target.value })
              }
              placeholder="ml_default or your-preset-name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create an unsigned upload preset in Cloudinary Settings → Upload
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                testResult.success
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    testResult.success
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {testResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing || saving}
              leftIcon={
                testing ? <Loader className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />
              }
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving || testing}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          How to set up Cloudinary
        </h3>
        <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex gap-2">
            <span className="font-semibold">1.</span>
            <span>Sign up for a free account at cloudinary.com</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">2.</span>
            <span>Go to Dashboard to find your Cloud Name and API Key</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">3.</span>
            <span>
              Go to Settings → Upload → Add upload preset (unsigned) for your store
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">4.</span>
            <span>Enter the credentials above and test the connection</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">5.</span>
            <span>Enable Cloudinary and save - images will now upload automatically!</span>
          </li>
        </ol>
      </div>

      {/* Future Integrations */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Coming Soon
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 opacity-50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Stripe</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Payment processing integration
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 opacity-50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">PayPal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Alternative payment gateway</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
