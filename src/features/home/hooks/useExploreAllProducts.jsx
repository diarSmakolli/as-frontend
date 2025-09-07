import { useState, useEffect, useCallback } from 'react';
import { homeService } from '../services/homeService';

export const useExploreAllProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [filters, setFilters] = useState({
    limit: 30,
    offset: 0,
    search: "",
    category_id: "",
    company_id: "",
    min_price: "",
    max_price: "",
    sort_by: "created_at",
    sort_order: "DESC",
    is_on_sale: "",
    free_shipping: "",
    is_featured: "",
    is_new: "",
    ...initialFilters
  });

  const fetchProducts = useCallback(async (reset = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const params = {
        ...filters,
        offset: currentOffset
      };

      const response = await homeService.getExploreAllProducts(params);
      
      if (response.status === 'success') {
        const newProducts = response.data.products;
        const pagination = response.data.pagination;

        setProducts(prevProducts => {
          if (reset) {
            return newProducts;
          } else {
            // Avoid duplicates by filtering out products that already exist
            const existingIds = new Set(prevProducts.map(p => p.id));
            const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
            return [...prevProducts, ...uniqueNewProducts];
          }
        });
        
        setHasMore(pagination.has_more);
        setTotalCount(pagination.total_count);
        setIsInitialLoad(false);

        // Update offset for next load
        if (!reset && pagination.has_more) {
          setOffset(pagination.next_offset);
        }
      }
    } catch (err) {
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [filters, offset, loading]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !isInitialLoad) {
      fetchProducts(false);
    }
  }, [hasMore, loading, isInitialLoad, fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setOffset(0);
    setProducts([]);
    setHasMore(true);
    setIsInitialLoad(true);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      limit: 30,
      offset: 0,
      search: "",
      category_id: "",
      company_id: "",
      min_price: "",
      max_price: "",
      sort_by: "created_at",
      sort_order: "DESC",
      is_on_sale: "",
      free_shipping: "",
      is_featured: "",
      is_new: "",
    });
    setOffset(0);
    setProducts([]);
    setHasMore(true);
    setIsInitialLoad(true);
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchProducts(true);
  }, [filters.search, filters.category_id, filters.company_id, filters.min_price, filters.max_price, filters.sort_by, filters.sort_order, filters.is_on_sale, filters.free_shipping, filters.is_featured, filters.is_new]);

  return {
    products,
    loading,
    error,
    hasMore,
    totalCount,
    filters,
    loadMore,
    updateFilters,
    resetFilters,
    refetch: () => fetchProducts(true)
  };
};