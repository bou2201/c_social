'use client';

import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';

type DisplayPropsTooltip = {
  trigger: ReactNode | string;
  content: string;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export const DisplayTooltip = ({
  trigger,
  content,
  className,
  side = 'bottom',
}: DisplayPropsTooltip): JSX.Element => {
  return (
    <Tooltip>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent className={className} side={side} sideOffset={10}>
        <p className="text-[13px] font-medium">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};