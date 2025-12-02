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
  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Customer } from '../types';
import { convertFirestoreCustomer } from '../types/firestore';

const COLLECTION_NAME = 'customers';

export interface CustomerFilters {
  status?: string;
  searchQuery?: string;
  warrantyStatus?: 'active' | 'expiringSoon' | 'expired';
  productId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CustomerStats {
  total: number;
  activeWarranty: number;
  expiredWarranty: number;
  expiringSoon: number; // Within 30 days
  reviewRequested: number;
  completed: number;
}

// Get all customers with optional filters and pagination
export const getCustomers = async (
  filters?: CustomerFilters,
  pageSize: number = 50,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ customers: Customer[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    let q = query(collection(db, COLLECTION_NAME));

    // Apply filters
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.productId) {
      q = query(q, where('productId', '==', filters.productId));
    }

    if (filters?.dateFrom) {
      q = query(q, where('purchaseDate', '>=', Timestamp.fromDate(filters.dateFrom)));
    }

    if (filters?.dateTo) {
      q = query(q, where('purchaseDate', '<=', Timestamp.fromDate(filters.dateTo)));
    }

    // Warranty status filter
    if (filters?.warrantyStatus) {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (filters.warrantyStatus === 'active') {
        q = query(q, where('warrantyEndDate', '>', Timestamp.fromDate(now)));
      } else if (filters.warrantyStatus === 'expired') {
        q = query(q, where('warrantyEndDate', '<=', Timestamp.fromDate(now)));
      } else if (filters.warrantyStatus === 'expiringSoon') {
        q = query(
          q,
          where('warrantyEndDate', '>', Timestamp.fromDate(now)),
          where('warrantyEndDate', '<=', Timestamp.fromDate(thirtyDaysFromNow))
        );
      }
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));

    // Pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize));

    const snapshot = await getDocs(q);
    const customers = snapshot.docs.map((doc) =>
      convertFirestoreCustomer({ id: doc.id, ...doc.data() })
    );

    // Client-side search filter (since Firestore doesn't support text search)
    let filteredCustomers = customers;
    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filteredCustomers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(searchLower) ||
          c.productName?.toLowerCase().includes(searchLower)
      );
    }

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { customers: filteredCustomers, lastDoc: newLastDoc };
  } catch (error: any) {
    console.error('Error getting customers:', error);
    throw new Error(error.message || 'Failed to get customers');
  }
};

// Get customer by ID
export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Customer not found');
    }

    return convertFirestoreCustomer({ id: docSnap.id, ...docSnap.data() });
  } catch (error: any) {
    console.error('Error getting customer:', error);
    throw new Error(error.message || 'Failed to get customer');
  }
};

// Create new customer
export const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
  try {
    const newCustomer = {
      ...customerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newCustomer);
    return convertFirestoreCustomer({ id: docRef.id, ...newCustomer });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    throw new Error(error.message || 'Failed to create customer');
  }
};

// Update customer
export const updateCustomer = async (
  id: string,
  updates: Partial<Omit<Customer, 'id' | 'createdAt'>>
): Promise<Customer> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
    return await getCustomerById(id);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    throw new Error(error.message || 'Failed to update customer');
  }
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    throw new Error(error.message || 'Failed to delete customer');
  }
};

// Bulk delete customers
export const bulkDeleteCustomers = async (ids: string[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      batch.delete(doc(db, COLLECTION_NAME, id));
    });
    await batch.commit();
  } catch (error: any) {
    console.error('Error bulk deleting customers:', error);
    throw new Error(error.message || 'Failed to delete customers');
  }
};

// Get customer statistics
export const getCustomerStats = async (): Promise<CustomerStats> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const customers = snapshot.docs.map((doc) =>
      convertFirestoreCustomer({ id: doc.id, ...doc.data() })
    );

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const stats: CustomerStats = {
      total: customers.length,
      activeWarranty: customers.filter((c) => c.warrantyEndDate > now).length,
      expiredWarranty: customers.filter((c) => c.warrantyEndDate <= now).length,
      expiringSoon: customers.filter(
        (c) => c.warrantyEndDate > now && c.warrantyEndDate <= thirtyDaysFromNow
      ).length,
      reviewRequested: customers.filter((c) => c.status === 'Review Requested').length,
      completed: customers.filter((c) => c.status === 'Completed').length,
    };

    return stats;
  } catch (error: any) {
    console.error('Error getting customer stats:', error);
    throw new Error(error.message || 'Failed to get customer stats');
  }
};

// Send warranty reminder (update status)
export const sendWarrantyReminder = async (customerId: string): Promise<Customer> => {
  try {
    return await updateCustomer(customerId, {
      reminderSent: true,
      lastReminderDate: new Date(),
    });
  } catch (error: any) {
    console.error('Error sending warranty reminder:', error);
    throw new Error(error.message || 'Failed to send warranty reminder');
  }
};

// Request review from customer
export const requestReview = async (customerId: string): Promise<Customer> => {
  try {
    return await updateCustomer(customerId, {
      status: 'Review Requested',
      reviewRequestDate: new Date(),
    });
  } catch (error: any) {
    console.error('Error requesting review:', error);
    throw new Error(error.message || 'Failed to request review');
  }
};

// Export customers data (for CSV/Excel)
export const exportCustomersData = async (): Promise<Customer[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    );
    return snapshot.docs.map((doc) => convertFirestoreCustomer({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error('Error exporting customers:', error);
    throw new Error(error.message || 'Failed to export customers');
  }
};
