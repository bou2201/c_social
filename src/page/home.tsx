'use client';

import { getUserByUsername } from '@/actions/user.action';
import BackToTop from '@/app/back-to-top';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { Router } from '@/constants';
import { PostDialog, PostList, postSelectors } from '@/modules/post';
import { getShortName } from '@/utils/func';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export const HomeComponent = () => {
  const { user } = useUser();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.username],
    queryFn: () => getUserByUsername(user?.username as string),
  });

  const openPostDialog = postSelectors.isOpen();
  const setOpenPostDialog = postSelectors.setIsOpen();

  return (
    <>
      <caption className="w-full flex justify-center font-bold opacity-80 text-sm mb-5">
        Bảng tin
      </caption>

      <div className="bg-csol_white_foreground dark:bg-csol_black_foreground w-full flex flex-col sm:rounded-2xl border-csol_black/10 dark:border-csol_white/10 border-[1px]">
        {/* Top */}
        {user && (
          <div className="max-sm:py-4 py-5 max-sm:px-4 px-6 flex justify-between items-center">
            <div className="flex items-center gap-5 flex-1">
              <Link href={`${Router.ProfilePage}/${user?.username}`}>
                <Avatar>
                  <AvatarImage src={profile?.data?.image_url ?? ''} className="object-cover" />
                  <AvatarFallback>{getShortName(user?.fullName ?? '')}</AvatarFallback>
                </Avatar>
              </Link>
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
        )}

        <PostList id="all" />
      </div>

      <BackToTop />

      {openPostDialog && <PostDialog open={openPostDialog} setOpen={setOpenPostDialog} />}
    </>
  );
};
