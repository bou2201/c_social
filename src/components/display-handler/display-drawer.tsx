'use client';

import { ReactNode } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui';

type DisplayDrawerProps = {
  trigger?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export const DisplayDrawer = ({
  trigger,
  open,
  setOpen,
  children,
  className,
}: DisplayDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className={className}>{children}</DrawerContent>
    </Drawer>
  );
};
