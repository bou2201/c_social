'use client';

import { Skeleton } from '@/components/ui';
import { useCallback } from 'react';

export const PostSkeleton = ({ postNumber = 1 }: { postNumber?: number }) => {
  const renderPostSkeleton = useCallback((i?: number) => {
    return (
      <div
        className="max-sm:py-4 py-5 max-sm:px-4 px-6 border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]"
        key={i}
      >
        <div className="flex justify-start items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }, []);

  return Array.from({ length: postNumber }, (_, i) => renderPostSkeleton(i));
};
