import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Copy } from 'lucide-react';
import { getAllProducts, deleteProduct, duplicateProduct } from '../../services/productService';
import { Product } from '../../types';
import { formatPrice, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import Loading from '../../components/shared/Loading';
import EmptyState from '../../components/shared/EmptyState';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProduct(id);
      toast.success('Product duplicated successfully');
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to duplicate product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            {products.length} / 80 products • {products.filter((p) => p.published).length} published
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, model..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <button className="btn btn-secondary">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Start by adding your first product"
            action={
              <Link to="/admin/products/new" className="btn btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.featuredImage}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.stockCount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${
                          product.published ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {product.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;