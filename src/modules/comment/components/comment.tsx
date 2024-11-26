import { Button } from '@/components/ui';
import { Router } from '@/constants';
import { PostDetailsResponse } from '@/modules/post';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';

type CommentProps = {
  author: PostDetailsResponse['author'];
  postId: number;
};

export const Comment = ({ author, postId }: CommentProps) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="gap-1 px-2 w-auto"
      onClick={() => router.push(`${Router.ProfilePage}/${author.username}/${postId}`)}
    >
      <MessageCircle className={`w-[18px] h-[18px] opacity-80 flex-shrink-0`} />
    </Button>
  );
};
