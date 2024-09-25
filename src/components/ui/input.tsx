import * as React from 'react';

import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export type InputDebounceProps = React.InputHTMLAttributes<HTMLInputElement> & {
  debounceDelay?: number;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const InputDebounce = React.forwardRef<HTMLInputElement, InputDebounceProps>(
  ({ className, type, debounceDelay = 300, value, ...props }, ref) => {
    // Handle debounce using the useDebounce hook
    const [debouncedValue] = useDebounce(value, debounceDelay);

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        value={debouncedValue}
        ref={ref}
        {...props}
      />
    );
  },
);
InputDebounce.displayName = 'InputDebounce';

export { Input, InputDebounce };
