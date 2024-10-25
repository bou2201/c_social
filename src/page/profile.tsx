'use client';

import { getUserByUsername, updateUserBanner } from '@/actions/user.action';
import { DisplayTabs, DisplayTabsProps } from '@/components/display-handler';
import { Avatar, AvatarFallback, AvatarImage, Button, Skeleton } from '@/components/ui';
import { Breakpoint } from '@/constants';
import { useToast, useWindowSize } from '@/hooks';
import { PostDialog, PostList, postSelectors } from '@/modules/post';
import { getShortName } from '@/utils/func';
import { useUser } from '@clerk/nextjs';
import { File } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { useMemo } from 'react';

export const ProfileComponent = ({ username }: { username: string }) => {
  const { user } = useUser();
  const { width } = useWindowSize();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: executeUpdateBanner } = useMutation({
    mutationFn: (params: { userId: string; file: File; oldBannerId?: string }) =>
      updateUserBanner(params.userId, params.file, params.oldBannerId),
    onSuccess: () => {
      toast({
        title: 'Cập nhật ảnh bìa thành công',
        description: 'Banner của bạn đã được cập nhật thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
    onError: (error) => {
      console.log('🚀 ~ ProfileComponent ~ error:', error);
      toast({
        variant: 'destructive',
        title: 'Cập nhật ảnh bìa thất bại',
        description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
      });
    },
  });

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getUserByUsername(username),
  });

  const PROFILE_TABS: DisplayTabsProps['tabs'] = useMemo(() => {
    return [
      {
        value: 'posts',
        name: 'Bài viết',
        component: <ProfilePost profile={profile} />,
      },
      {
        value: 'followers',
        name: 'Người theo dõi',
        component: <>2</>,
      },
      {
        value: 'followings',
        name: 'Đang theo dõi',
        component: <>3</>,
      },
    ];
  }, [profile]);

  if (isError) {
    console.log('🚀 ~ ProfileComponent ~ isError:', isError);
  }

  const getFullname = () => {
    if (profile?.data?.first_name && profile?.data?.last_name) {
      return `${profile?.data?.first_name} ${profile?.data?.last_name}`;
    }
    return '...';
  };

  const renderWallPaper = () => {
    if (profile?.data?.banner_id && profile?.data?.banner_url) {
      return (
        <Image
          src={profile?.data?.banner_url}
          alt="Wallpaper Image"
          objectFit="cover"
          priority
          width={0}
          height={0}
          sizes="100vw"
          className="h-52 w-full object-cover"
        />
      );
    }

    if (profile?.data?.id === user?.id) {
      return (
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS}
          onSuccessAction={({ event, info }) => {
            const newBanner = {
              userId: profile?.data?.id as string,
              file: info as unknown as File,
              oldBannerId: profile?.data?.banner_id as string,
            };
            executeUpdateBanner(newBanner);
          }}
        >
          <Button
            variant="outline"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm ảnh bìa
          </Button>
        </CldUploadButton>
      );
    }
  };

  return (
    <div className="bg-csol_white_foreground dark:bg-csol_black_foreground w-full flex flex-col sm:rounded-2xl border-csol_black/10 dark:border-csol_white/10 border-[1px] overflow-hidden">
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="relative h-52 bg-csol_black/10 dark:bg-csol_black/50">
            {renderWallPaper()}
            <div className="absolute -bottom-[84px] max-sm:left-4 left-6 max-sm:right-4 right-6 flex justify-between">
              <div></div>
              <Image
                src={profile?.data?.image_url ?? ''}
                alt={`avatar-${profile?.data?.username}`}
                width={112}
                height={112}
                quality={100}
                priority
                className="object-cover rounded-full"
              />
            </div>
          </div>

          <div className="max-sm:py-4 py-5 max-sm:px-4 px-6">
            <h3 className="text-2xl font-semibold opacity-80">{getFullname()}</h3>
            <span className="opacity-70 text-sm">@{profile?.data?.username}</span>
          </div>

          <div className="pt-2 max-sm:px-4 px-6">
            <p className="opacity-80 text-[15px]">
              <b>0</b> người theo dõi
            </p>
          </div>

          <DisplayTabs
            tabs={PROFILE_TABS}
            block={Number(width) > Breakpoint.sm}
            classNameTabList="max-sm:py-4 py-5 max-sm:px-4 px-6"
          />
        </>
      )}
    </div>
  );
};

const ProfileSkeleton = () => {
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
    </>
  );
};

const ProfilePost = ({ profile }: { profile: Awaited<ReturnType<typeof getUserByUsername>> }) => {
  const { user } = useUser();
  const openPostDialog = postSelectors.isOpen();
  const setOpenPostDialog = postSelectors.setIsOpen();

  return (
    <>
      {profile?.data?.id === user?.id && (
        <>
          <div className="flex justify-between items-center pb-5 max-sm:px-4 px-6">
            <div className="flex items-center gap-5 flex-1">
              <Avatar>
                <AvatarImage src={profile?.data?.image_url as string} />
                <AvatarFallback>{getShortName(profile?.data?.username ?? '')}</AvatarFallback>
              </Avatar>
              <div className="w-full cursor-text">
                <p
                  className="opacity-60 mb-0 text-sm"
                  role="presentation"
                  onClick={() => {
                    if (!openPostDialog) setOpenPostDialog(true);
                  }}
                >
                  Có gì mới?
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                if (!openPostDialog) setOpenPostDialog(true);
              }}
            >
              Đăng
            </Button>
          </div>
          {openPostDialog && <PostDialog open={openPostDialog} setOpen={setOpenPostDialog} />}
        </>
      )}

      <PostList id={profile?.data?.id as string} />
    </>
  );
};
