import { DisplayAlertDialog } from '@/components/display-handler';
import { memo } from 'react';

export const PostAlertDialog = memo(
  (props: { open: boolean; setOpen: (open: boolean) => void; onSubmit?: () => void }) => {
    return (
      <DisplayAlertDialog
        title="Huỷ"
        description="Bạn có chắc muốn huỷ thông tin bài đăng?"
        {...props}
      />
    );
  },
);

PostAlertDialog.displayName = PostAlertDialog.name;

export const PostAlertDeletePost = memo(
  (props: { open: boolean; setOpen: (open: boolean) => void; onSubmit?: () => void }) => {
    return (
      <DisplayAlertDialog title="Huỷ" description="Bạn có chắc muốn gỡ bài viết?" {...props} />
    );
  },
);

PostAlertDeletePost.displayName = PostAlertDeletePost.name;
