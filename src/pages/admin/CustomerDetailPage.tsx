import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Package,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Customer } from '../../types';
import {
  getCustomerById,
  deleteCustomer,
  sendWarrantyReminder,
  requestReview,
} from '../../services/customerService';
import toast from 'react-hot-toast';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomer(id);
    }
  }, [id]);

  const loadCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      const data = await getCustomerById(customerId);
      setCustomer(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load customer');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer || !confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer(customer.id);
      toast.success('Customer deleted successfully');
      navigate('/admin/customers');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer');
    }
  };

  const handleSendReminder = async () => {
    if (!customer) return;

    try {
      await sendWarrantyReminder(customer.id);
      toast.success('Warranty reminder sent successfully');
      loadCustomer(customer.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reminder');
    }
  };

  const handleRequestReview = async () => {
    if (!customer) return;

    try {
      await requestReview(customer.id);
      toast.success('Review request sent successfully');
      loadCustomer(customer.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to request review');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading customer details..." />;
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Customer not found</p>
      </div>
    );
  }

  const getWarrantyBadge = () => {
    if (customer.warrantyStatus === 'Active') {
      return <Badge variant="success" dot>Active Warranty</Badge>;
    } else if (customer.warrantyStatus === 'Expiring Soon') {
      return <Badge variant="warning" dot>Expiring Soon</Badge>;
    } else {
      return <Badge variant="danger" dot>Warranty Expired</Badge>;
    }
  };

  const getStatusBadge = () => {
    const variants: Record<string, any> = {
      'Active': 'success',
      'Warranty Expired': 'danger',
      'Review Requested': 'info',
      'Completed': 'default',
    };
    return <Badge variant={variants[customer.status] || 'default'}>{customer.status}</Badge>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              {customer.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Customer Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/customers/${customer.id}/edit`)}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <div className="mt-2">{getStatusBadge()}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Warranty</p>
                <div className="mt-2">{getWarrantyBadge()}</div>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days Until Expiry</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {customer.daysUntilExpiry !== undefined && customer.daysUntilExpiry >= 0
                    ? customer.daysUntilExpiry
                    : 'Expired'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <a
                  href={`mailto:${customer.email}`}
                  className="text-gray-900 dark:text-gray-100 font-medium hover:text-primary-600"
                >
                  {customer.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <a
                  href={`tel:${customer.phone}`}
                  className="text-gray-900 dark:text-gray-100 font-medium hover:text-primary-600"
                >
                  {customer.phone}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Information */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Product</p>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {customer.productName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Serial Number</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {customer.productSerial || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Purchase Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {format(customer.purchaseDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Warranty End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {format(customer.warrantyEndDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{customer.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Invoice Number</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {customer.invoiceNumber || 'N/A'}
                </p>
              </div>
            </div>

            {customer.notes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  {customer.notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleSendReminder}>
              Send Warranty Reminder
            </Button>
            <Button variant="secondary" onClick={handleRequestReview}>
              Request Review
            </Button>
            <Button variant="outline" onClick={() => window.open(`mailto:${customer.email}`)}>
              Send Email
            </Button>
            <Button variant="outline" onClick={() => window.open(`tel:${customer.phone}`)}>
              Call Customer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">Customer Created</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(customer.createdAt, 'MMM dd, yyyy \\a\\t hh:mm a')}
                </p>
              </div>
            </div>

            {customer.lastReminderDate && (
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Warranty Reminder Sent
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(customer.lastReminderDate, 'MMM dd, yyyy \\a\\t hh:mm a')}
                  </p>
                </div>
              </div>
            )}

            {customer.reviewRequestDate && (
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500 mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Review Requested
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(customer.reviewRequestDate, 'MMM dd, yyyy \\a\\t hh:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailPage;
