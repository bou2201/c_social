'use client';

import { getPosts } from '@/actions/post.action';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { PostResponse } from '../types/post-response.type';
import { useEffect } from 'react';
import { PostItem } from './post-item';
import { PostSkeleton } from './post-skeleton';
import { useToast } from '@/hooks';

export const PostList = ({ id = 'all' }: { id: string }) => {
  const { toast } = useToast();
  const { ref, inView } = useInView();

  const checkLastViewRef = (index: number, page: Common.PagingRes<PostResponse>) =>
    index === page.data.length - 1;

  const { data, error, isLoading, hasNextPage, fetchNextPage, isSuccess, isFetchingNextPage } =
    useInfiniteQuery<Common.PagingRes<PostResponse>, Error>({
      queryKey: ['posts', id],
      queryFn: (({ pageParam }: { pageParam: unknown }) => getPosts(Number(pageParam), id)) as any,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.metadata?.lastCursor ?? undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (error) {
    toast({
      variant: 'destructive',
      title: 'Lỗi tải dữ liệu',
      description: 'Vui lòng thử lại sau.',
    });
    return <></>;
  }

  if (isLoading) {
    return <PostSkeleton postNumber={5} />;
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col">
        {data?.pages?.map((page) =>
          page?.data?.map((post, index) =>
            checkLastViewRef(index, page) ? (
              <div ref={ref} key={post.id}>
                <PostItem data={post} queryId={id} index={index} />
              </div>
            ) : (
              <div key={post.id}>
                <PostItem data={post} queryId={id} index={index} />
              </div>
            ),
          ),
        )}

        {isFetchingNextPage && <PostSkeleton />}
      </div>
    );
  }
};
