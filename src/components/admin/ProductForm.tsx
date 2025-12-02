import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Loader } from 'lucide-react';
import { createProduct, updateProduct, getProductById } from '../../services/productService';
import { Product, ProductCategory } from '../../types';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants';
import toast from 'react-hot-toast';
import FormField from './FormField';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';
import TagsInput from './TagsInput';

const ProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEdit = !!productId;
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    shortSlogan: '',
    description: '',
    price: 0,
    condition: 'New' as typeof PRODUCT_CONDITIONS[number],
    ram: '',
    cpu: '',
    gpu: '',
    storage: '',
    color: '',
    stockCount: 0,
    isLimitedStock: false,
    isNewArrival: false,
    isDeal: false,
    isTopHighlight: false,
    isBottomHighlight: false,
    category: [] as ProductCategory[],
    tags: [] as string[],
    featuredImage: '',
    galleryImages: [] as string[],
    published: false,
  });

  useEffect(() => {
    if (isEdit && productId) {
      loadProduct();
    }
  }, [isEdit, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await getProductById(productId!);
      setFormData({
        title: product.title,
        brand: product.brand,
        model: product.model,
        shortSlogan: product.shortSlogan,
        description: product.description,
        price: product.price,
        condition: product.condition,
        ram: product.ram,
        cpu: product.cpu,
        gpu: product.gpu || '',
        storage: product.storage,
        color: product.color,
        stockCount: product.stockCount,
        isLimitedStock: product.isLimitedStock,
        isNewArrival: product.isNewArrival,
        isDeal: product.isDeal,
        isTopHighlight: product.isTopHighlight,
        isBottomHighlight: product.isBottomHighlight,
        category: product.category,
        tags: product.tags,
        featuredImage: product.featuredImage,
        galleryImages: product.galleryImages,
        published: product.published,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        publishConfig: {
          tags: formData.tags,
          brand: formData.brand,
          category: formData.category,
        },
      };

      if (isEdit) {
        await updateProduct(productId!, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      
      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryToggle = (cat: ProductCategory) => {
    if (formData.category.includes(cat)) {
      setFormData({
        ...formData,
        category: formData.category.filter((c) => c !== cat),
      });
    } else {
      setFormData({
        ...formData,
        category: [...formData.category, cat],
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="btn btn-secondary"
        >
          <X className="h-5 w-5 mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Title" required>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input"
                placeholder="HP Pavilion 15"
              />
            </FormField>

            <FormField label="Brand" required>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="input"
                placeholder="HP"
              />
            </FormField>

            <FormField label="Model" required>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                className="input"
                placeholder="15-dy2702tu"
              />
            </FormField>

            <FormField label="Short Slogan" required>
              <input
                type="text"
                value={formData.shortSlogan}
                onChange={(e) => setFormData({ ...formData, shortSlogan: e.target.value })}
                required
                className="input"
                placeholder="Powerful performance for everyday tasks"
              />
            </FormField>

            <FormField label="Description" required>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="input"
                placeholder="Detailed product description..."
              />
            </FormField>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Price (₹)" required>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
                className="input"
                placeholder="50000"
              />
            </FormField>

            <FormField label="Condition" required>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                required
                className="input"
              >
                {PRODUCT_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Stock Count" required>
              <input
                type="number"
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                required
                min="0"
                className="input"
                placeholder="10"
              />
            </FormField>
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isLimitedStock}
                onChange={(e) => setFormData({ ...formData, isLimitedStock: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Mark as Limited Stock</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Mark as New Arrival</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDeal}
                onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Mark as Deal</span>
            </label>
          </div>
        </div>

        {/* Specifications */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="RAM" required>
              <input
                type="text"
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                required
                className="input"
                placeholder="8GB DDR4"
              />
            </FormField>

            <FormField label="CPU" required>
              <input
                type="text"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                required
                className="input"
                placeholder="Intel Core i5-1135G7"
              />
            </FormField>

            <FormField label="GPU">
              <input
                type="text"
                value={formData.gpu}
                onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                className="input"
                placeholder="Intel Iris Xe Graphics"
              />
            </FormField>

            <FormField label="Storage" required>
              <input
                type="text"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                required
                className="input"
                placeholder="512GB SSD"
              />
            </FormField>

            <FormField label="Color" required>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                required
                className="input"
                placeholder="Silver"
              />
            </FormField>
          </div>
        </div>

        {/* Categories & Tags */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Categories & Tags</h2>
          
          <FormField label="Categories" required>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Premium', 'Standard', 'Basic'].map((cat) => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.category.includes(cat as ProductCategory)}
                    onChange={() => handleCategoryToggle(cat as ProductCategory)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </FormField>

          <div className="mt-6">
            <FormField label="Tags">
              <TagsInput
                value={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="gaming, business, touchscreen..."
              />
            </FormField>
          </div>
        </div>

        {/* Media */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Media</h2>
          
          <div className="space-y-6">
            <ImageUpload
              label="Featured Image"
              value={formData.featuredImage}
              onChange={(url) => setFormData({ ...formData, featuredImage: url })}
            />

            <MultiImageUpload
              label="Gallery Images"
              value={formData.galleryImages}
              onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
              maxImages={8}
            />
          </div>
        </div>

        {/* Highlights */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Homepage Highlights</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTopHighlight}
                onChange={(e) => setFormData({ ...formData, isTopHighlight: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Show in Top Highlight Bar (max 10)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBottomHighlight}
                onChange={(e) => setFormData({ ...formData, isBottomHighlight: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Show in Bottom Highlight Bar (max 10)</span>
            </label>
          </div>
        </div>

        {/* Publish */}
        <div className="card p-6">
          <FormField label="Publish Status">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Publish to public site</span>
            </label>
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEdit ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;