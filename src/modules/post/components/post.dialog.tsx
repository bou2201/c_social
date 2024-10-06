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
import { Images, Smile, Trash } from 'lucide-react';
import { CldUploadButton, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { $Enums, File } from '@prisma/client';
import { CldImage } from '@/components/images';
import { deleteFile } from '@/actions/upload.action';

const postFormSchema = z.object({
  content: z
    .string({ message: Message.required })
    .min(1, Message.required)
    .max(100, 'Tối đa 100 ký tự.'),
  files: z
    .array(
      z.object({
        id: z.string(),
        asset_id: z.string(),
        public_id: z.string(),
        resource_type: z.nativeEnum($Enums.FileType).default('IMAGE'),
        secure_url: z.string(),
        signature: z.string(),
        thumbnail_url: z.string(),
        url: z.string(),
        path: z.string(),
      }),
    )
    .optional(),
});

export type PostFormSchemaType = z.infer<typeof postFormSchema>;

export const PostDialog = memo((props: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { user } = useUser();

  const form = useForm<PostFormSchemaType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: '',
      files: [],
    },
  });

  const filesWatch = form.watch('files');

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
      postId: null,
    };

    form.setValue('files', [...(form.watch('files') ?? []), file]);
  };

  const handleDeleteFile = async (path: string, public_id: string) => {
    const updatedFiles = filesWatch?.filter((file) => file.path !== path);
    form.setValue('files', updatedFiles);

    await deleteFile(public_id);
  };

  return (
    <DisplayDialog
      {...props}
      title="Đăng tin"
      headerClass="!text-center"
      contentClass="max-w-xl"
      modal={false}
    >
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

              {filesWatch && filesWatch?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {filesWatch.map((file, index) => (
                    <div key={file.asset_id} className="relative">
                      <CldImage
                        src={file.public_id}
                        alt={`Uploaded file ${index + 1}`}
                        width={300}
                        height={300}
                        crop="fill"
                        className="w-full h-24 object-cover rounded-md"
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteFile(file.path, file.public_id);
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7"
                      >
                        <Trash className="w-4 h-4 opacity-50" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-start items-center gap-3 mt-4">
                <CldUploadButton
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS}
                  onSuccessAction={({ event, info }) => handleUploadActionSuccess({ event, info })}
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
