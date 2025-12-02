import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';

export const ActivityList = ({ activities }: { activities: any[] }) => {
  return (
    <ol className="space-y-4">
      {activities && activities.length > 0 ? (
        activities.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary-500" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {item.action}
                </span>
                {item.actionType === 'view' && <Eye className="h-4 w-4 text-blue-400" />}
                {item.actionType === 'review' && <MessageCircle className="h-4 w-4 text-yellow-400" />}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {item.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.details}</p>
            </div>
          </li>
        ))
      ) : (
        <li className="text-gray-400">No recent activity</li>
      )}
    </ol>
  );
};
