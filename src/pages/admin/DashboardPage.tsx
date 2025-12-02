import { useEffect, useState } from 'react';
import {
  Users,
  Package,
  Star,
  Clock,
  TrendingUp,
  ShoppingCart,
  ChevronRight,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatsBarChart } from '../../components/charts/StatsBarChart';
import { ActivityList } from '../../components/charts/ActivityList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getDashboardStats, getRecentActivity } from '../../services/dashboardService';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
      ]);
      setStats(statsData);
      setActivities(activityData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of store performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats?.totalCustomers}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats?.totalProducts}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats?.totalReviews}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats?.averageRating?.toFixed(1)}/5
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsBarChart data={stats?.monthlyCustomers || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityList activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
