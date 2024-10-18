'use client';

import { MouseEventHandler, ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';

export type DisplayDropdownItemProps = {
  key: string;
  content: string | ReactNode;
  onClick: MouseEventHandler<HTMLDivElement>;
  icon?: ReactNode;
  isDivider?: boolean;
};

export type DisplayDropdownProps = {
  trigger: ReactNode | string;
  label?: string;
  items: DisplayDropdownItemProps[];
  className?: string;
  align?: 'end' | 'center' | 'start';
  open: boolean;
  setOpen: (open: boolean) => void;
  modal?: boolean;
};

export const DisplayDropdown = ({
  trigger,
  label,
  items,
  className,
  align = 'end',
  open,
  setOpen,
  modal = true,
}: DisplayDropdownProps): JSX.Element => {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={modal}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={className}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items.map((item) => (
          <>
            <DropdownMenuItem
              onClick={item.onClick}
              key={item.key}
              className={`min-w-[11rem] cursor-pointer [&>button]:w-full font-medium [&>button]:text-left ${
                item.icon ? 'justify-between gap-2' : ''
              }`}
            >
              {item.content}
              {item.icon}
            </DropdownMenuItem>
            {item.isDivider && <DropdownMenuSeparator />}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
