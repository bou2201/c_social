import { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui';

type DisplaySheetProps = {
  trigger: ReactNode;
  children: ReactNode;
  title: string | ReactNode;
  description?: string | ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DisplaySheet = ({
  trigger,
  children,
  title,
  description,
  side = 'right',
  open,
  setOpen,
}: DisplaySheetProps): JSX.Element => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
