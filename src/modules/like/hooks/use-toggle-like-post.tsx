import { likePost, unlikePost } from '@/actions/like.action';
import { PostResponse } from '@/modules/post';
import { useUser } from '@clerk/nextjs';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleLikePost = (queryId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        return unlikePost(postId);
      }
      return likePost(postId);
    },
    onMutate: async ({ postId, isLiked }) => {
      // Cancel any outgoing refetches to prevent conflicts
      await queryClient.cancelQueries({ queryKey: ['posts', queryId] });

      // Get the current cached data for the list and details
      const previousPosts = queryClient.getQueryData(['posts', queryId]);

      // Optimistically update the cache to remove the deleted post
      queryClient.setQueryData(
        ['posts', queryId],
        (oldData: InfiniteData<Common.PagingRes<PostResponse>, unknown>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    likes: isLiked
                      ? post.likes.filter((like) => like.authorId !== user?.id)
                      : [...post.likes, { authorId: user?.id }],
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return { previousPosts };
    },
    onError: (error, { postId, isLiked }, context) => {
      console.log('🚀 ~ useToggleLikePost ~ error:', error);

      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      // Refetch the posts query after mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useToggleLikePostDetails = (queryId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        return unlikePost(postId);
      }
      return likePost(postId);
    },
    onMutate: async ({ postId, isLiked }) => {
      // Cancel any outgoing refetches to prevent conflicts
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      await queryClient.cancelQueries({ queryKey: ['posts', queryId] });

      // Get the current cached data for the list and details
      const previousPost = queryClient.getQueryData(['post', postId]);
      const previousPosts = queryClient.getQueryData(['posts', queryId]);

      // Optimistically update the details cache
      queryClient.setQueryData(['post', postId], (oldPost: PostResponse) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          likes: isLiked
            ? oldPost.likes.filter((like) => like.authorId !== user?.id)
            : [...oldPost.likes, { authorId: user?.id }],
        };
      });

      // Optimistically update the cache to remove the deleted post
      queryClient.setQueryData(
        ['posts', queryId],
        (oldData: InfiniteData<Common.PagingRes<PostResponse>, unknown>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    likes: isLiked
                      ? post.likes.filter((like) => like.authorId !== user?.id)
                      : [...post.likes, { authorId: user?.id }],
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return { previousPost, previousPosts };
    },
    onError: (error, { postId, isLiked }, context) => {
      console.log('🚀 ~ useToggleLikePostDetails ~ error:', error);

      queryClient.setQueryData(['post'], context?.previousPost);
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      // Refetch the posts query after mutation
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
