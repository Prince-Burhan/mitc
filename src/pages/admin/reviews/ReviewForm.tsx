import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { StoreReview } from '../../../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Select from '../../../components/ui/Select';
import toast from 'react-hot-toast';

const ReviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<Partial<StoreReview>>({
    customerName: '',
    customerEmail: '',
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    title: '',
    comment: '',
    status: 'Pending',
    featured: false,
    source: 'Manual',
  });

  useEffect(() => {
    if (id) {
      loadReview();
      setIsEdit(true);
    }
  }, [id]);

  const loadReview = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'reviews', id!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as StoreReview;
        setFormData(data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const reviewData: Partial<StoreReview> = {
        ...formData,
        updatedAt: serverTimestamp() as any,
      };

      if (!isEdit) {
        reviewData.createdAt = serverTimestamp() as any;
      }

      // Validate required fields
      if (!reviewData.customerName || !reviewData.title || !reviewData.comment || !reviewData.rating) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (isEdit) {
        await updateDoc(doc(db, 'reviews', id!), reviewData);
        toast.success('Review updated successfully');
      } else {
        await addDoc(collection(db, 'reviews'), reviewData);
        toast.success('Review created successfully');
        navigate('/admin/reviews');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Review' : 'Create Review'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update review details' : 'Add a new customer review'}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/reviews')}>
          Back to Reviews
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer Name *
            </label>
            <Input
              value={formData.customerName || ''}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer Email
            </label>
            <Input
              type="email"
              value={formData.customerEmail || ''}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="customer@example.com"
            />
          </div>
        </div>

        {/* Review Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </label>
          <Select
            value={formData.rating?.toString() || '5'}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
          >
            <option value="5">5 Stars - Excellent</option>
            <option value="4">4 Stars - Good</option>
            <option value="3">3 Stars - Average</option>
            <option value="2">2 Stars - Below Average</option>
            <option value="1">1 Star - Poor</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Review Title *
          </label>
          <Input
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief summary of the review"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Review Comment *
          </label>
          <TextArea
            value={formData.comment || ''}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Write the customer's review..."
            rows={6}
            required
          />
        </div>

        {/* Status and Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <Select
              value={formData.status || 'Pending'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Approved' | 'Rejected' })}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured
            </label>
            <Select
              value={formData.featured ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'true' })}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </div>
        </div>

        {/* Admin Reply */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin Reply
            </label>
            <TextArea
              value={formData.adminReply || ''}
              onChange={(e) => setFormData({ ...formData, adminReply: e.target.value })}
              placeholder="Optional response to the customer..."
              rows={4}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Review' : 'Create Review')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/reviews')} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;