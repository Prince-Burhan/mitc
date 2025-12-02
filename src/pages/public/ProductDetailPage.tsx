import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ImageGallery from '../../components/public/ImageGallery';
import ProductCard from '../../components/public/ProductCard';
import ContactModal from '../../components/public/ContactModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Product } from '../../types';
import { getProductBySlug, getProductById, getRelatedProducts } from '../../services/publicProductService';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  const loadProduct = async (slugOrId: string) => {
    try {
      setLoading(true);
      
      // Try slug first, then ID
      let productData = await getProductBySlug(slugOrId);
      if (!productData) {
        productData = await getProductById(slugOrId);
      }

      if (!productData) {
        toast.error('Product not found');
        return;
      }

      setProduct(productData);

      // Load related products
      const related = await getRelatedProducts(
        productData.id,
        productData.brand,
        productData.category,
        8
      );
      setRelatedProducts(related);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products">
          <Button variant="primary">Browse All Products</Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockCount === 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Products', path: '/products' },
            { label: product.brand, path: `/products?brand=${product.brand}` },
            { label: product.title },
          ]}
        />
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <ImageGallery
            images={product.galleryImages?.length > 0 ? product.galleryImages : [product.featuredImage || product.images?.[0] || '/placeholder.jpg']}
            alt={product.title}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{product.category}</Badge>
            {product.isNewArrival && <Badge variant="success">New Arrival</Badge>}
            {product.isDeal && <Badge variant="danger">Special Deal</Badge>}
            {product.isLimitedStock && <Badge variant="warning">Limited Stock</Badge>}
            {product.condition !== 'New' && <Badge variant="secondary">{product.condition}</Badge>}
          </div>

          {/* Title & Brand */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {product.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{product.brand}</p>
          </div>

          {/* Short Slogan */}
          {product.shortSlogan && (
            <p className="text-lg text-gray-700 dark:text-gray-300 border-l-4 border-primary-500 pl-4">
              {product.shortSlogan}
            </p>
          )}

          {/* Price */}
          <div className="py-4 border-y border-gray-200 dark:border-gray-700">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-600">Out of Stock</span>
              </>
            ) : isLowStock ? (
              <>
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-600">
                  Only {product.stockCount} left in stock
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-600">In Stock</span>
              </>
            )}
          </div>

          {/* Contact CTA */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<MessageCircle />}
            onClick={() => setIsContactModalOpen(true)}
          >
            Contact Store
          </Button>

          {/* Quick Specs */}
          {(product.ram || product.cpu || product.storage) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {product.ram && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">RAM</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{product.ram}</p>
                </div>
              )}
              {product.cpu && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Processor</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{product.cpu}</p>
                </div>
              )}
              {product.storage && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Storage</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{product.storage}</p>
                </div>
              )}
              {product.gpu && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graphics</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{product.gpu}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Specifications</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-1/3">
                  Model
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.model}</td>
              </tr>
              {product.ram && (
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">RAM</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.ram}</td>
                </tr>
              )}
              {product.cpu && (
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Processor
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.cpu}</td>
                </tr>
              )}
              {product.gpu && (
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Graphics
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.gpu}</td>
                </tr>
              )}
              {product.storage && (
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Storage
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.storage}</td>
                </tr>
              )}
              {product.color && (
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Color
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.color}</td>
                </tr>
              )}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Condition
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.condition}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Stock
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {product.stockCount} units available
                </td>
              </tr>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Description */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Description</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        productTitle={product.title}
        productUrl={window.location.href}
      />
    </div>
  );
};

export default ProductDetailPage;