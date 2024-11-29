'use client';

import { DisplayTooltip } from '@/components/display-handler';
import { InputTextArea } from '@/components/form-handler';
import { CldImage, CldVideoPlayer } from '@/components/images';
import { Avatar, AvatarImage, Button, Form } from '@/components/ui';
import { Message } from '@/constants';
import { PostDetailsResponse } from '@/modules/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums, File } from '@prisma/client';
import { Images, SendHorizontal, X } from 'lucide-react';
import { CldUploadButton, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const commentFormSchema = z.object({
  content: z
    .string({ message: Message.required })
    .min(1, Message.required)
    .max(3000, 'Tối đa 3000 ký tự.'),
  file: z
    .object({
      id: z.string(),
      asset_id: z.string(),
      public_id: z.string(),
      resource_type: z.nativeEnum($Enums.FileType).default('IMAGE'),
      secure_url: z.string(),
      signature: z.string(),
      thumbnail_url: z.string(),
      url: z.string(),
      path: z.string(),
      width: z.number(),
      height: z.number(),
      postId: z.number().nullable().default(null),
    })
    .optional(),
});

export type CommentFormSchemaType = z.infer<typeof commentFormSchema>;

type CommentFormProps = {
  postDetails: PostDetailsResponse;
};

export const CommentForm = ({ postDetails }: CommentFormProps) => {
  const [focusInput, setFocusInput] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { author } = postDetails;

  const form = useForm<CommentFormSchemaType>({
    resolver: zodResolver(commentFormSchema),
    values: {
      content: '',
      file: undefined,
    },
  });

  const fileWatch = form.watch('file');

  const handleUploadActionSuccess = ({
    event,
    info,
  }: {
    event: string | undefined;
    info: string | CloudinaryUploadWidgetInfo | undefined;
  }) => {
    const dataReturn = info as unknown as CloudinaryUploadWidgetInfo;

    const file: File = {
      path: dataReturn.path,
      id: dataReturn.id,
      asset_id: dataReturn.asset_id,
      public_id: dataReturn.public_id,
      resource_type: dataReturn.resource_type.toUpperCase() as $Enums.FileType,
      secure_url: dataReturn.secure_url,
      signature: dataReturn.signature ?? '',
      thumbnail_url: dataReturn.thumbnail_url ?? '',
      url: dataReturn.url,
      width: dataReturn.width,
      height: dataReturn.height,
      postId: null,
    };

    form.setValue('file', file, { shouldDirty: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setFocusInput(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener on unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {})} ref={formRef} className="sticky bottom-6">
        <div className="flex flex-1 justify-start items-start gap-3">
          <Avatar>
            <AvatarImage src={author?.image_url ?? ''} className="object-cover" />
          </Avatar>
          <div className="flex-1 bg-csol_white dark:bg-csol_black py-2 px-4 rounded-xl">
            <InputTextArea<CommentFormSchemaType>
              name="content"
              textareaProps={{
                className: `p-0 !mt-[2px] border-none focus-visible:ring-0 transition-all ease-out shadow-none ${
                  !focusInput ? 'min-h-[22px]' : 'min-h-8'
                }`,
                placeholder: 'Viết bình luận',
                maxLength: 2000,
                style: {
                  height: !focusInput ? '22px' : '32px',
                },
                onFocus: () => setFocusInput(true),
              }}
            />

            {focusInput && (
              <>
                {fileWatch && (
                  <div className="relative mt-2 w-fit">
                    {fileWatch.resource_type === $Enums.FileType.VIDEO ? (
                      <CldVideoPlayer
                        src={fileWatch.public_id}
                        width={160}
                        height={160}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <CldImage
                        src={fileWatch.public_id}
                        alt={`Uploaded file`}
                        width={160}
                        height={160}
                        unoptimized
                        className="object-cover rounded-md"
                      />
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        form.setValue('file', undefined, { shouldDirty: true, shouldTouch: true });
                      }}
                      className="absolute top-2 right-2 w-7 h-7"
                    >
                      <X className="w-4 h-4 opacity-50" />
                    </Button>
                  </div>
                )}

                <div className="flex justify-between items-center gap-3 mt-3">
                  <CldUploadButton
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS}
                    onSuccessAction={({ event, info }) =>
                      handleUploadActionSuccess({ event, info })
                    }
                  >
                    <DisplayTooltip content="Ảnh/video">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="w-5 h-5 opacity-50"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Images />
                      </Button>
                    </DisplayTooltip>
                  </CldUploadButton>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="submit"
                    className="w-5 h-5 opacity-80"
                    onClick={(e) => e.preventDefault()}
                    disabled={!form.formState.isDirty}
                  >
                    <SendHorizontal />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
