'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui';
import { Cross2Icon } from '@radix-ui/react-icons';

type DisplayDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void;
  title: string | ReactNode;
  description?: string;
  children: React.ReactNode;
  contentClass?: string;
  headerClass?: string;
  modal?: boolean;
};

export const DisplayDialog = ({
  open,
  setOpen,
  onClose,
  title,
  children,
  description,
  contentClass,
  headerClass,
  modal = true,
}: DisplayDialogProps): JSX.Element => {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={modal}>
      <DialogContent
        className={`flex flex-col max-sm:h-screen overflow-y-scroll overflow-x-hidden max-h-screen no-scrollbar ${
          contentClass ?? ''
        }`}
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby={undefined}
      >
        <DialogClose
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={(e) => {
            e.preventDefault();
            onClose?.();
          }}
        >
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className={headerClass}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
