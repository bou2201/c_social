'use client';

import { Skeleton } from '@/components/ui';

export const CommentSkeleton = () => {
  return (
    <div className="max-sm:py-4 py-5 border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px] flex-1 min-h-40">
      <div className="flex justify-start items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
};
