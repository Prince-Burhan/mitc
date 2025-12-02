import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Product, ProductFilters } from '../../types';
import {
  getProducts,
  getProductStats,
  deleteProduct,
  bulkDeleteProducts,
  togglePublished,
  exportProductsData,
  getAllProducts,
  duplicateProduct,
} from '../../services/productService';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [sectionLimits, setSectionLimits] = useState({
    topHighlights: 0,
    deals: 0,
    newArrivals: 0,
    limitedStock: 0,
    bottomHighlights: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    loadProducts();
    loadStats();
  }, [currentPage, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [productsData, allProducts] = await Promise.all([
        getProducts({ ...filters, searchQuery }, pageSize),
        getAllProducts(),
      ]);
      
      setProducts(productsData.products);
      setTotalPages(Math.ceil(productsData.products.length / pageSize));
      
      // Calculate section limits
      setSectionLimits({
        topHighlights: allProducts.filter(p => p.isTopHighlight).length,
        deals: allProducts.filter(p => p.isDeal).length,
        newArrivals: allProducts.filter(p => p.isNewArrival).length,
        limitedStock: allProducts.filter(p => p.isLimitedStock).length,
        bottomHighlights: allProducts.filter(p => p.isBottomHighlight).length,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getProductStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleDuplicate = async (productId: string) => {
    if (!confirm('Create a duplicate of this product?')) return;

    try {
      await duplicateProduct(productId);
      toast.success('Product duplicated successfully');
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to duplicate product');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return;

    try {
      await bulkDeleteProducts(selectedProducts);
      toast.success(`${selectedProducts.length} products deleted`);
      setSelectedProducts([]);
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete products');
    }
  };

  const handleTogglePublished = async (id: string) => {
    try {
      await togglePublished(id);
      toast.success('Product status updated');
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportProductsData();
      const csv = convertToCSV(data);
      downloadCSV(csv, 'products.csv');
      toast.success('Products exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export products');
    }
  };

  const convertToCSV = (data: Product[]) => {
    const headers = ['Brand', 'Model', 'Price', 'Stock', 'Condition', 'Category', 'Published'];
    const rows = data.map(p => [
      p.brand,
      p.model,
      p.price,
      p.stockCount,
      p.condition,
      p.category,
      p.published ? 'Yes' : 'No',
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, any> = {
      'New': 'success',
      'Refurbished': 'warning',
      'Used': 'default',
    };
    return <Badge variant={variants[condition] || 'default'}>{condition}</Badge>;
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock < 5) return <Badge variant="warning">{stock} left</Badge>;
    return <Badge variant="success">{stock} in stock</Badge>;
  };

  const columns = [
    {
      key: 'title',
      label: 'Product',
      sortable: true,
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {product.brand} {product.model}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {product.title}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product: Product) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          ₹{product.price.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'stockCount',
      label: 'Stock',
      render: (product: Product) => getStockBadge(product.stockCount),
    },
    {
      key: 'condition',
      label: 'Condition',
      render: (product: Product) => getConditionBadge(product.condition),
    },
    {
      key: 'category',
      label: 'Category',
      render: (product: Product) => (
        <Badge variant="default">{product.category}</Badge>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (product: Product) => (
        <button
          onClick={() => handleTogglePublished(product.id)}
          className="flex items-center gap-1.5"
        >
          {product.published ? (
            <Badge variant="success" dot>
              Published
            </Badge>
          ) : (
            <Badge variant="default" dot>
              Draft
            </Badge>
          )}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/products/${product.id}`)}
            className="p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            className="p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDuplicate(product.id)}
            className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen text="Loading products..." />;
  }

  const showSectionWarning = 
    sectionLimits.topHighlights >= 9 || 
    sectionLimits.deals >= 9 || 
    sectionLimits.newArrivals >= 9 || 
    sectionLimits.limitedStock >= 9 || 
    sectionLimits.bottomHighlights >= 9;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your product inventory
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.total}/80
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.published}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.unpublished}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                  <XCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Stock</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.inStock}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.outOfStock}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section Limit Warnings */}
      {showSectionWarning && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Homepage Section Limits
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className={sectionLimits.topHighlights >= 10 ? 'text-red-700 dark:text-red-400 font-semibold' : 'text-yellow-700 dark:text-yellow-300'}>
                  Top Highlights: {sectionLimits.topHighlights}/10
                </div>
                <div className={sectionLimits.deals >= 10 ? 'text-red-700 dark:text-red-400 font-semibold' : 'text-yellow-700 dark:text-yellow-300'}>
                  Deals: {sectionLimits.deals}/10
                </div>
                <div className={sectionLimits.newArrivals >= 10 ? 'text-red-700 dark:text-red-400 font-semibold' : 'text-yellow-700 dark:text-yellow-300'}>
                  New Arrivals: {sectionLimits.newArrivals}/10
                </div>
                <div className={sectionLimits.limitedStock >= 10 ? 'text-red-700 dark:text-red-400 font-semibold' : 'text-yellow-700 dark:text-yellow-300'}>
                  Limited Stock: {sectionLimits.limitedStock}/10
                </div>
                <div className={sectionLimits.bottomHighlights >= 10 ? 'text-red-700 dark:text-red-400 font-semibold' : 'text-yellow-700 dark:text-yellow-300'}>
                  Bottom Highlights: {sectionLimits.bottomHighlights}/10
                </div>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                Sections at 10/10 will not display new products until others are removed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <Input
                placeholder="Search by brand, model, or category..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
              {selectedProducts.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleBulkDelete}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Delete ({selectedProducts.length})
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => navigate('/admin/products/new')}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Product
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Category"
                  options={[
                    { value: '', label: 'All Categories' },
                    { value: 'Gaming', label: 'Gaming' },
                    { value: 'Business', label: 'Business' },
                    { value: 'Student', label: 'Student' },
                    { value: 'Creative', label: 'Creative' },
                    { value: 'Home', label: 'Home' },
                  ]}
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                <Select
                  label="Condition"
                  options={[
                    { value: '', label: 'All Conditions' },
                    { value: 'New', label: 'New' },
                    { value: 'Refurbished', label: 'Refurbished' },
                    { value: 'Used', label: 'Used' },
                  ]}
                  value={filters.published === undefined ? '' : filters.published ? 'true' : 'false'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      published: e.target.value === '' ? undefined : e.target.value === 'true',
                    })
                  }
                />
                <Select
                  label="Stock Status"
                  options={[
                    { value: '', label: 'All' },
                    { value: 'inStock', label: 'In Stock' },
                    { value: 'lowStock', label: 'Low Stock' },
                    { value: 'outOfStock', label: 'Out of Stock' },
                  ]}
                  value={filters.stockStatus || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, stockStatus: e.target.value as any })
                  }
                />
                <div className="flex gap-2 items-end">
                  <Button variant="secondary" onClick={() => setFilters({})} fullWidth>
                    Clear
                  </Button>
                  <Button variant="primary" onClick={loadProducts} fullWidth>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card padding="none">
        <Table
          data={products}
          columns={columns}
          isLoading={loading}
          selectable
          selectedRows={selectedProducts}
          onSelectRow={(id) => {
            setSelectedProducts((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          onSelectAll={(selected) => {
            setSelectedProducts(selected ? products.map((p) => p.id) : []);
          }}
          emptyMessage="No products found. Add your first product to get started."
        />
        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={products.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
};

export default ProductsPage;
