'use client';

import { useMemo, useState } from 'react';
import { CommentResponse } from '../types/comment-response.type';
import { Router } from '@/constants';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { getContent, getShortName } from '@/utils/func';
import Link from 'next/link';
import dayjs from 'dayjs';
import { DisplayDropdown, DisplayDropdownItemProps } from '@/components/display-handler';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { $Enums } from '@prisma/client';
import { CldImage, CldVideoPlayer } from '@/components/images';

const LightboxDynamic = dynamic(() => import('@/components/images').then((res) => res.Lightbox));

const MAX_LENGTH_CONTENT = 400;

type CommentItemProps = {
  data: CommentResponse;
  postId: number;
  index: number;
};

export const CommentItem = ({ data, postId, index }: CommentItemProps) => {
  const [imageIndex, setImageIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const router = useRouter();
  const { author, comment, file, createdAt } = data;

  const getOptions = useMemo(() => {
    const userOptions: DisplayDropdownItemProps[] = [
      {
        content: 'Chỉnh sửa',
        key: 'update',
        onClick: () => {},
        icon: <Pencil className="w-4 h-4 opacity-80" />,
      },
      {
        content: <span className="text-csol_red">Gỡ bình luận</span>,
        key: 'delete',
        onClick: () => {},
        icon: <Trash className="w-4 h-4 opacity-80 stroke-csol_red" />,
      },
    ];

    return userOptions;
  }, []);

  return (
    <div
      className={`max-sm:py-4 py-5 ${
        index !== 0 ? 'border-t-csol_black/10 dark:border-t-csol_white/10 border-t-[1px]' : ''
      }`}
    >
      <div className="flex justify-start items-start gap-4">
        <Link href={`${Router.ProfilePage}/${author.username}`}>
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={author.image_url ?? ''} className="object-cover" />
            <AvatarFallback>
              {getShortName(`${author.first_name} ${author.last_name}`)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              <b
                className="text-[15px] opacity-75 hover:underline cursor-pointer"
                onClick={() => router.push(`${Router.ProfilePage}/${author.username}`)}
              >
                {author?.username}
              </b>
              <span className="text-csol_black/50 dark:text-csol_white/50 text-sm font-medium">
                • {dayjs(createdAt).fromNow(true)}
              </span>
            </div>

            <DisplayDropdown
              open={openDropdown}
              setOpen={setOpenDropdown}
              trigger={
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <Ellipsis className="w-4 h-4 opacity-80" />
                </Button>
              }
              items={getOptions}
              modal={false}
            />
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: getContent(comment as string, isExpanded, MAX_LENGTH_CONTENT),
            }}
            className="text-[15px] opacity-90"
          ></div>

          {comment && comment.length > MAX_LENGTH_CONTENT && (
            <Button
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
              variant="link"
              className="p-0 font-bold opacity-80"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          )}

          {file && file.resource_type === $Enums.FileType.VIDEO && (
            <CldVideoPlayer
              src={file.public_id}
              key={file.public_id}
              id={`video-player-${file.public_id}`}
              width={250}
              height={250}
              className="min-h-[300px] min-w-[270px] w-auto object-cover rounded-md cursor-pointer mt-2"
              transformation={{
                streaming_profile: 'hd',
              }}
              sourceTypes={['hls']}
            />
          )}

          {file && file.resource_type === $Enums.FileType.IMAGE && (
            <CldImage
              src={file.public_id}
              alt={`images - ${file.public_id}`}
              key={file.public_id}
              width={250}
              height={250}
              className="h-[300px] w-auto object-cover rounded-md cursor-pointer mt-2"
              onClick={() => setImageIndex(0)}
              unoptimized
              priority
            />
          )}

          {file && (
            <LightboxDynamic
              slides={
                file.resource_type === $Enums.FileType.VIDEO
                  ? [
                      {
                        type: 'video',
                        width: file.width,
                        height: file.height,
                        poster: file.thumbnail_url,
                        sources: [
                          {
                            src: file.url,
                            type: 'video/mp4',
                          },
                        ],
                        download: `${file.url}?download`,
                      },
                    ]
                  : [
                      {
                        src: file.url,
                        width: file.width,
                        height: file.height,
                        download: `${file.url}?download`,
                      },
                    ]
              }
              open={imageIndex >= 0}
              index={imageIndex}
              close={() => setImageIndex(-1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
