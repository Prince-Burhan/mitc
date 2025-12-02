import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Product } from '../../../types';
import { uploadToCloudinary } from '../../../services/cloudinaryService';
import ImageUpload from '../../../components/ui/ImageUpload';
import MultiImageUpload from '../../../components/ui/MultiImageUpload';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import toast from 'react-hot-toast';
import { ProductCategory, ProductCondition } from '../../../types';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    slug: '',
    brand: '',
    model: '',
    shortSlogan: '',
    description: '',
    price: 0,
    condition: 'New' as ProductCondition,
    ram: '',
    cpu: '',
    storage: '',
    color: '',
    stockCount: 0,
    category: 'Premium' as ProductCategory,
    tags: [],
    featuredImage: '',
    galleryImages: [],
    isLimitedStock: false,
    isNewArrival: false,
    isDeal: false,
    isTopHighlight: false,
    isBottomHighlight: false,
    published: false,
    publishConfig: {
      featuredSlogan: '',
      tags: [],
      brand: '',
      category: 'Premium' as ProductCategory,
    },
  });

  useEffect(() => {
    if (id) {
      loadProduct();
      setIsEdit(true);
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Product;
        setFormData({ ...data, publishConfig: data.publishConfig || {} });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const productData: Partial<Product> = {
        ...formData,
        updatedAt: serverTimestamp() as any,
      };

      if (!isEdit) {
        productData.createdAt = serverTimestamp() as any;
      }

      // Validate required fields
      if (!productData.title || !productData.brand || !productData.price || !productData.featuredImage) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (isEdit) {
        await updateDoc(doc(db, 'products', id!), productData);
        toast.success('Product updated successfully');
      } else {
        const newDocRef = doc(collection(db, 'products'));
        await setDoc(newDocRef, productData);
        toast.success('Product created successfully');
        navigate(`/admin/products/${newDocRef.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, featuredImage: url });
  };

  const handleGalleryChange = (urls: string[]) => {
    setFormData({ ...formData, galleryImages: urls });
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, featuredImage: '' });
  };

  if (loading && isEdit) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Product' : 'Create Product'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update product details' : 'Add a new product to your store'}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/products')}>
          Back to Products
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Title *
            </label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter product title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand *
            </label>
            <Input
              value={formData.brand || ''}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Enter brand name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <Input
              value={formData.model || ''}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="Enter model number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (PKR) *
            </label>
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Category and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <Select
              value={formData.category || 'Premium'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
            >
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition *
            </label>
            <Select
              value={formData.condition || 'New'}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as ProductCondition })}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
            </Select>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RAM
            </label>
            <Input
              value={formData.ram || ''}
              onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
              placeholder="8GB, 16GB, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CPU
            </label>
            <Input
              value={formData.cpu || ''}
              onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
              placeholder="Intel i7, AMD Ryzen 5, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Storage
            </label>
            <Input
              value={formData.storage || ''}
              onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
              placeholder="512GB SSD, 1TB HDD, etc."
            />
          </div>
        </div>

        {/* Color and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <Input
              value={formData.color || ''}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="Black, Silver, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Quantity
            </label>
            <Input
              type="number"
              value={formData.stockCount || ''}
              onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Short Slogan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Short Slogan
          </label>
          <Input
            value={formData.shortSlogan || ''}
            onChange={(e) => setFormData({ ...formData, shortSlogan: e.target.value })}
            placeholder="Brief description for product cards"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <TextArea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter detailed product description"
            rows={6}
            required
          />
        </div>

        {/* Images - Featured Image */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Product Images
          </h3>
          <ImageUpload
            value={formData.featuredImage}
            onChange={handleImageChange}
            onRemove={handleRemoveImage}
            folder="products"
            label="Featured Image *"
            description="Main product image (1200x800 recommended)"
            aspectRatio="3/2"
            maxSize={10}
          />
        </div>

        {/* Images - Gallery */}
        <div>
          <MultiImageUpload
            value={formData.galleryImages || []}
            onChange={handleGalleryChange}
            folder="products/gallery"
            label="Gallery Images"
            description="Additional product images. First image will be the cover. Drag to reorder."
            maxImages={10}
            maxSize={10}
          />
        </div>

        {/* Product Flags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Checkbox
            label="New Arrival"
            checked={formData.isNewArrival || false}
            onChange={(checked) => setFormData({ ...formData, isNewArrival: checked })}
          />
          <Checkbox
            label="Deal"
            checked={formData.isDeal || false}
            onChange={(checked) => setFormData({ ...formData, isDeal: checked })}
          />
          <Checkbox
            label="Limited Stock"
            checked={formData.isLimitedStock || false}
            onChange={(checked) => setFormData({ ...formData, isLimitedStock: checked })}
          />
          <Checkbox
            label="Top Highlight"
            checked={formData.isTopHighlight || false}
            onChange={(checked) => setFormData({ ...formData, isTopHighlight: checked })}
          />
          <Checkbox
            label="Bottom Highlight"
            checked={formData.isBottomHighlight || false}
            onChange={(checked) => setFormData({ ...formData, isBottomHighlight: checked })}
          />
          <Checkbox
            label="Published"
            checked={formData.published || false}
            onChange={(checked) => setFormData({ ...formData, published: checked })}
          />
        </div>

        {/* SEO Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Title
            </label>
            <Input
              value={formData.metaTitle || ''}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="SEO title (max 60 chars)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Description
            </label>
            <Input
              value={formData.metaDescription || ''}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="SEO description (max 160 chars)"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (comma separated)
          </label>
          <Input
            value={(formData.tags || []).join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
            placeholder="laptop, gaming, 16GB, i7, fast"
          />
        </div>

        {/* Publish Config */}
        {!isEdit && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Publish Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Slogan
                </label>
                <Input
                  value={formData.publishConfig?.featuredSlogan || ''}
                  onChange={(e) => 
                    setFormData({ 
                      ...formData, 
                      publishConfig: { 
                        ...formData.publishConfig!, 
                        featuredSlogan: e.target.value,
                        brand: formData.brand || '',
                        tags: formData.tags || [],
                        category: formData.category || 'Premium'
                      } 
                    })
                  }
                  placeholder="Catchy phrase for homepage"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;