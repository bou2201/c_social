import * as React from 'react';

import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type TextareaDebounceProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  debounceDelay?: number;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Use callback to avoid unnecessary re-renders
    const handleResize = React.useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height to measure scrollHeight
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
      }
    }, []);

    // Debounce resize using requestAnimationFrame for performance
    const handleInput = React.useCallback(() => {
      requestAnimationFrame(handleResize);
    }, [handleResize]);

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 resize-none overflow-hidden text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={(node) => {
          // Assign the forwarded ref and internal ref
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          textareaRef.current = node;
        }}
        onInput={handleInput}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

const TextareaDebounce = React.forwardRef<HTMLTextAreaElement, TextareaDebounceProps>(
  ({ className, debounceDelay = 300, value, ...props }, ref) => {
    // Handle debounce using the useDebounce hook
    const [debouncedValue] = useDebounce(value, debounceDelay);

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Use callback to avoid unnecessary re-renders
    const handleResize = React.useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height to measure scrollHeight
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
      }
    }, []);

    // Debounce resize using requestAnimationFrame for performance
    const handleInput = React.useCallback(() => {
      requestAnimationFrame(handleResize);
    }, [handleResize]);

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        value={debouncedValue}
        ref={(node) => {
          // Assign the forwarded ref and internal ref
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          textareaRef.current = node;
        }}
        onInput={handleInput}
        {...props}
      />
    );
  },
);
TextareaDebounce.displayName = 'TextareaDebounce';

export { Textarea, TextareaDebounce };
