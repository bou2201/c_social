'use client';

import { DisplayDialog, DisplayTooltip } from '@/components/display-handler';
import { Avatar, AvatarFallback, AvatarImage, Button, Form } from '@/components/ui';
import { Message } from '@/constants';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { useUser } from '@clerk/nextjs';
import { getShortName } from '@/utils/func';
import { InputTextArea } from '@/components/form-handler';
import { Images, Smile } from 'lucide-react';
import { CldUploadButton } from 'next-cloudinary';

const postFormSchema = z.object({
  content: z
    .string({ message: Message.required })
    .min(1, Message.required)
    .max(100, 'Tối đa 100 ký tự.'),
  // files:
});

type PostFormSchemaType = z.infer<typeof postFormSchema>;

export const PostDialog = memo((props: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { user } = useUser();

  const form = useForm<PostFormSchemaType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: '',
    },
  });

  return (
    <DisplayDialog {...props} title="Đăng tin" headerClass="!text-center" modal={false}>
      <Form {...form}>
        <form
          id="post-form"
          onSubmit={form.handleSubmit((data) => {})}
          className="flex flex-col gap-4 max-sm:h-full"
        >
          <div className="flex flex-1 justify-start items-start gap-3">
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{getShortName(user?.fullName ?? '')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <b className="text-[15px] font-semibold">{user?.username}</b>

              <InputTextArea<PostFormSchemaType>
                name="content"
                disableMessage
                textareaProps={{
                  className: 'p-0 !mt-1 border-none focus-visible:ring-0 shadow-none',
                  placeholder: 'Có gì mới ...',
                  maxLength: 2000,
                }}
              />

              <div className="flex justify-start items-center gap-3 mt-4">
                <CldUploadButton
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS}
                  onSuccessAction={({ event, info }) => {
                    console.log(event);
                    console.log(info);
                  }}
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

                <DisplayTooltip content="Cảm xúc">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="w-5 h-5 opacity-50"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Smile />
                  </Button>
                </DisplayTooltip>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="default" type="submit" disabled={!form.watch('content')}>
              Đăng
            </Button>
          </div>
        </form>
      </Form>
    </DisplayDialog>
  );
});

PostDialog.displayName = PostDialog.name;
