'use client';

import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui';

type DisplayDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
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
      >
        <DialogHeader className={headerClass}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
