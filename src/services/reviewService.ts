import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { StoreReview, ReviewFilters, ReviewStats } from '../types';

const REVIEWS_COLLECTION = 'reviews';

export const getReviews = async (
  filters: ReviewFilters = {},
  pageSize: number = 50
): Promise<{ reviews: StoreReview[] }> => {
  try {
    let q = query(collection(db, REVIEWS_COLLECTION));

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.rating) {
      q = query(q, where('rating', '==', filters.rating));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      purchaseDate: doc.data().purchaseDate?.toDate(),
      adminReplyDate: doc.data().adminReplyDate?.toDate(),
    })) as StoreReview[];

    return { reviews };
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const getReviewById = async (id: string): Promise<StoreReview> => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Review not found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      purchaseDate: docSnap.data().purchaseDate?.toDate(),
      adminReplyDate: docSnap.data().adminReplyDate?.toDate(),
    } as StoreReview;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  try {
    const snapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
    const reviews = snapshot.docs.map((doc) => doc.data());

    const stats: ReviewStats = {
      total: reviews.length,
      pending: reviews.filter((r) => r.status === 'Pending').length,
      approved: reviews.filter((r) => r.status === 'Approved').length,
      rejected: reviews.filter((r) => r.status === 'Rejected').length,
      averageRating:
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length || 0,
      ratingDistribution: {
        1: reviews.filter((r) => r.rating === 1).length,
        2: reviews.filter((r) => r.rating === 2).length,
        3: reviews.filter((r) => r.rating === 3).length,
        4: reviews.filter((r) => r.rating === 4).length,
        5: reviews.filter((r) => r.rating === 5).length,
      },
    };

    return stats;
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw error;
  }
};

export const createReview = async (review: Omit<StoreReview, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...review,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const approveReview = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, {
      status: 'Approved',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

export const rejectReview = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, {
      status: 'Rejected',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    throw error;
  }
};

export const replyToReview = async (id: string, reply: string): Promise<void> => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, {
      adminReply: reply,
      adminReplyDate: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};

export const toggleFeaturedReview = async (id: string): Promise<void> => {
  try {
    const review = await getReviewById(id);
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, {
      featured: !review.featured,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error toggling featured review:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const exportReviewsData = async (): Promise<StoreReview[]> => {
  try {
    const { reviews } = await getReviews({}, 1000);
    return reviews;
  } catch (error) {
    console.error('Error exporting reviews:', error);
    throw error;
  }
};
