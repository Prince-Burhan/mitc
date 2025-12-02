import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Modal, ModalFooter } from '../../components/ui/Modal';
import TextArea from '../../components/ui/TextArea';
import { StoreReview, ReviewFilters } from '../../types';
import {
  getReviews,
  getReviewStats,
  approveReview,
  rejectReview,
  deleteReview,
  replyToReview,
  toggleFeaturedReview,
  exportReviewsData,
} from '../../services/reviewService';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<StoreReview | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [currentPage, filters]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { reviews: data } = await getReviews(
        { ...filters, searchQuery },
        pageSize
      );
      setReviews(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error: any) {
      toast.error(error.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getReviewStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      toast.success('Review approved');
      loadReviews();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this review?')) return;

    try {
      await rejectReview(id);
      toast.success('Review rejected');
      loadReviews();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(id);
      toast.success('Review deleted');
      loadReviews();
      loadStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeaturedReview(id);
      toast.success('Featured status updated');
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update featured status');
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) return;

    try {
      await replyToReview(selectedReview.id, replyText);
      toast.success('Reply posted successfully');
      setShowReplyModal(false);
      setReplyText('');
      setSelectedReview(null);
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to post reply');
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportReviewsData();
      const csv = convertToCSV(data);
      downloadCSV(csv, 'reviews.csv');
      toast.success('Reviews exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export reviews');
    }
  };

  const convertToCSV = (data: StoreReview[]) => {
    const headers = ['Customer', 'Rating', 'Title', 'Comment', 'Status', 'Created'];
    const rows = data.map(r => [
      r.customerName,
      r.rating,
      r.title,
      r.comment.replace(/,/g, ';'),
      r.status,
      format(r.createdAt, 'yyyy-MM-dd'),
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );

  const columns = [
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (review: StoreReview) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {review.customerName}
          </p>
          {review.customerEmail && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {review.customerEmail}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (review: StoreReview) => (
        <div>
          {renderStars(review.rating)}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {review.rating}/5
          </p>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Review',
      render: (review: StoreReview) => (
        <div className="max-w-md">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
            {review.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {review.comment}
          </p>
          {review.featured && (
            <Badge variant="purple" size="sm" className="mt-2">
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (review: StoreReview) => getStatusBadge(review.status),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (review: StoreReview) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {format(review.createdAt, 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (review: StoreReview) => (
        <div className="flex items-center gap-2">
          {review.status === 'Pending' && (
            <>
              <button
                onClick={() => handleApprove(review.id)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded dark:hover:bg-green-900/20"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleReject(review.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => {
              setSelectedReview(review);
              setReplyText(review.adminReply || '');
              setShowReplyModal(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
            title="Reply"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleToggleFeatured(review.id)}
            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded dark:hover:bg-purple-900/20"
            title="Toggle Featured"
          >
            <Star className={review.featured ? 'fill-purple-600' : ''} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && reviews.length === 0) {
    return <LoadingSpinner fullScreen text="Loading reviews..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and moderate customer reviews
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.pending}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.approved}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stats.rejected}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
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
            <div className="flex-1 w-full lg:w-auto">
              <Input
                placeholder="Search by customer name or review content..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadReviews()}
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
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Status"
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Rejected', label: 'Rejected' },
                  ]}
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                />
                <Select
                  label="Rating"
                  options={[
                    { value: '', label: 'All Ratings' },
                    { value: '5', label: '5 Stars' },
                    { value: '4', label: '4 Stars' },
                    { value: '3', label: '3 Stars' },
                    { value: '2', label: '2 Stars' },
                    { value: '1', label: '1 Star' },
                  ]}
                  value={filters.rating?.toString() || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, rating: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                />
                <div className="flex gap-2 items-end">
                  <Button variant="secondary" onClick={() => setFilters({})} fullWidth>
                    Clear
                  </Button>
                  <Button variant="primary" onClick={loadReviews} fullWidth>
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
          data={reviews}
          columns={columns}
          isLoading={loading}
          emptyMessage="No reviews yet. Customer reviews will appear here."
        />
        {reviews.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={reviews.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedReview(null);
          setReplyText('');
        }}
        title="Reply to Review"
        size="md"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedReview.customerName}
                  </p>
                  {renderStars(selectedReview.rating)}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {selectedReview.comment}
                  </p>
                </div>
              </div>
            </div>

            <TextArea
              label="Your Reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              fullWidth
              placeholder="Write your reply to the customer..."
              showCharCount
              maxLength={500}
            />
          </div>
        )}

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowReplyModal(false);
              setSelectedReview(null);
              setReplyText('');
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReply} disabled={!replyText.trim()}>
            Post Reply
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ReviewsPage;
