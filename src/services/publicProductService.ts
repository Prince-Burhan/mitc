import { collection, query, where, getDocs, doc, getDoc, limit, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

const convertTimestamps = (data: any): any => {
  const converted = { ...data };
  if (data.createdAt?.toDate) {
    converted.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt?.toDate) {
    converted.updatedAt = data.updatedAt.toDate();
  }
  return converted;
};

export const getPublishedProducts = async (filters?: {
  category?: string;
  brand?: string;
  searchQuery?: string;
  isNewArrival?: boolean;
  isDeal?: boolean;
  isLimitedStock?: boolean;
  tags?: string[];
  priceRange?: [number, number];
}): Promise<Product[]> => {
  try {
    console.log('Fetching published products...');
    let q = query(
      collection(db, 'products'),
      where('published', '==', true)
    );

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.brand) {
      q = query(q, where('brand', '==', filters.brand));
    }

    if (filters?.isNewArrival !== undefined) {
      q = query(q, where('isNewArrival', '==', filters.isNewArrival));
    }

    if (filters?.isDeal !== undefined) {
      q = query(q, where('isDeal', '==', filters.isDeal));
    }

    if (filters?.isLimitedStock !== undefined) {
      q = query(q, where('isLimitedStock', '==', filters.isLimitedStock));
    }

    const snapshot = await getDocs(q);
    console.log(`Found ${snapshot.docs.length} published products`);
    
    let products = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];

    console.log('Products:', products);

    // Client-side filters
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.model?.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      products = products.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters?.tags && filters.tags.length > 0) {
      products = products.filter((p) =>
        filters.tags!.some((tag) => p.tags?.includes(tag))
      );
    }

    return products;
  } catch (error) {
    console.error('Error getting published products:', error);
    throw new Error('Failed to load products');
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('slug', '==', slug),
      where('published', '==', true),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...convertTimestamps(snapshot.docs[0].data()),
    } as Product;
  } catch (error) {
    console.error('Error getting product by slug:', error);
    return null;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const product = { 
      id: docSnap.id, 
      ...convertTimestamps(docSnap.data())
    } as Product;

    if (!product.published) {
      return null;
    }

    return product;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};

export const getTopHighlights = async (maxCount: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('isTopHighlight', '==', true),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];
  } catch (error) {
    console.error('Error getting top highlights:', error);
    return [];
  }
};

export const getBottomHighlights = async (maxCount: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('isBottomHighlight', '==', true),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];
  } catch (error) {
    console.error('Error getting bottom highlights:', error);
    return [];
  }
};

export const getDeals = async (maxCount: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('isDeal', '==', true),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];
  } catch (error) {
    console.error('Error getting deals:', error);
    return [];
  }
};

export const getNewArrivals = async (maxCount: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('isNewArrival', '==', true),
      orderBy('createdAt', 'desc'),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    return [];
  }
};

export const getLimitedStock = async (maxCount: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('isLimitedStock', '==', true),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];
  } catch (error) {
    console.error('Error getting limited stock:', error);
    return [];
  }
};

export const getProductsByCategory = async (
  category: 'Premium' | 'Standard' | 'Basic',
  maxCount: number = 10
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('category', '==', category),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Product[];
  } catch (error) {
    console.error(`Error getting ${category} products:`, error);
    return [];
  }
};

export const getRelatedProducts = async (
  productId: string,
  brand: string,
  category: string,
  maxCount: number = 8
): Promise<Product[]> => {
  try {
    // Try to get products from same brand first
    let q = query(
      collection(db, 'products'),
      where('published', '==', true),
      where('brand', '==', brand),
      limit(maxCount)
    );

    let snapshot = await getDocs(q);
    let products = snapshot.docs
      .map((docSnap) => ({ 
        id: docSnap.id, 
        ...convertTimestamps(docSnap.data())
      }) as Product)
      .filter((p) => p.id !== productId);

    // If not enough, get from same category
    if (products.length < 4) {
      q = query(
        collection(db, 'products'),
        where('published', '==', true),
        where('category', '==', category),
        limit(maxCount)
      );

      snapshot = await getDocs(q);
      const categoryProducts = snapshot.docs
        .map((docSnap) => ({ 
          id: docSnap.id, 
          ...convertTimestamps(docSnap.data())
        }) as Product)
        .filter((p) => p.id !== productId && !products.find((pr) => pr.id === p.id));

      products = [...products, ...categoryProducts].slice(0, maxCount);
    }

    return products;
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
};

export const getAllBrands = async (): Promise<string[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'products'), where('published', '==', true))
    );
    const brands = new Set<string>();
    snapshot.docs.forEach((docSnap) => {
      const product = docSnap.data() as Product;
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort();
  } catch (error) {
    console.error('Error getting brands:', error);
    return [];
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'products'), where('published', '==', true))
    );
    const tags = new Set<string>();
    snapshot.docs.forEach((docSnap) => {
      const product = docSnap.data() as Product;
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
};
