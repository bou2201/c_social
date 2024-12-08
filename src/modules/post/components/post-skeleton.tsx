'use client';

import { Skeleton } from '@/components/ui';
import { useUser } from '@clerk/nextjs';
import { useCallback } from 'react';

export const PostSkeleton = ({ postNumber = 1 }: { postNumber?: number }) => {
  const { user } = useUser();

  const renderPostSkeleton = useCallback(
    (i?: number) => {
      return (
        <div
          className={`max-sm:py-4 py-5 max-sm:px-4 px-6 ${
            user ? 'border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]' : ''
          }`}
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
    },
    [user],
  );

  return Array.from({ length: postNumber }, (_, i) => renderPostSkeleton(i));
};

export const PostDetailsSkeleton = () => {
  const { user } = useUser();

  return (
    <div
      className={`max-sm:py-4 py-5 max-sm:px-4 px-6 ${
        user ? 'border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]' : ''
      }`}
    >
      <div className="flex justify-start items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <Skeleton className="h-4 w-28" />
      </div>

      <Skeleton className="h-20 w-full mt-4" />

      <Skeleton className="h-1 w-full my-6" />

      <div className="flex justify-start items-start gap-4 mb-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="w-full">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="flex justify-start items-start gap-4 mb-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="w-full">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="flex justify-start items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="w-full">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
};
