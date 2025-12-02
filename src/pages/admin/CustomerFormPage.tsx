import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Customer } from '../../types';
import {
  getCustomerById,
  createCustomer,
  updateCustomer,
} from '../../services/customerService';
import { getProducts } from '../../services/productService';
import toast from 'react-hot-toast';

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productId: '',
    productSerial: '',
    purchaseDate: '',
    warrantyEndDate: '',
    price: '',
    invoiceNumber: '',
    notes: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProducts();
    if (isEdit && id) {
      loadCustomer(id);
    }
  }, [id]);

  const loadProducts = async () => {
    try {
      const { products: data } = await getProducts({}, 100);
      setProducts(data.filter((p: any) => p.published));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      const customer = await getCustomerById(customerId);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        productId: customer.productId,
        productSerial: customer.productSerial || '',
        purchaseDate: customer.purchaseDate.toISOString().split('T')[0],
        warrantyEndDate: customer.warrantyEndDate.toISOString().split('T')[0],
        price: customer.price.toString(),
        invoiceNumber: customer.invoiceNumber || '',
        notes: customer.notes || '',
        status: customer.status,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load customer');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
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

      // Calculate warranty end date if not provided
      let warrantyEnd = formData.warrantyEndDate;
      if (!warrantyEnd) {
        const purchaseDate = new Date(formData.purchaseDate);
        purchaseDate.setDate(purchaseDate.getDate() + 15); // 15 days warranty
        warrantyEnd = purchaseDate.toISOString().split('T')[0];
      }

      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        productId: formData.productId,
        productName:
          products.find((p) => p.id === formData.productId)?.title || '',
        productSerial: formData.productSerial,
        purchaseDate: new Date(formData.purchaseDate),
        warrantyEndDate: new Date(warrantyEnd),
        price: parseFloat(formData.price),
        invoiceNumber: formData.invoiceNumber,
        notes: formData.notes,
        status: formData.status as any,
        reminderSent: false,
        warrantyStatus: 'Active' as any,
      };

      if (isEdit && id) {
        await updateCustomer(id, customerData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(customerData as any);
        toast.success('Customer created successfully');
      }

      navigate('/admin/customers');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate warranty end date
    if (field === 'purchaseDate' && value) {
      const purchaseDate = new Date(value);
      purchaseDate.setDate(purchaseDate.getDate() + 15);
      setFormData((prev) => ({
        ...prev,
        warrantyEndDate: purchaseDate.toISOString().split('T')[0],
      }));
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading customer..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/customers')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update customer information' : 'Create a new customer record'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  required
                  fullWidth
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  required
                  fullWidth
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                  fullWidth
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Purchase Information */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Product"
                  value={formData.productId}
                  onChange={(e) => handleChange('productId', e.target.value)}
                  options={[
                    { value: '', label: 'Select a product' },
                    ...products.map((p) => ({
                      value: p.id,
                      label: `${p.brand} ${p.model} - ₹${p.price.toLocaleString()}`,
                    })),
                  ]}
                  error={errors.productId}
                  required
                  fullWidth
                />
                <Input
                  label="Serial Number"
                  value={formData.productSerial}
                  onChange={(e) => handleChange('productSerial', e.target.value)}
                  fullWidth
                  placeholder="Optional"
                />
                <Input
                  label="Purchase Date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange('purchaseDate', e.target.value)}
                  error={errors.purchaseDate}
                  required
                  fullWidth
                />
                <Input
                  label="Warranty End Date"
                  type="date"
                  value={formData.warrantyEndDate}
                  onChange={(e) => handleChange('warrantyEndDate', e.target.value)}
                  fullWidth
                  helperText="Auto-calculated as 15 days from purchase date"
                />
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
                  label="Invoice Number"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                  fullWidth
                  placeholder="Optional"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Warranty Expired', label: 'Warranty Expired' },
                    { value: 'Review Requested', label: 'Review Requested' },
                    { value: 'Completed', label: 'Completed' },
                  ]}
                  fullWidth
                />
                <TextArea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  fullWidth
                  rows={4}
                  placeholder="Add any additional notes or comments..."
                  showCharCount
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/customers')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {isEdit ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerFormPage;
