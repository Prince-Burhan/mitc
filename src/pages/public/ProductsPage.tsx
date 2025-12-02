import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, X, PackageX } from 'lucide-react';
import ProductCard from '../../components/public/ProductCard';
import FilterPanel from '../../components/public/FilterPanel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { getPublishedProducts, getAllBrands, getAllTags } from '../../services/publicProductService';
import { Product } from '../../types';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [flags, setFlags] = useState([
    { label: 'New Arrivals', key: 'isNewArrival', checked: false },
    { label: 'Deals', key: 'isDeal', checked: false },
    { label: 'Limited Stock', key: 'isLimitedStock', checked: false },
  ]);

  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    loadData();
    loadFiltersFromURL();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    products,
    selectedBrands,
    selectedCategory,
    selectedConditions,
    selectedTags,
    priceRange,
    flags,
    sortBy,
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, brandsData, tagsData] = await Promise.all([
        getPublishedProducts(),
        getAllBrands(),
        getAllTags(),
      ]);

      setProducts(productsData);
      setBrands(brandsData);
      setTags(tagsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadFiltersFromURL = () => {
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');

    if (category) setSelectedCategory(category);
    if (filter === 'new') setFlags((prev) => prev.map((f) => (f.key === 'isNewArrival' ? { ...f, checked: true } : f)));
    if (filter === 'deals') setFlags((prev) => prev.map((f) => (f.key === 'isDeal' ? { ...f, checked: true } : f)));
    if (filter === 'limited') setFlags((prev) => prev.map((f) => (f.key === 'isLimitedStock' ? { ...f, checked: true } : f)));
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter((p) => selectedConditions.includes(p.condition));
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) => selectedTags.some((tag) => p.tags.includes(tag)));
    }

    // Price range filter
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Flags filter
    flags.forEach((flag) => {
      if (flag.checked) {
        filtered = filtered.filter((p) => p[flag.key as keyof Product] === true);
      }
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Featured - no sorting
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedCategory('');
    setSelectedConditions([]);
    setSelectedTags([]);
    setPriceRange([0, 200000]);
    setFlags((prev) => prev.map((f) => ({ ...f, checked: false })));
    setSearchParams({});
  };

  const minPrice = Math.min(...products.map((p) => p.price), 0);
  const maxPrice = Math.max(...products.map((p) => p.price), 200000);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading products..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">All Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* View Mode */}
          <div className="hidden md:flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="md:hidden"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Panel */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <FilterPanel
              brands={brands.map((b) => ({ value: b, label: b }))}
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
              categories={[
                { value: 'Premium', label: 'Premium' },
                { value: 'Standard', label: 'Standard' },
                { value: 'Basic', label: 'Basic' },
              ]}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              conditions={[
                { value: 'New', label: 'New' },
                { value: 'Like New', label: 'Like New' },
                { value: 'Used', label: 'Used' },
                { value: 'Refurbished', label: 'Refurbished' },
              ]}
              selectedConditions={selectedConditions}
              onConditionChange={setSelectedConditions}
              tags={tags.map((t) => ({ value: t, label: t }))}
              selectedTags={selectedTags}
              onTagChange={setSelectedTags}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              flags={flags}
              onFlagChange={(key, checked) =>
                setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, checked } : f)))
              }
              onClearAll={handleClearAll}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title="No products found"
              description="Try adjusting your filters or search criteria to find what you're looking for."
              action={{
                label: 'Clear All Filters',
                onClick: handleClearAll,
              }}
            />
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <FilterPanel
                brands={brands.map((b) => ({ value: b, label: b }))}
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
                categories={[
                  { value: 'Premium', label: 'Premium' },
                  { value: 'Standard', label: 'Standard' },
                  { value: 'Basic', label: 'Basic' },
                ]}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                conditions={[
                  { value: 'New', label: 'New' },
                  { value: 'Like New', label: 'Like New' },
                  { value: 'Used', label: 'Used' },
                  { value: 'Refurbished', label: 'Refurbished' },
                ]}
                selectedConditions={selectedConditions}
                onConditionChange={setSelectedConditions}
                tags={tags.map((t) => ({ value: t, label: t }))}
                selectedTags={selectedTags}
                onTagChange={setSelectedTags}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                flags={flags}
                onFlagChange={(key, checked) =>
                  setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, checked } : f)))
                }
                onClearAll={handleClearAll}
              />
              <Button
                variant="primary"
                fullWidth
                className="mt-6"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
