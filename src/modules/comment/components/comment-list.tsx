'use client';

import { useInView } from 'react-intersection-observer';
import { CommentResponse } from '../types/comment-response.type';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '@/actions/comment.action';
import { useEffect } from 'react';
import { CommentItem } from './comment-item';
import { CommentSkeleton } from './comment-skeleton';

export const CommentList = ({ postId }: { postId: number }) => {
  const { ref, inView } = useInView();

  const checkLastViewRef = (index: number, page: Common.PagingRes<CommentResponse>) =>
    index === page.data.length - 1;

  const { data, error, isLoading, hasNextPage, fetchNextPage, isSuccess, isFetchingNextPage } =
    useInfiniteQuery<Common.PagingRes<CommentResponse>, Error>({
      queryKey: ['comments', postId],
      queryFn: (({ pageParam }: { pageParam: unknown }) =>
        getComments(postId, Number(pageParam))) as any,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.metadata?.lastCursor ?? undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (error) {
    console.log('🚀 ~ CommentList ~ error:', error);
  }

  if (isLoading) {
    return <CommentSkeleton />;
  }

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col min-h-40">
        {data?.pages?.map((page) =>
          page?.data?.map((comment, index) =>
            checkLastViewRef(index, page) ? (
              <div ref={ref} key={comment.id}>
                <CommentItem data={comment} postId={postId} index={index} />
              </div>
            ) : (
              <div key={comment.id}>
                <CommentItem data={comment} postId={postId} index={index} />
              </div>
            ),
          ),
        )}

        {isFetchingNextPage && <CommentSkeleton />}
      </div>
    );
  }
};
