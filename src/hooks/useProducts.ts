import { useEffect, useState } from 'react';
import { useProductStore } from '../store/productStore';
import { getAllProducts, getPublishedProducts } from '../services/productService';
import { Product } from '../types';

export const useProducts = (publishedOnly: boolean = false) => {
  const { products, setProducts, loading, setLoading } = useProductStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [publishedOnly]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = publishedOnly
        ? await getPublishedProducts()
        : await getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: loadProducts,
  };
};