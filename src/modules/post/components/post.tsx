'use client';

import { useCallback, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Button, Skeleton } from '@/components/ui';
import { GetPostResponse, PostDetails } from '../types/post-response.type';
import { getContent, getShortName } from '@/utils/func';
import dayjs from '@/lib/dayjs';
import { Ellipsis, LinkIcon, Pencil, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DisplayDropdown, DisplayDropdownItemProps } from '@/components/display-handler';
import { useUser } from '@clerk/nextjs';
import { postSelectors } from '../post.store';
import { PostDialog } from './post.dialog';
import { PostAlertDeletePost } from './post-alert.dialog';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/actions/post.action';
import { useToast } from '@/hooks';
import { CldImage } from '@/components/images';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Like } from '@/modules/like';
import { Comment } from '@/modules/comment';

const LightboxDynamic = dynamic(() => import('@/components/images').then((res) => res.Lightbox));

const MAX_LENGTH_CONTENT = 300;

export const Post = ({ data, queryId }: { data: PostDetails; queryId: string }) => {
  const { author, content, files, createdAt, likes, id } = data;

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [imageIndex, setImageIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openUpdatePost, setOpenUpdatePost] = useState<boolean>(false);
  const [openDeletePost, setOpenDeletePost] = useState<boolean>(false);

  const setPostSelected = postSelectors.setPostSelected();

  const getImages = useMemo(() => {
    return files.map((file) => ({ src: file.url, width: file.width, height: file.height }));
  }, [files]);

  const getOptions = useMemo(() => {
    const userOptions: DisplayDropdownItemProps[] = [
      {
        content: 'Chỉnh sửa',
        key: 'update',
        onClick: () => {
          setPostSelected(data);
          setOpenUpdatePost(true);
        },
        icon: <Pencil className="w-4 h-4 opacity-80" />,
      },
      {
        content: 'Gỡ bài viết',
        key: 'delete',
        onClick: () => {
          setOpenDeletePost(true);
        },
        icon: <Trash className="w-4 h-4 opacity-80" />,
        isDivider: true,
      },
    ];

    const commonOptions: DisplayDropdownItemProps[] = [
      {
        content: 'Sao chép liên kết',
        key: 'copy-url',
        onClick: () => {},
        icon: <LinkIcon className="w-4 h-4 opacity-80" />,
      },
    ];

    if (data.authorId === user?.id) {
      return [...userOptions, ...commonOptions];
    }

    return commonOptions;
  }, [data, setOpenUpdatePost, setPostSelected, user?.id]);

  const { mutate: executeDelete } = useMutation({
    mutationFn: () => deletePost(data.id),
    onMutate: async () => {
      // Cancel any outgoing refetches to prevent conflicts
      await queryClient.cancelQueries({ queryKey: ['posts', queryId] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts', queryId]);

      // Optimistically update the cache to remove the deleted post
      queryClient.setQueryData(
        ['posts', queryId],
        (oldData: InfiniteData<GetPostResponse, unknown>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((post) => post.id !== data.id),
            })),
          };
        },
      );

      return { previousPosts };
    },
    onError: (error, variables, context) => {
      console.log('🚀 ~ Post ~ error delete:', error);
      // Rollback the cache to the previous value if the mutation fails
      queryClient.setQueryData(['posts'], context?.previousPosts);

      toast({
        variant: 'destructive',
        title: 'Xóa tin thất bại',
        description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Xóa tin thành công',
        description: 'Bài viết đã được xóa thành công.',
      });
    },
    onSettled: () => {
      setOpenDeletePost(false);
      // Refetch the posts query after mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <>
      <div className="max-sm:py-4 py-5 max-sm:px-4 px-6 border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]">
        <div className="flex justify-start items-start gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={author.image_url ?? ''} />
            <AvatarFallback>
              {getShortName(`${author.first_name} ${author.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1">
                <b className="text-[15px] opacity-75">{author?.username}</b>
                <span className="text-csol_black/50 dark:text-csol_white/50 text-sm font-medium">
                  • {dayjs(createdAt).fromNow(true)}
                </span>
              </div>

              <DisplayDropdown
                open={openDropdown}
                setOpen={setOpenDropdown}
                trigger={
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Ellipsis className="w-4 h-4 opa" />
                  </Button>
                }
                items={getOptions}
                modal={false}
              />
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: getContent(content as string, isExpanded, MAX_LENGTH_CONTENT),
              }}
              className="text-[15px]"
            ></div>

            {content && content.length > MAX_LENGTH_CONTENT && (
              <Button
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
                variant="link"
                className="p-0 font-bold opacity-80"
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            )}

            {files.length > 0 && (
              <ScrollContainer className="overflow-x-auto rounded-md mt-3">
                <div className="flex items-stretch gap-2">
                  {files.map((file, index) => (
                    <CldImage
                      src={file.public_id}
                      alt={`images - ${index}`}
                      key={file.public_id}
                      width={250}
                      height={250}
                      className="h-[260px] w-auto object-cover rounded-md cursor-pointer"
                      onClick={() => setImageIndex(index)}
                      quality={100}
                      loading="lazy"
                    />
                  ))}
                </div>
              </ScrollContainer>
            )}

            <LightboxDynamic
              slides={getImages}
              open={imageIndex >= 0}
              index={imageIndex}
              close={() => setImageIndex(-1)}
            />

            <div className="flex items-center mt-3">
              <Like likes={likes} postId={id} queryId={queryId} />
              <Comment />
            </div>
          </div>
        </div>
      </div>

      {openUpdatePost && <PostDialog open={openUpdatePost} setOpen={setOpenUpdatePost} />}

      {openDeletePost && (
        <PostAlertDeletePost
          open={openDeletePost}
          setOpen={setOpenDeletePost}
          onSubmit={executeDelete}
        />
      )}
    </>
  );
};

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
