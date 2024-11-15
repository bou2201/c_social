'use client';

import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui';

export type DisplayPopoverProps = {
  trigger: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  modal?: boolean;
  className?: string;
  align?: 'end' | 'center' | 'start';
};

export const DisplayPopover = ({
  trigger,
  open,
  setOpen,
  children,
  modal = true,
  className,
  align = 'end',
}: DisplayPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className={className}>
        {children}
      </PopoverContent>
    </Popover>
  );
};
