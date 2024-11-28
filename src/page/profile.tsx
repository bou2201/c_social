'use client';

import { getUserByUsername, updateUserBanner } from '@/actions/user.action';
import { DisplayTabs, DisplayTabsProps } from '@/components/display-handler';
import { Button } from '@/components/ui';
import { Breakpoint } from '@/constants';
import { useToast, useWindowSize } from '@/hooks';
import { ProfileAvatarDialog, ProfilePost, ProfileSkeleton } from '@/modules/profile';
import { useUser } from '@clerk/nextjs';
import { File } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Plus } from 'lucide-react';
import { CldUploadButton } from 'next-cloudinary';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMemo, useState } from 'react';

const LightboxDynamic = dynamic(() => import('@/components/images').then((res) => res.Lightbox));

export const ProfileComponent = ({ username }: { username: string }) => {
  const [openUpdateAvatar, setOpenUpdateAvatar] = useState<boolean>(false);
  const [openLbWallpaper, setOpenLbWallpaper] = useState<boolean>(false);
  const [openLbAvatar, setOpenLbAvatar] = useState<boolean>(false);

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

  const isCurrentUser = String(profile?.data?.id) === user?.id;

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

  const renderWallpaper = () => {
    const { banner_id, banner_url } = profile?.data || {};

    const renderUploadButton = (label: string) => (
      <CldUploadButton
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS}
        onSuccessAction={({ event, info }) => {
          if (info) {
            const newBanner = {
              userId: profile?.data?.id as string,
              file: info as unknown as File,
              oldBannerId: profile?.data?.banner_id as string,
            };
            executeUpdateBanner(newBanner);
          }
        }}
      >
        <Button
          variant="outline"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Plus className="w-4 h-4 mr-2" /> {label}
        </Button>
      </CldUploadButton>
    );

    if (banner_id && banner_url) {
      return (
        <div className="relative h-60 w-full group">
          <Image
            src={banner_url}
            alt="Wallpaper Image"
            objectFit="cover"
            priority
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover cursor-pointer"
            onClick={() => setOpenLbWallpaper(true)}
          />
          {isCurrentUser && renderUploadButton('Đổi ảnh bìa')}
        </div>
      );
    }

    return isCurrentUser ? (
      <div className="relative h-60 w-full group">{renderUploadButton('Thêm ảnh bìa')}</div>
    ) : null;
  };

  return (
    <>
      <div className="bg-csol_white_foreground dark:bg-csol_black_foreground w-full flex flex-col sm:rounded-2xl border-csol_black/10 dark:border-csol_white/10 border-[1px] overflow-hidden">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <div className="relative h-60 bg-csol_black/10 dark:bg-csol_black/50">
              {renderWallpaper()}
              <div className="absolute -bottom-[84px] max-sm:left-4 left-6 max-sm:right-4 right-6 flex justify-between">
                <div></div>
                <div className="h-28 w-28 rounded-full overflow-hidden">
                  <Image
                    src={profile?.data?.image_url ?? ''}
                    alt={`avatar-${profile?.data?.username}`}
                    objectFit="cover"
                    priority
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-full w-full object-cover cursor-pointer"
                    onClick={() => setOpenLbAvatar(true)}
                  />
                </div>
                {isCurrentUser && (
                  <Button
                    variant="outline"
                    className="absolute bottom-1 right-0 w-9 h-9 rounded-full p-1"
                    onClick={() => setOpenUpdateAvatar(true)}
                  >
                    <Camera className="w-4 h-4 opacity-80" />
                  </Button>
                )}
              </div>
            </div>

            <div className="max-sm:py-4 py-5 max-sm:px-4 px-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl max-sm:text-lg font-semibold opacity-80 truncate max-w-72 max-sm:max-w-44">
                  {getFullname()}
                </h3>
              </div>
              <span className="opacity-70 text-sm hover:underline">@{profile?.data?.username}</span>
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

      {/* Lightbox preview wallpaper */}
      <LightboxDynamic
        slides={[{ src: profile?.data?.banner_url ?? '' }]}
        open={openLbWallpaper}
        index={0}
        close={() => setOpenLbWallpaper(false)}
      />

      {/* Lightbox preview avatar */}
      <LightboxDynamic
        slides={[{ src: profile?.data?.image_url ?? '' }]}
        open={openLbAvatar}
        index={0}
        close={() => setOpenLbAvatar(false)}
      />

      {openUpdateAvatar && (
        <ProfileAvatarDialog
          profile={profile}
          open={openUpdateAvatar}
          setOpen={setOpenUpdateAvatar}
        />
      )}
    </>
  );
};
