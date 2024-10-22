import { Button } from '@/components/ui';
import { MessageCircle } from 'lucide-react';

export const Comment = () => {
  return (
    <Button variant="ghost" size="icon" className="gap-1 px-2 w-auto">
      <MessageCircle className={`w-[18px] h-[18px] opacity-80 flex-shrink-0`} />
    </Button>
  );
};
