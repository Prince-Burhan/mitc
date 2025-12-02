import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Star, TrendingUp } from 'lucide-react';
import { getAllProducts } from '../../services/productService';
import { Product } from '../../types';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newStock: 0,
    limitedStock: 0,
    publishedProducts: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const products = await getAllProducts();
      setStats({
        totalProducts: products.length,
        newStock: products.filter((p) => p.isNewArrival).length,
        limitedStock: products.filter((p) => p.isLimitedStock).length,
        publishedProducts: products.filter((p) => p.published).length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      name: 'Published',
      value: stats.publishedProducts,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/admin/products',
    },
    {
      name: 'New Stock',
      value: stats.newStock,
      icon: Package,
      color: 'bg-purple-500',
      link: '/admin/products',
    },
    {
      name: 'Limited Stock',
      value: stats.limitedStock,
      icon: Package,
      color: 'bg-orange-500',
      link: '/admin/products',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to MITC Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
          >
            <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="font-medium text-gray-900">Add New Product</div>
          </Link>
          <Link
            to="/admin/customers"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
          >
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="font-medium text-gray-900">Manage Customers</div>
          </Link>
          <Link
            to="/admin/store-reviews"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
          >
            <Star className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="font-medium text-gray-900">Review Management</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;