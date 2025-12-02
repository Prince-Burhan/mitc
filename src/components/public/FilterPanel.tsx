import { X } from 'lucide-react';
import Button from '../ui/Button';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterPanelProps {
  brands: FilterOption[];
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  
  categories: FilterOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  
  conditions: FilterOption[];
  selectedConditions: string[];
  onConditionChange: (conditions: string[]) => void;
  
  tags: FilterOption[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  
  flags: { label: string; key: string; checked: boolean }[];
  onFlagChange: (key: string, checked: boolean) => void;
  
  onClearAll: () => void;
}

const FilterPanel = ({
  brands,
  selectedBrands,
  onBrandChange,
  categories,
  selectedCategory,
  onCategoryChange,
  conditions,
  selectedConditions,
  onConditionChange,
  tags,
  selectedTags,
  onTagChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  flags,
  onFlagChange,
  onClearAll,
}: FilterPanelProps) => {
  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const handleConditionToggle = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionChange([...selectedConditions, condition]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategory !== '' ||
    selectedConditions.length > 0 ||
    selectedTags.length > 0 ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    flags.some((f) => f.checked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} leftIcon={<X className="h-4 w-4" />}>
            Clear All
          </Button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                checked={selectedCategory === category.value}
                onChange={() => onCategoryChange(category.value)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {category.label}
                {category.count !== undefined && (
                  <span className="text-gray-500 ml-1">({category.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Brand</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.value)}
                  onChange={() => handleBrandToggle(brand.value)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {brand.label}
                  {brand.count !== undefined && (
                    <span className="text-gray-500 ml-1">({brand.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
              min={minPrice}
              max={priceRange[1]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
              min={priceRange[0]}
              max={maxPrice}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹{minPrice.toLocaleString()}</span>
            <span>₹{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Condition */}
      {conditions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Condition</h4>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label key={condition.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition.value)}
                  onChange={() => handleConditionToggle(condition.value)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {condition.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      {flags.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Special</h4>
          <div className="space-y-2">
            {flags.map((flag) => (
              <label key={flag.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={flag.checked}
                  onChange={(e) => onFlagChange(flag.key, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => handleTagToggle(tag.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedTags.includes(tag.value)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;