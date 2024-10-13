'use client';

import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Button, Skeleton } from '@/components/ui';
import { PostDetails } from '../types/post-response.type';
import { getShortName } from '@/utils/func';
import dayjs from '@/lib/dayjs';
import { Ellipsis } from 'lucide-react';
import { Gallery } from 'react-grid-gallery';
import dynamic from 'next/dynamic';

const LightboxDynamic = dynamic(() => import('@/components/images').then((res) => res.Lightbox));

export const Post = ({ data, queryId }: { data: PostDetails; queryId: string }) => {
  const { author, content, files, createdAt } = data;

  const [imageIndex, setImageIndex] = useState<number>(-1);

  const getImages = useMemo(() => {
    return files.map((file) => ({ src: file.url, width: file.width, height: file.height }));
  }, [files]);

  const handleClick = (index: number) => setImageIndex(index);

  return (
    <div className="py-5 px-6 border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]">
      <div className="flex justify-start items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={author.image_url ?? ''} />
          <AvatarFallback>
            {getShortName(`${author.first_name} ${author.last_name}`)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <b className="text-[15px] opacity-75">{author?.username}</b>
              <span className="text-csol_black/50 dark:text-csol_white/50 text-sm font-medium">
                • {dayjs(createdAt).fromNow(true)}
              </span>
            </div>

            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Ellipsis className="w-4 h-4 opa" />
            </Button>
          </div>
          <p className="text-[15px] mb-3">{content}</p>

          <Gallery
            images={getImages}
            onClick={handleClick}
            enableImageSelection={false}
            maxRows={1}
          />
          <LightboxDynamic
            slides={getImages}
            open={imageIndex >= 0}
            index={imageIndex}
            close={() => setImageIndex(-1)}
          />
        </div>
      </div>
    </div>
  );
};

export const PostSkeleton = ({ postNumber }: { postNumber?: number }) => {
  return (
    <div className="py-5 px-6 border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]">
      <div className="flex justify-start items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
};
