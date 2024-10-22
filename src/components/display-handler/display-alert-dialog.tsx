'use client';

import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
} from '../ui';
import { CornerTopLeftIcon } from '@radix-ui/react-icons';

type DisplayAlertDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: () => void;
  title: string | ReactNode;
  description?: string;
  isLoading?: boolean;
};

export const DisplayAlertDialog = ({
  open,
  setOpen,
  onSubmit,
  title,
  description,
  isLoading,
}: DisplayAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSubmit?.();
            }}
            disabled={isLoading}
          >
            {isLoading && <CornerTopLeftIcon className="h-4 w-4 animate-spin mr-2" />}
            Xác nhận
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
