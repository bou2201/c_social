'use client';

import { Like as LikePris } from '@prisma/client';
import { useToggleLikePost } from '../hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { Heart } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

type LikeProps = {
  queryId: string;
  likes: LikePris[];
  postId: number;
};

export const Like = ({ queryId, likes, postId }: LikeProps) => {
  const { mutate } = useToggleLikePost(queryId);
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsLiked(likes.some((like) => like.authorId === user?.id));
  }, [likes, user?.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();

    // Trigger bounce animation only if the post is going to be liked
    if (!isLiked) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 500); // Reset bounce animation after 0.5s
    }

    mutate({ postId, isLiked });
  };

  return (
    <Button variant="ghost" size="icon" className="gap-1 px-2 w-auto" onClick={handleLike}>
      <Heart
        className={`w-[18px] h-[18px] flex-shrink-0 ${
          isLiked ? 'fill-csol_red stroke-csol_red' : 'opacity-80'
        } ${isBouncing ? 'animate-bounce' : ''}`}
      />
      {likes?.length > 0 && <span className="opacity-70">{likes?.length}</span>}
    </Button>
  );
};
