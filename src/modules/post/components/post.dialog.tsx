'use client';

import { DisplayDialog, DisplayTooltip } from '@/components/display-handler';
import { Avatar, AvatarFallback, AvatarImage, Button, Form } from '@/components/ui';
import { Message } from '@/constants';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getShortName } from '@/utils/func';
import { InputTextArea } from '@/components/form-handler';
import { Images, Smile, X } from 'lucide-react';
import { CldUploadButton, CldVideoPlayer, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { $Enums, File } from '@prisma/client';
import { CldImage } from '@/components/images';
import { deleteFile, deleteFiles } from '@/actions/upload.action';
import { PostAlertDialog } from './post-alert.dialog';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, updatePost } from '@/actions/post.action';
import { postSelectors } from '../post.store';

const postFormSchema = z.object({
  content: z
    .string({ message: Message.required })
    .min(1, Message.required)
    .max(3000, 'Tối đa 3000 ký tự.'),
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
        width: z.number(),
        height: z.number(),
        postId: z.number().nullable().default(null),
      }),
    )
    .optional(),
});

export type PostFormSchemaType = z.infer<typeof postFormSchema>;

export const PostDialog = memo((props: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const postSelected = postSelectors.postSelected();
  const setPostSelected = postSelectors.setPostSelected();

  const form = useForm<PostFormSchemaType>({
    resolver: zodResolver(postFormSchema),
    values: {
      content: postSelected?.content ?? '',
      files: postSelected?.files ?? [],
    },
  });

  const { mutate: execute, isPending } = useMutation({
    mutationFn: (data: PostFormSchemaType) =>
      postSelected ? updatePost(postSelected.id, data) : createPost(data),
    onSuccess: () => {
      toast({
        title: postSelected ? 'Sửa tin thành công' : 'Đăng tin thành công',
        description: 'Cập nhật bài viết thành công.',
      });
      form.reset();
      props.setOpen(false);

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.log('🚀 ~ PostDialog ~ error:', error);
      toast({
        variant: 'destructive',
        title: 'Đăng tin thất bại',
        description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
      });
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
      width: dataReturn.width,
      height: dataReturn.height,
      postId: null,
    };

    form.setValue('files', [...(form.watch('files') ?? []), file], { shouldDirty: true });
  };

  const handleDeleteFile = async (path: string, public_id: string) => {
    const updatedFiles = filesWatch?.filter((file) => file.path !== path);
    form.setValue('files', updatedFiles, { shouldDirty: true, shouldTouch: true });

    if (!postSelected) {
      await deleteFile(public_id);
    }
  };

  const handleCloseDialog = () => {
    const { content, files } = form.formState.dirtyFields;
    const hasUnsavedChanges = content || files;

    if (hasUnsavedChanges) {
      if (!postSelected) {
        setOpenConfirmDelete(true);
      } else {
        setPostSelected(null);
        form.reset();
        props.setOpen(false);
      }
    } else {
      setPostSelected(null);
      form.reset();
      props.setOpen(false);
    }
  };

  return (
    <>
      <DisplayDialog
        {...props}
        title={`${postSelected ? 'Sửa tin' : 'Đăng tin'}`}
        headerClass="!text-center"
        contentClass="max-w-xl"
        modal={false}
        onClose={handleCloseDialog}
      >
        <Form {...form}>
          <form
            id="post-form"
            onSubmit={form.handleSubmit((data) => execute(data))}
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
                  // disableMessage
                  textareaProps={{
                    className: 'p-0 !mt-1 border-none focus-visible:ring-0 shadow-none',
                    placeholder: 'Có gì mới ...',
                    maxLength: 2000,
                  }}
                />

                {filesWatch && filesWatch?.length > 0 && (
                  <div
                    className={`grid gap-3 mt-4`}
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(
                        filesWatch.length,
                        3,
                      )}, minmax(0, 1fr))`,
                    }}
                  >
                    {filesWatch.map((file, index) => (
                      <div key={file.asset_id} className="relative">
                        {file.resource_type === $Enums.FileType.VIDEO ? (
                          <CldVideoPlayer
                            src={file.public_id}
                            width={300}
                            height={300}
                            className="w-full object-cover rounded-md"
                          />
                        ) : (
                          <CldImage
                            src={file.public_id}
                            alt={`Uploaded file ${index + 1}`}
                            width={300}
                            height={300}
                            crop="fill"
                            className="w-full object-cover rounded-md"
                          />
                        )}

                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteFile(file.path, file.public_id);
                          }}
                          className="absolute top-2 right-2 w-7 h-7"
                        >
                          <X className="w-4 h-4 opacity-50" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-start items-center gap-3 mt-4">
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
              <Button
                variant="default"
                type="submit"
                disabled={!form.watch('content') || isPending || !form.formState.isDirty}
                isLoading={isPending}
              >
                {postSelected ? 'Cập nhật' : 'Đăng'}
              </Button>
            </div>
          </form>
        </Form>
      </DisplayDialog>

      {openConfirmDelete && (
        <PostAlertDialog
          open={openConfirmDelete}
          setOpen={setOpenConfirmDelete}
          onSubmit={async () => {
            form.reset();
            props.setOpen(false);

            const public_ids = filesWatch?.map((file) => file.public_id);
            if (public_ids) {
              await deleteFiles(public_ids);
            }
          }}
        />
      )}
    </>
  );
});

PostDialog.displayName = PostDialog.name;
