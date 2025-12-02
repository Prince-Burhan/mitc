import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SearchFilters, ProductCategory } from '../../types';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants';
import { getAllProducts } from '../../services/productService';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const products = await getAllProducts();
      const uniqueBrands = [...new Set(products.map((p) => p.brand))];
      const uniqueTags = [...new Set(products.flatMap((p) => p.tags))];
      setBrands(uniqueBrands.sort());
      setTags(uniqueTags.sort());
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const handleBrandToggle = (brand: string) => {
    const current = filters.brand || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFilterChange({ ...filters, brand: updated });
  };

  const handleCategoryToggle = (category: ProductCategory) => {
    const current = filters.category || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFilterChange({ ...filters, category: updated });
  };

  const handleConditionToggle = (condition: string) => {
    const current = filters.condition || [];
    const updated = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current, condition];
    onFilterChange({ ...filters, condition: updated });
  };

  const clearFilters = () => {
    onFilterChange({
      query: '',
      brand: [],
      category: [],
      condition: [],
      tags: [],
      published: true,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Brands */}
        {brands.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand) || false}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {['Premium', 'Standard', 'Basic'].map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    filters.category?.includes(category as ProductCategory) || false
                  }
                  onChange={() => handleCategoryToggle(category as ProductCategory)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Condition</h3>
          <div className="space-y-2">
            {PRODUCT_CONDITIONS.map((condition) => (
              <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.condition?.includes(condition) || false}
                  onChange={() => handleConditionToggle(condition)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Special</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isNewArrival || false}
                onChange={(e) =>
                  onFilterChange({ ...filters, isNewArrival: e.target.checked })
                }
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">New Arrivals</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isLimitedStock || false}
                onChange={(e) =>
                  onFilterChange({ ...filters, isLimitedStock: e.target.checked })
                }
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Limited Stock</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isDeal || false}
                onChange={(e) =>
                  onFilterChange({ ...filters, isDeal: e.target.checked })
                }
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Deals</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;