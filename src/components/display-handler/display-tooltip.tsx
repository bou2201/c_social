'use client';

import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';

type DisplayPropsTooltip = {
  children: ReactNode;
  content: string;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export const DisplayTooltip = ({
  children,
  content,
  className,
  side = 'bottom',
}: DisplayPropsTooltip): JSX.Element => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent className={className} side={side} sideOffset={10}>
        <p className="text-[13px] font-medium">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};
