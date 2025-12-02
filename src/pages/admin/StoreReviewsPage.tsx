import { Star } from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';

const StoreReviewsPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store Reviews</h1>
        <p className="text-gray-600 mt-2">
          Manage customer reviews and ratings
        </p>
      </div>

      <div className="card">
        <EmptyState
          icon={<Star className="h-12 w-12" />}
          title="No reviews yet"
          description="Customer reviews will appear here"
        />
      </div>
    </div>
  );
};

export default StoreReviewsPage;