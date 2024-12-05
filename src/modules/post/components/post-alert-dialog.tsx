import { DisplayAlertDialog } from '@/components/display-handler';
import { memo } from 'react';

type AlertDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
};

export const PostAlertDeleteFile = memo((props: AlertDialogProps) => {
  return (
    <DisplayAlertDialog
      title="Xóa ảnh"
      description="Bạn có chắc muốn xóa ảnh này?"
      isLoading={props.isLoading}
      {...props}
    />
  );
});

PostAlertDeleteFile.displayName = PostAlertDeleteFile.name;

export const PostAlertDialog = memo((props: AlertDialogProps) => {
  return (
    <DisplayAlertDialog
      title="Huỷ"
      description="Bạn có chắc muốn huỷ thông tin bài đăng?"
      {...props}
    />
  );
});

PostAlertDialog.displayName = PostAlertDialog.name;

export const PostAlertDeletePost = memo((props: AlertDialogProps) => {
  return <DisplayAlertDialog title="Huỷ" description="Bạn có chắc muốn gỡ bài viết?" {...props} />;
});

PostAlertDeletePost.displayName = PostAlertDeletePost.name;
