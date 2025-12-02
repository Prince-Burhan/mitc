import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
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
import EmptyState from '../../components/ui/EmptyState';
import { Customer, CustomerFilters } from '../../types';
import {
  getCustomers,
  getCustomerStats,
  deleteCustomer,
  bulkDeleteCustomers,
  sendWarrantyReminder,
  requestReview,
  exportCustomersData,
} from '../../services/customerService';
import toast from 'react-hot-toast';

const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    loadCustomers();
    loadStats();
  }, [currentPage, filters]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const { customers: data } = await getCustomers(
        { ...filters, searchQuery },
        pageSize
      );
      setCustomers(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error: any) {
      toast.error(error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getCustomerStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer(id);
      toast.success('Customer deleted successfully');
      loadCustomers();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedCustomers.length} customers?`)) return;

    try {
      await bulkDeleteCustomers(selectedCustomers);
      toast.success(`${selectedCustomers.length} customers deleted`);
      setSelectedCustomers([]);
      loadCustomers();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customers');
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      await sendWarrantyReminder(id);
      toast.success('Reminder sent successfully');
      loadCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reminder');
    }
  };

  const handleRequestReview = async (id: string) => {
    try {
      await requestReview(id);
      toast.success('Review request sent');
      loadCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request review');
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportCustomersData();
      // Convert to CSV
      const csv = convertToCSV(data);
      downloadCSV(csv, 'customers.csv');
      toast.success('Customers exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export customers');
    }
  };

  const convertToCSV = (data: Customer[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Product', 'Purchase Date', 'Warranty End', 'Status'];
    const rows = data.map(c => [
      c.name,
      c.email,
      c.phone,
      c.productName,
      format(c.purchaseDate, 'yyyy-MM-dd'),
      format(c.warrantyEndDate, 'yyyy-MM-dd'),
      c.status,
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

  const getWarrantyBadge = (customer: Customer) => {
    if (customer.warrantyStatus === 'Active') {
      return <Badge variant="success" dot>Active</Badge>;
    } else if (customer.warrantyStatus === 'Expiring Soon') {
      return <Badge variant="warning" dot>Expiring Soon</Badge>;
    } else {
      return <Badge variant="danger" dot>Expired</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': 'success',
      'Warranty Expired': 'danger',
      'Review Requested': 'info',
      'Completed': 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (customer: Customer) => (
        <span className="text-gray-900 dark:text-gray-100">{customer.phone}</span>
      ),
    },
    {
      key: 'productName',
      label: 'Product',
      render: (customer: Customer) => (
        <span className="text-gray-900 dark:text-gray-100">{customer.productName}</span>
      ),
    },
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      sortable: true,
      render: (customer: Customer) => (
        <span className="text-gray-900 dark:text-gray-100">
          {format(customer.purchaseDate, 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      key: 'warrantyStatus',
      label: 'Warranty',
      render: (customer: Customer) => (
        <div>
          {getWarrantyBadge(customer)}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {customer.daysUntilExpiry !== undefined &&
              customer.daysUntilExpiry >= 0 &&
              `${customer.daysUntilExpiry} days left`}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (customer: Customer) => getStatusBadge(customer.status),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/customers/${customer.id}`)}
            className="p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/admin/customers/${customer.id}/edit`)}
            className="p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(customer.id)}
            className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading && customers.length === 0) {
    return <LoadingSpinner fullScreen text="Loading customers..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage customer warranty and purchase records
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Warranty</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.activeWarranty}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.expiringSoon}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.expiredWarranty}
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

      {/* Actions Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <Input
                placeholder="Search by name, email, phone, product..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadCustomers()}
              />
            </div>

            {/* Action Buttons */}
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
              {selectedCustomers.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleBulkDelete}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Delete ({selectedCustomers.length})
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => navigate('/admin/customers/new')}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Customer
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Status"
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Warranty Expired', label: 'Warranty Expired' },
                    { value: 'Review Requested', label: 'Review Requested' },
                    { value: 'Completed', label: 'Completed' },
                  ]}
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                />
                <Select
                  label="Warranty Status"
                  options={[
                    { value: '', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'expiringSoon', label: 'Expiring Soon' },
                    { value: 'expired', label: 'Expired' },
                  ]}
                  value={filters.warrantyStatus || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      warrantyStatus: e.target.value as any,
                    })
                  }
                />
                <div className="flex gap-2 items-end">
                  <Button variant="secondary" onClick={() => setFilters({})} fullWidth>
                    Clear Filters
                  </Button>
                  <Button variant="primary" onClick={loadCustomers} fullWidth>
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
          data={customers}
          columns={columns}
          isLoading={loading}
          selectable
          selectedRows={selectedCustomers}
          onSelectRow={(id) => {
            setSelectedCustomers((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          onSelectAll={(selected) => {
            setSelectedCustomers(selected ? customers.map((c) => c.id) : []);
          }}
          emptyMessage="No customers found. Add your first customer to get started."
        />
        {customers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={customers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
};

export default CustomersPage;