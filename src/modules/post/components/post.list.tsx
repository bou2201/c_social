'use client';

import { getPosts } from '@/actions/post.action';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { GetPostResponse } from '../types/post-response.type';
import { useEffect } from 'react';
import { Post, PostSkeleton } from './post';
import { useToast } from '@/hooks';

export const PostList = ({ id = 'all' }: { id: string }) => {
  const { ref, inView } = useInView();
  const { toast } = useToast();

  const { data, error, isLoading, hasNextPage, fetchNextPage, isSuccess, isFetchingNextPage } =
    useInfiniteQuery<GetPostResponse, Error>({
      queryKey: ['posts', id],
      queryFn: (({ pageParam }: { pageParam: unknown }) => getPosts(Number(pageParam), id)) as any,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.metadata.lastCursor,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  const checkLastViewRef = (index: number, page: GetPostResponse) => index === page.data.length - 1;

  if (error) {
    toast({
      variant: 'destructive',
      title: 'Lỗi tải dữ liệu',
      description: 'Vui lòng thử lại sau.',
    });
    return <></>;
  }

  if (isLoading) {
    return <PostSkeleton postNumber={3} />;
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col">
        {data?.pages.map((page) =>
          page.data.map((post, index) =>
            checkLastViewRef(index, page) ? (
              <div ref={ref} key={post.id}>
                <Post data={post} queryId={id} />
              </div>
            ) : (
              <div key={post.id}>
                <Post data={post} queryId={id} />
              </div>
            ),
          ),
        )}

        {isFetchingNextPage && <PostSkeleton />}
      </div>
    );
  }
};
