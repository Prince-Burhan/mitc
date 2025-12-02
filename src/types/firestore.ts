import { Timestamp } from 'firebase/firestore';
import {
  Product,
  Customer,
  StoreReview,
  User,
} from './index';

// Firestore document types (with Timestamp instead of Date)
export type FirestoreProduct = Omit<Product, 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type FirestoreCustomer = Omit<
  Customer,
  'purchaseDate' | 'warrantyEndDate' | 'createdAt' | 'updatedAt'
> & {
  purchaseDate: Timestamp;
  warrantyEndDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type FirestoreStoreReview = Omit<StoreReview, 'createdAt'> & {
  createdAt: Timestamp;
};

export type FirestoreUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Helper functions to safely convert between Firestore and app types
export const convertTimestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
};

export const convertFirestoreProduct = (doc: any): Product => ({
  ...doc,
  createdAt: convertTimestampToDate(doc.createdAt),
  updatedAt: convertTimestampToDate(doc.updatedAt),
});

export const convertFirestoreCustomer = (doc: any): Customer => ({
  ...doc,
  purchaseDate: convertTimestampToDate(doc.purchaseDate),
  warrantyEndDate: convertTimestampToDate(doc.warrantyEndDate),
  createdAt: convertTimestampToDate(doc.createdAt),
  updatedAt: convertTimestampToDate(doc.updatedAt),
});

export const convertFirestoreReview = (doc: any): StoreReview => ({
  ...doc,
  createdAt: convertTimestampToDate(doc.createdAt),
});

export const convertFirestoreUser = (doc: any): User => ({
  ...doc,
  createdAt: convertTimestampToDate(doc.createdAt),
  updatedAt: convertTimestampToDate(doc.updatedAt),
});