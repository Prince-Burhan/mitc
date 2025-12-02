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
import { Product, ProductFilters, ProductStats } from '../types';

const PRODUCTS_COLLECTION = 'products';
const MAX_PRODUCTS = 80;

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

export const getPublishedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting published products:', error);
    throw error;
  }
};

export const getProducts = async (
  filters: ProductFilters = {},
  pageSize: number = 50
): Promise<{ products: Product[] }> => {
  try {
    let q = query(collection(db, PRODUCTS_COLLECTION));

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters.published !== undefined) {
      q = query(q, where('published', '==', filters.published));
    }

    if (filters.brand) {
      q = query(q, where('brand', '==', filters.brand));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];

    return { products };
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Product not found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
    } as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const getProductStats = async (): Promise<ProductStats> => {
  try {
    const products = await getAllProducts();

    const stats: ProductStats = {
      total: products.length,
      published: products.filter((p) => p.published).length,
      unpublished: products.filter((p) => !p.published).length,
      inStock: products.filter((p) => p.stockCount > 0).length,
      outOfStock: products.filter((p) => p.stockCount === 0).length,
      newArrivals: products.filter((p) => p.isNewArrival).length,
      deals: products.filter((p) => p.isDeal).length,
      limitedStock: products.filter((p) => p.isLimitedStock).length,
      topHighlights: products.filter((p) => p.isTopHighlight).length,
      bottomHighlights: products.filter((p) => p.isBottomHighlight).length,
    };

    return stats;
  } catch (error) {
    console.error('Error getting product stats:', error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    // Check 80 product limit
    const allProducts = await getAllProducts();
    if (allProducts.length >= MAX_PRODUCTS) {
      throw new Error(`Maximum of ${MAX_PRODUCTS} products reached. Please delete some products first.`);
    }

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Failed to create product');
  }
};

export const duplicateProduct = async (id: string): Promise<string> => {
  try {
    // Check 80 product limit
    const allProducts = await getAllProducts();
    if (allProducts.length >= MAX_PRODUCTS) {
      throw new Error(`Maximum of ${MAX_PRODUCTS} products reached. Cannot duplicate product.`);
    }

    const product = await getProductById(id);
    
    // Create duplicate with modified fields
    const duplicateData: any = {
      ...product,
      title: `${product.title} (Copy)`,
      slug: `${product.slug}-copy-${Date.now()}`,
      published: false, // Duplicates start as unpublished
    };

    // Remove fields that shouldn't be duplicated
    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    const newId = await createProduct(duplicateData);
    return newId;
  } catch (error: any) {
    console.error('Error duplicating product:', error);
    throw new Error(error.message || 'Failed to duplicate product');
  }
};

export const updateProduct = async (
  id: string,
  updates: Partial<Product>
): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const togglePublished = async (id: string): Promise<void> => {
  try {
    const product = await getProductById(id);
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      published: !product.published,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error toggling published:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const bulkDeleteProducts = async (ids: string[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      batch.delete(doc(db, PRODUCTS_COLLECTION, id));
    });
    await batch.commit();
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    throw error;
  }
};

export const exportProductsData = async (): Promise<Product[]> => {
  try {
    return await getAllProducts();
  } catch (error) {
    console.error('Error exporting products:', error);
    throw error;
  }
};