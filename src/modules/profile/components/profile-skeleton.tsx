'use client';

import { Skeleton } from '@/components/ui';
import { PostSkeleton } from '@/modules/post';

export const ProfileSkeleton = () => {
  return (
    <>
      <Skeleton className="h-48 w-full" />
      <div className="max-sm:py-4 py-5 max-sm:px-4 px-6 flex justify-between items-center">
        <div>
          <Skeleton className="h-6 w-36 mb-3" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="w-28 h-28 rounded-full" />
      </div>
      <PostSkeleton postNumber={3} />
    </>
  );
};
