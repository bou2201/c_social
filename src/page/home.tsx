'use client';

import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { Router } from '@/constants';
import { PostDialog } from '@/modules/post';
import { getShortName } from '@/utils/func';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

export const HomeComponent = () => {
  const [openPostDialog, setOpenPostDialog] = useState<boolean>(false);

  const { user } = useUser();

  return (
    <>
      <div className="bg-csol_white_foreground dark:bg-csol_black_foreground w-full flex flex-col sm:rounded-2xl border-csol_black/10 dark:border-csol_white/10 border-[1px]">
        {/* Top */}
        <div className="py-5 px-6 flex justify-between items-center">
          <div className="flex items-center gap-5 flex-1">
            <Link href={Router.Me}>
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{getShortName(user?.fullName ?? '')}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="w-full cursor-text">
              <p className="opacity-60 mb-0 text-sm" onClick={() => setOpenPostDialog(true)}>
                Có gì mới?
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={() => setOpenPostDialog(true)}>
            Đăng
          </Button>
        </div>
      </div>

      <PostDialog open={openPostDialog} setOpen={setOpenPostDialog} />
    </>
  );
};