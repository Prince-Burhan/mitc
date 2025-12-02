import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DashboardStats } from '../types';
import { getCustomerStats } from './customerService';
import { getProductStats } from './productService';
import { getReviewStats } from './reviewService';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [customerStats, productStats, reviewStats] = await Promise.all([
      getCustomerStats(),
      getProductStats(),
      getReviewStats(),
    ]);

    return {
      totalCustomers: customerStats.total,
      activeWarranties: customerStats.activeWarranty,
      expiringSoon: customerStats.expiringSoon,
      totalProducts: productStats.total,
      publishedProducts: productStats.published,
      newStock: productStats.newArrivals,
      limitedStock: productStats.limitedStock,
      totalReviews: reviewStats.total,
      pendingReviews: reviewStats.pending,
      averageRating: reviewStats.averageRating,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

export const getRecentActivity = async (): Promise<any[]> => {
  try {
    // Mock activity data (replace with actual activity log from Firestore)
    return [
      {
        action: 'New Customer Added',
        details: 'John Doe purchased HP Pavilion',
        time: '2 minutes ago',
        actionType: 'customer',
      },
      {
        action: 'Product Review',
        details: 'Sarah rated Dell XPS 15 - 5 stars',
        time: '15 minutes ago',
        actionType: 'review',
      },
      {
        action: 'Warranty Expiring',
        details: "Mike Johnson's laptop warranty ends in 3 days",
        time: '1 hour ago',
        actionType: 'view',
      },
      {
        action: 'Product Updated',
        details: 'Lenovo ThinkPad stock updated to 8 units',
        time: '2 hours ago',
        actionType: 'view',
      },
    ];
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};