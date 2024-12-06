'use client';

import { Like as LikePris } from '@prisma/client';
import { useToggleLikePost, useToggleLikePostDetails } from '../hooks';
import { memo, useState } from 'react';
import { Button } from '@/components/ui';
import { Heart } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { getNumberFormat } from '@/utils/func';
import DrawerAlertAuth from '@/app/drawer-alert-auth';

type LikeBtnProps = {
  queryId: string;
  likes: LikePris[];
  postId: number;
};

export const LikeBtn = memo(({ queryId, likes, postId }: LikeBtnProps) => {
  const [openAlertAuth, setOpenAlertAuth] = useState<boolean>(false);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  const { mutate: mutateLikePost } = useToggleLikePost(queryId);
  const { mutate: mutateLikePostDetails, isPending: isPendingDetails } =
    useToggleLikePostDetails(queryId);
  const { user } = useUser();

  const isLiked = likes.some((like) => like.authorId === user?.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();

    if (user) {
      // Trigger bounce animation only if the post is going to be liked
      if (!isLiked) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 500); // Reset bounce animation after 0.5s
      }

      if (Number(queryId) === postId) {
        mutateLikePostDetails({ postId, isLiked });
      } else {
        mutateLikePost({ postId, isLiked });
      }
    } else {
      setOpenAlertAuth(true);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="gap-1 px-2 w-auto"
        onClick={handleLike}
        style={{ cursor: isPendingDetails ? 'wait' : 'pointer' }}
        disabled={isPendingDetails}
      >
        <Heart
          className={`w-[18px] h-[18px] flex-shrink-0 ${
            isLiked ? 'fill-csol_red stroke-csol_red' : 'opacity-80'
          } ${isBouncing ? 'animate-bounce' : ''}`}
        />
        {likes?.length > 0 && <span className="opacity-70">{getNumberFormat(likes?.length)}</span>}
      </Button>

      <DrawerAlertAuth open={openAlertAuth} setOpen={setOpenAlertAuth} />
    </>
  );
});

LikeBtn.displayName = LikeBtn.name;
