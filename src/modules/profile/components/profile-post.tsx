'use client';

import { getUserByUsername } from '@/actions/user.action';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { PostDialog, PostList, postSelectors } from '@/modules/post';
import { getShortName } from '@/utils/func';
import { useUser } from '@clerk/nextjs';

export const ProfilePost = ({
  profile,
}: {
  profile: Awaited<ReturnType<typeof getUserByUsername>>;
}) => {
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
                <AvatarImage src={profile?.data?.image_url as string} className="object-cover" />
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
