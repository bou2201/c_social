'use client';

import { deletePost, getPost } from '@/actions/post.action';
import { DisplayDropdown, DisplayDropdownItemProps } from '@/components/display-handler';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { Router } from '@/constants';
import { getContent, getShortName } from '@/utils/func';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { postSelectors } from '../post.store';
import { PostResponse } from '../types/post-response.type';
import { Check, Ellipsis, FolderSearch, LinkIcon, MoveLeft, Pencil, Trash } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { LikeBtn } from '@/modules/like';
import { CommentBtn, CommentForm, CommentList } from '@/modules/comment';
import { PostDetailsSkeleton } from './post-skeleton';
import { PostDialog } from './post-dialog';
import { PostAlertDeletePost } from './post-alert-dialog';
import { useToast } from '@/hooks';
import { useRouter } from 'next-nprogress-bar';
import dynamic from 'next/dynamic';
import ScrollContainer from 'react-indiana-drag-scroll';
import { $Enums, Like as LikePris } from '@prisma/client';
import { CldImage, CldVideoPlayer } from '@/components/images';

const MAX_LENGTH_CONTENT = 400;

const LightboxDynamic = dynamic(() => import('@/components/images').then((res) => res.Lightbox));

export const PostDetails = ({ postId }: { postId: string }) => {
  const [imageIndex, setImageIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openUpdatePost, setOpenUpdatePost] = useState<boolean>(false);
  const [openDeletePost, setOpenDeletePost] = useState<boolean>(false);

  const setPostSelected = postSelectors.setPostSelected();

  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: postDetails, isPending } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(Number(postId)),
    staleTime: 0,
    gcTime: 0,
  });

  const { author, content, files, createdAt, likes, id, total_comment } = postDetails?.data ?? {};

  const { mutate: executeDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deletePost(id as number),
    onError: (error, variables, context) => {
      console.log('🚀 ~ PostDetails ~ error delete:', error);

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
      router.push(Router.Home);
    },
    onSettled: () => {
      // Refetch the posts query after mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const onCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      description: (
        <div className="flex justify-center items-center gap-3">
          <Check />
          <span>Đã sao chép liên kết.</span>
        </div>
      ),
    });
  }, [toast]);

  const getOptions = useMemo(() => {
    const userOptions: DisplayDropdownItemProps[] = [
      {
        content: 'Chỉnh sửa',
        key: 'update',
        onClick: () => {
          setPostSelected(postDetails?.data as unknown as PostResponse);
          setOpenUpdatePost(true);
        },
        icon: <Pencil className="w-4 h-4 opacity-80" />,
      },
      {
        content: <span className="text-csol_red">Gỡ bài viết</span>,
        key: 'delete',
        onClick: () => {
          setOpenDeletePost(true);
        },
        icon: <Trash className="w-4 h-4 opacity-80 stroke-csol_red" />,
        isDivider: true,
      },
    ];

    const commonOptions: DisplayDropdownItemProps[] = [
      {
        content: 'Sao chép liên kết',
        key: 'copy-url',
        onClick: () => {
          onCopyUrl();
        },
        icon: <LinkIcon className="w-4 h-4 opacity-80" />,
      },
    ];

    if (postDetails?.data?.authorId === user?.id) {
      return [...userOptions, ...commonOptions];
    }

    return commonOptions;
  }, [onCopyUrl, postDetails, setPostSelected, user?.id]);

  return (
    <>
      {!isPending && (
        <div className="relative w-full flex justify-center items-center mb-5">
          <b
            className="opacity-80 text-sm hover:underline"
            onClick={() => router.replace(`${Router.ProfilePage}/${author?.username}`)}
          >
            @{author?.username}
          </b>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 rounded-full w-8 h-8"
            onClick={() => router.back()}
          >
            <MoveLeft className="w-4 h-4 opacity-70" />
          </Button>
        </div>
      )}

      <div className="bg-csol_white_foreground dark:bg-csol_black_foreground w-full flex flex-col sm:rounded-2xl border-csol_black/10 dark:border-csol_white/10 border-[1px]">
        {isPending ? (
          <PostDetailsSkeleton />
        ) : (
          <div className="max-sm:py-4 py-5 max-sm:px-4 px-6 min-h-[calc(100vh_-_140px)] flex flex-col relative">
            <div className="flex justify-start items-center gap-4 mb-4">
              <div className="flex flex-1 justify-start items-center gap-4">
                <Link href={`${Router.ProfilePage}/${author?.username}`}>
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={author?.image_url ?? ''} className="object-cover" />
                    <AvatarFallback>
                      {getShortName(`${author?.first_name} ${author?.last_name}`)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex items-center gap-1">
                  <b className="text-[15px] opacity-75">{author?.username}</b>
                  <span className="text-csol_black/50 dark:text-csol_white/50 text-sm font-medium">
                    • {dayjs(createdAt).fromNow(true)}
                  </span>
                </div>
              </div>

              <DisplayDropdown
                open={openDropdown}
                setOpen={setOpenDropdown}
                trigger={
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Ellipsis className="w-4 h-4 opacity-80" />
                  </Button>
                }
                items={getOptions}
                modal={false}
              />
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: getContent(String(content), isExpanded, MAX_LENGTH_CONTENT),
              }}
              className="text-[15px] opacity-90"
            ></div>

            {content && content.length > MAX_LENGTH_CONTENT && (
              <Button
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
                variant="link"
                className="p-0 font-bold opacity-80 justify-start"
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            )}

            {files && files?.length > 0 && (
              <ScrollContainer className="overflow-x-auto rounded-md mt-3">
                <div className="flex items-stretch gap-2">
                  {files.map((file, index) =>
                    file.resource_type === $Enums.FileType.VIDEO ? (
                      <CldVideoPlayer
                        src={file.public_id}
                        key={file.public_id}
                        id={`video-player-${file.public_id}`}
                        width={250}
                        height={250}
                        className="min-h-[300px] min-w-[270px] w-auto object-cover rounded-md cursor-pointer"
                        transformation={{
                          streaming_profile: 'hd',
                        }}
                        sourceTypes={['hls']}
                      />
                    ) : (
                      <CldImage
                        src={file.public_id}
                        alt={`images - ${index}`}
                        key={file.public_id}
                        width={250}
                        height={250}
                        className="h-[300px] w-auto object-cover rounded-md cursor-pointer"
                        onClick={() => setImageIndex(index)}
                        quality={100}
                        priority
                      />
                    ),
                  )}
                </div>
              </ScrollContainer>
            )}

            <LightboxDynamic
              slides={files?.map((file) => {
                if (file.resource_type === $Enums.FileType.VIDEO) {
                  return {
                    type: 'video',
                    width: file.width,
                    height: file.height,
                    poster: file.thumbnail_url,
                    sources: [
                      {
                        src: file.url,
                        type: 'video/mp4',
                      },
                    ],
                    download: `${file.url}?download`,
                  };
                }
                return {
                  src: file.url,
                  width: file.width,
                  height: file.height,
                  download: `${file.url}?download`,
                };
              })}
              open={imageIndex >= 0}
              index={imageIndex}
              close={() => setImageIndex(-1)}
            />

            <div className="flex items-center py-3 gap-3 border-b-csol_black/10 dark:border-b-csol_white/10 border-b-[1px]">
              <LikeBtn likes={likes as LikePris[]} postId={id as number} queryId={postId} />
              <CommentBtn
                author={author as PostResponse['author']}
                postId={id as number}
                totalComment={total_comment as number}
              />
              <Button variant="ghost" size="icon" className="gap-1 px-2 w-auto" onClick={onCopyUrl}>
                <LinkIcon className={`w-[18px] h-[18px] opacity-80 flex-shrink-0`} />
              </Button>
            </div>

            {total_comment && total_comment > 0 ? (
              <CommentList postId={id as number} key={id} />
            ) : (
              <section className="flex-1 flex flex-col justify-center items-center gap-4 min-h-40">
                <FolderSearch className="w-16 h-16 opacity-60" />
                <span className="text-sm">Chưa có bình luận nào.</span>
              </section>
            )}

            <CommentForm postDetails={postDetails?.data as PostResponse} />
          </div>
        )}
      </div>

      {openUpdatePost && <PostDialog open={openUpdatePost} setOpen={setOpenUpdatePost} />}

      <PostAlertDeletePost
        open={openDeletePost}
        setOpen={setOpenDeletePost}
        onSubmit={executeDelete}
        isLoading={isDeletePending}
      />
    </>
  );
};
