import { Link } from 'react-router-dom';
import { Package, AlertCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'highlight';
}

const ProductCard = ({ product, variant = 'default' }: ProductCardProps) => {
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;
  const isOutOfStock = product.stockCount === 0;

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'Premium':
        return 'purple';
      case 'Standard':
        return 'info';
      case 'Basic':
        return 'default';
      default:
        return 'default';
    }
  };

  if (variant === 'highlight') {
    return (
      <Link
        to={`/products/${product.slug || product.id}`}
        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      >
        <img
          src={product.featuredImage || product.galleryImages?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {product.shortSlogan || product.brand}
          </p>
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/products/${product.slug || product.id}`}
        className="group block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={product.featuredImage || product.galleryImages?.[0] || '/placeholder.jpg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNewArrival && (
            <Badge
              variant="success"
              className="absolute top-2 left-2"
            >
              New
            </Badge>
          )}
          {product.isDeal && (
            <Badge
              variant="danger"
              className="absolute top-2 right-2"
            >
              Deal
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <Badge variant={getCategoryBadgeVariant(product.category)} size="sm" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {product.shortSlogan || `${product.brand} ${product.model}`}
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ₹{product.price.toLocaleString()}
            </p>
            {isLowStock && !isOutOfStock && (
              <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {product.stockCount} left
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${product.slug || product.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={product.featuredImage || product.galleryImages?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <Badge variant="success" className="shadow-lg">New Arrival</Badge>
          )}
          {product.isDeal && (
            <Badge variant="danger" className="shadow-lg">Special Deal</Badge>
          )}
          {product.isLimitedStock && (
            <Badge variant="warning" className="shadow-lg">Limited Stock</Badge>
          )}
        </div>

        <Badge
          variant={getCategoryBadgeVariant(product.category)}
          className="absolute top-3 right-3 shadow-lg"
        >
          {product.category}
        </Badge>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Package className="h-12 w-12 text-white mx-auto mb-2" />
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.brand}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
          {product.shortSlogan || product.description}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.ram && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {product.ram}
            </span>
          )}
          {product.cpu && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded line-clamp-1">
              {product.cpu}
            </span>
          )}
          {product.storage && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {product.storage}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ₹{product.price.toLocaleString()}
            </p>
            {product.condition !== 'New' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {product.condition}
              </p>
            )}
          </div>
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{product.stockCount} left</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;