import { Button } from '@/components/ui';
import { Router } from '@/constants';
import { PostResponse } from '@/modules/post';
import { getNumberFormat } from '@/utils/func';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';

type CommentBtnProps = {
  author: PostResponse['author'];
  postId: number;
  totalComment: number;
};

export const CommentBtn = ({ author, postId, totalComment }: CommentBtnProps) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="gap-1 px-2 w-auto"
      onClick={() => router.push(`${Router.ProfilePage}/${author.username}/${postId}`)}
    >
      <MessageCircle className={`w-[18px] h-[18px] opacity-80 flex-shrink-0`} />
      {totalComment > 0 && <span className="opacity-70">{getNumberFormat(totalComment)}</span>}
    </Button>
  );
};
