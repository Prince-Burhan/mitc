import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/public/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import {
  getTopHighlights,
  getBottomHighlights,
  getDeals,
  getNewArrivals,
  getLimitedStock,
  getProductsByCategory,
} from '../../services/publicProductService';
import { Product } from '../../types';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);

  const [sections, setSections] = useState({
    topHighlights: [] as Product[],
    deals: [] as Product[],
    newArrivals: [] as Product[],
    limitedStock: [] as Product[],
    premium: [] as Product[],
    standard: [] as Product[],
    basic: [] as Product[],
    bottomHighlights: [] as Product[],
  });

  useEffect(() => {
    loadAllSections();
  }, []);

  // Auto-slide for top highlights
  useEffect(() => {
    if (sections.topHighlights.length > 1) {
      const interval = setInterval(() => {
        setCurrentHighlightIndex((prev) =>
          prev === sections.topHighlights.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sections.topHighlights]);

  // Auto-slide for deals
  useEffect(() => {
    if (sections.deals.length > 1) {
      const interval = setInterval(() => {
        setCurrentDealIndex((prev) =>
          prev === sections.deals.length - 1 ? 0 : prev + 1
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [sections.deals]);

  const loadAllSections = async () => {
    try {
      setLoading(true);

      const [topHighlights, deals, newArrivals, limitedStock, premium, standard, basic, bottomHighlights] =
        await Promise.all([
          getTopHighlights(10),
          getDeals(10),
          getNewArrivals(10),
          getLimitedStock(10),
          getProductsByCategory('Premium', 10),
          getProductsByCategory('Standard', 10),
          getProductsByCategory('Basic', 10),
          getBottomHighlights(10),
        ]);

      setSections({
        topHighlights,
        deals,
        newArrivals,
        limitedStock,
        premium,
        standard,
        basic,
        bottomHighlights,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading store..." />;
  }

  return (
    <div className="space-y-0">
      {/* 1. TOP HIGHLIGHT BAR (Auto Slider) */}
      {sections.topHighlights.length > 0 && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentHighlightIndex * 100}%)` }}
              >
                {sections.topHighlights.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug || product.id}`}
                    className="min-w-full flex items-center justify-center gap-4 hover:opacity-90 transition-opacity"
                  >
                    <Sparkles className="h-5 w-5 flex-shrink-0" />
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{product.title}</span>
                      <span className="text-primary-100">•</span>
                      <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
            {/* Dots */}
            {sections.topHighlights.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {sections.topHighlights.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHighlightIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentHighlightIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                    aria-label={`Go to highlight ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DEALS FULL-WIDTH BANNER SLIDER */}
      {sections.deals.length > 0 && (
        <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
          {sections.deals.map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentDealIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${product.featuredImage || product.images?.[0]})`,
                  filter: 'brightness(0.4)',
                }}
              />
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white space-y-6">
                  <div className="inline-block px-4 py-2 bg-red-600 rounded-full text-sm font-semibold">
                    🔥 Special Deal
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    {product.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200">
                    {product.shortSlogan || `${product.brand} ${product.model}`}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-6xl font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>
                  <Link to={`/products/${product.slug || product.id}`}>
                    <Button variant="primary" size="lg" rightIcon={<ChevronRight />}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          {sections.deals.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {sections.deals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealIndex(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentDealIndex ? 'w-8 bg-white' : 'w-3 bg-white/50'
                  }`}
                  aria-label={`Go to deal ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* 3. NEW ARRIVALS SECTION */}
        {sections.newArrivals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    New Arrivals
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Check out our latest laptops
                  </p>
                </div>
              </div>
              <Link to="/products?filter=new">
                <Button variant="outline" rightIcon={<ChevronRight />}>
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* 4. LIMITED STOCK SECTION */}
        {sections.limitedStock.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Limited Stock
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Hurry! Only a few left in stock
                  </p>
                </div>
              </div>
              <Link to="/products?filter=limited">
                <Button variant="outline" rightIcon={<ChevronRight />}>
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sections.limitedStock.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* 5. PREMIUM / STANDARD / BASIC SECTION */}
        {(sections.premium.length > 0 || sections.standard.length > 0 || sections.basic.length > 0) && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Explore by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find the perfect laptop that matches your needs and budget
              </p>
            </div>

            <div className="space-y-12">
              {/* Premium */}
              {sections.premium.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Premium Laptops
                    </h3>
                    <Link to="/products?category=Premium">
                      <Button variant="ghost" size="sm" rightIcon={<ChevronRight />}>
                        View All Premium
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.premium.slice(0, 6).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Standard */}
              {sections.standard.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Standard Laptops
                    </h3>
                    <Link to="/products?category=Standard">
                      <Button variant="ghost" size="sm" rightIcon={<ChevronRight />}>
                        View All Standard
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.standard.slice(0, 6).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic */}
              {sections.basic.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Basic Laptops
                    </h3>
                    <Link to="/products?category=Basic">
                      <Button variant="ghost" size="sm" rightIcon={<ChevronRight />}>
                        View All Basic
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.basic.slice(0, 6).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* 6. BOTTOM HIGHLIGHT BAR */}
      {sections.bottomHighlights.length > 0 && (
        <div className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-semibold mb-6 text-center">Featured Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sections.bottomHighlights.map((product) => (
                <ProductCard key={product.id} product={product} variant="highlight" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Visit our store or contact us directly for personalized assistance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
