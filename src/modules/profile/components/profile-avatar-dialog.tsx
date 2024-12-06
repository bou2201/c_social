'use client';

import { getUserByUsername, updateUserAvatar } from '@/actions/user.action';
import { DisplayDialog } from '@/components/display-handler';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks';
import { File } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CloudUpload } from 'lucide-react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { memo, useState } from 'react';

type ProfileAvatarDialogProps = {
  profile: Awaited<ReturnType<typeof getUserByUsername>>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ProfileAvatarDialog = memo(({ open, setOpen, profile }: ProfileAvatarDialogProps) => {
  const { id, image_url, username } = profile?.data ?? {};

  const [file, setFile] = useState<File>();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: executeUpdateAvatar, isPending } = useMutation({
    mutationFn: (params: { userId: string; file: File }) =>
      updateUserAvatar(params.userId, params.file),
    onSuccess: () => {
      toast({
        title: 'Cập nhật ảnh đại diện thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['profile', username] });

      setFile(undefined);
      setOpen(false);

      location.reload();
    },
    onError: (error) => {
      console.log('🚀 ~ ProfileAvatarDialog ~ error:', error);
      toast({
        variant: 'destructive',
        title: 'Cập nhật ảnh đại diện thất bại',
        description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
      });
    },
  });

  return (
    <DisplayDialog
      title="Ảnh đại diện"
      headerClass="!text-center"
      contentClass="max-w-xl"
      modal={false}
      open={open}
      setOpen={setOpen}
      onClose={() => setOpen(false)}
    >
      <div className="w-full flex flex-col justify-center items-center gap-3 mt-3">
        <div className="h-36 w-36 rounded-full overflow-hidden">
          <Image
            src={file?.secure_url ?? (image_url as string)}
            alt="avatar"
            objectFit="cover"
            priority
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS}
          onSuccessAction={({ event, info }) => {
            setFile(info as unknown as File);
          }}
        >
          <Button variant="ghost">
            <CloudUpload className="w-4 h-4 mr-3" /> Tải ảnh lên
          </Button>
        </CldUploadButton>
      </div>

      <div className="w-full flex justify-end items-center gap-3 mt-5">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Đóng
        </Button>
        <Button
          variant="default"
          disabled={!file}
          isLoading={isPending}
          onClick={() => executeUpdateAvatar({ userId: id as string, file: file as File })}
        >
          Lưu
        </Button>
      </div>
    </DisplayDialog>
  );
});
ProfileAvatarDialog.displayName = ProfileAvatarDialog.name;
