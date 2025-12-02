import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { Product } from '../../types';
import {
  getProductById,
  createProduct,
  updateProduct,
  getAllProducts,
} from '../../services/productService';
import toast from 'react-hot-toast';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brand: '',
    model: '',
    shortSlogan: '',
    description: '',
    price: '',
    condition: 'New' as any,
    
    // Specifications
    ram: '',
    cpu: '',
    gpu: '',
    storage: '',
    color: '',
    
    stockCount: '',
    
    // Flags
    isLimitedStock: false,
    isNewArrival: false,
    isDeal: false,
    isTopHighlight: false,
    isBottomHighlight: false,
    
    // Category
    category: 'Business' as any,
    tags: [] as string[],
    
    // Media
    featuredImage: '',
    galleryImages: [] as string[],
    
    // Publishing
    published: false,
    
    // Publish Config
    publishConfig: {
      featuredSlogan: '',
      featuredImage: '',
      tags: [] as string[],
      brand: '',
      category: 'Business' as any,
    },
    
    // SEO
    metaTitle: '',
    metaDescription: '',
  });

  const [imageInput, setImageInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTotalProducts();
    if (isEdit && id) {
      loadProduct(id);
    }
  }, [id]);

  const loadTotalProducts = async () => {
    try {
      const products = await getAllProducts();
      setTotalProducts(products.length);
    } catch (error) {
      console.error('Failed to load product count:', error);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const product = await getProductById(productId);
      setFormData({
        title: product.title,
        slug: product.slug || '',
        brand: product.brand,
        model: product.model,
        shortSlogan: product.shortSlogan || '',
        description: product.description,
        price: product.price.toString(),
        condition: product.condition,
        ram: product.ram || '',
        cpu: product.cpu || '',
        gpu: product.gpu || '',
        storage: product.storage || '',
        color: product.color || '',
        stockCount: product.stockCount.toString(),
        isLimitedStock: product.isLimitedStock || false,
        isNewArrival: product.isNewArrival || false,
        isDeal: product.isDeal || false,
        isTopHighlight: product.isTopHighlight || false,
        isBottomHighlight: product.isBottomHighlight || false,
        category: product.category,
        tags: product.tags || [],
        featuredImage: product.featuredImage || '',
        galleryImages: product.galleryImages || [],
        published: product.published,
        publishConfig: product.publishConfig || {
          featuredSlogan: '',
          featuredImage: '',
          tags: [],
          brand: product.brand,
          category: product.category,
        },
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.shortSlogan.trim()) newErrors.shortSlogan = 'Short slogan is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stockCount || parseInt(formData.stockCount) < 0) {
      newErrors.stockCount = 'Valid stock count is required';
    }
    if (!formData.featuredImage.trim()) newErrors.featuredImage = 'Featured image is required';
    
    // Check 80 product limit
    if (!isEdit && totalProducts >= 80) {
      newErrors.limit = 'Maximum 80 products allowed. Please delete some products first.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);

      const productData: any = {
        title: formData.title,
        slug: formData.slug,
        brand: formData.brand,
        model: formData.model,
        shortSlogan: formData.shortSlogan,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        ram: formData.ram,
        cpu: formData.cpu,
        gpu: formData.gpu,
        storage: formData.storage,
        color: formData.color,
        stockCount: parseInt(formData.stockCount),
        isLimitedStock: formData.isLimitedStock,
        isNewArrival: formData.isNewArrival,
        isDeal: formData.isDeal,
        isTopHighlight: formData.isTopHighlight,
        isBottomHighlight: formData.isBottomHighlight,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        galleryImages: formData.galleryImages,
        published: formData.published,
        publishConfig: {
          ...formData.publishConfig,
          brand: formData.brand,
          category: formData.category,
        },
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      };

      if (isEdit && id) {
        await updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && !isEdit) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addGalleryImage = () => {
    if (galleryInput.trim() && !formData.galleryImages.includes(galleryInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, galleryInput.trim()],
      }));
      setGalleryInput('');
    }
  };

  const removeGalleryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((img) => img !== url),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading product..." />;
  }

  const isNearLimit = totalProducts >= 75;
  const isAtLimit = totalProducts >= 80;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/products')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update product information' : `${totalProducts}/80 products created`}
          </p>
        </div>
      </div>

      {/* Limit Warning */}
      {!isEdit && isNearLimit && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${isAtLimit ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
          <AlertCircle className={`h-5 w-5 ${isAtLimit ? 'text-red-600' : 'text-yellow-600'}`} />
          <div>
            <p className={`font-medium ${isAtLimit ? 'text-red-900 dark:text-red-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
              {isAtLimit ? 'Product Limit Reached!' : 'Approaching Product Limit'}
            </p>
            <p className={`text-sm ${isAtLimit ? 'text-red-700 dark:text-red-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
              {isAtLimit 
                ? 'You have reached the maximum of 80 products. Please delete some products to add new ones.'
                : `You have ${80 - totalProducts} product slots remaining.`
              }
            </p>
          </div>
        </div>
      )}

      {errors.limit && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-900 dark:text-red-100 font-medium">{errors.limit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Input
                  label="Product Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={errors.title}
                  required
                  fullWidth
                  placeholder="e.g., Dell XPS 15 Gaming Laptop"
                />
                <Input
                  label="URL Slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  error={errors.slug}
                  required
                  fullWidth
                  placeholder="dell-xps-15-gaming-laptop"
                  helperText="SEO-friendly URL (auto-generated from title)"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    error={errors.brand}
                    required
                    fullWidth
                    placeholder="e.g., Dell"
                  />
                  <Input
                    label="Model"
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    error={errors.model}
                    required
                    fullWidth
                    placeholder="e.g., XPS 15 9530"
                  />
                </div>
                <Input
                  label="Short Slogan"
                  value={formData.shortSlogan}
                  onChange={(e) => handleChange('shortSlogan', e.target.value)}
                  error={errors.shortSlogan}
                  required
                  fullWidth
                  placeholder="e.g., Power meets portability"
                  helperText="Catchy one-liner for product cards"
                />
                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  error={errors.description}
                  required
                  fullWidth
                  rows={4}
                  placeholder="Detailed product description..."
                  showCharCount
                  maxLength={2000}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  error={errors.price}
                  required
                  fullWidth
                  min="0"
                  step="0.01"
                />
                <Input
                  label="Stock Count"
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => handleChange('stockCount', e.target.value)}
                  error={errors.stockCount}
                  required
                  fullWidth
                  min="0"
                />
                <Select
                  label="Condition"
                  value={formData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'Like New', label: 'Like New' },
                    { value: 'Refurbished', label: 'Refurbished' },
                    { value: 'Used', label: 'Used' },
                  ]}
                  fullWidth
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="RAM"
                  value={formData.ram}
                  onChange={(e) => handleChange('ram', e.target.value)}
                  fullWidth
                  placeholder="e.g., 16GB DDR5"
                />
                <Input
                  label="Processor (CPU)"
                  value={formData.cpu}
                  onChange={(e) => handleChange('cpu', e.target.value)}
                  fullWidth
                  placeholder="e.g., Intel Core i7-12700H"
                />
                <Input
                  label="Graphics (GPU)"
                  value={formData.gpu}
                  onChange={(e) => handleChange('gpu', e.target.value)}
                  fullWidth
                  placeholder="e.g., NVIDIA RTX 3060 6GB"
                />
                <Input
                  label="Storage"
                  value={formData.storage}
                  onChange={(e) => handleChange('storage', e.target.value)}
                  fullWidth
                  placeholder="e.g., 512GB NVMe SSD"
                />
                <Input
                  label="Color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  fullWidth
                  placeholder="e.g., Space Gray"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  options={[
                    { value: 'Premium', label: 'Premium' },
                    { value: 'Standard', label: 'Standard' },
                    { value: 'Basic', label: 'Basic' },
                  ]}
                  fullWidth
                />

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Product Flags</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isNewArrival}
                        onChange={(e) => handleChange('isNewArrival', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">New Arrival</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Show in New Arrivals section (max 10)</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isDeal}
                        onChange={(e) => handleChange('isDeal', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Special Deal</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Show in Deals banner slider (max 10)</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isLimitedStock}
                        onChange={(e) => handleChange('isLimitedStock', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Limited Stock</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Show in Limited Stock section (max 10)</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isTopHighlight}
                        onChange={(e) => handleChange('isTopHighlight', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Top Highlight</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Show in top highlight bar (max 10)</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isBottomHighlight}
                        onChange={(e) => handleChange('isBottomHighlight', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Bottom Highlight</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Show in bottom highlight section (max 10)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag"
                      fullWidth
                    />
                    <Button type="button" variant="secondary" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="default" className="px-3 py-1.5">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Input
                  label="Featured Image URL"
                  value={formData.featuredImage}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  error={errors.featuredImage}
                  required
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                  helperText="Main image shown in product cards and listings"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gallery Images (Product Detail Page)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                      placeholder="Enter image URL"
                      fullWidth
                    />
                    <Button type="button" variant="secondary" onClick={addGalleryImage}>
                      Add
                    </Button>
                  </div>
                  {formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.galleryImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(url)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Input
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  fullWidth
                  placeholder="Leave empty to use product title"
                />
                <TextArea
                  label="Meta Description"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  fullWidth
                  rows={3}
                  placeholder="SEO description for search engines"
                  showCharCount
                  maxLength={160}
                />
              </div>
            </CardContent>
          </Card>

          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Published</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make this product visible on the public site
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleChange('published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              leftIcon={<Save className="h-4 w-4" />}
              disabled={!isEdit && isAtLimit}
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
