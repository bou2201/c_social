'use client';

import { ReactNode, TextareaHTMLAttributes } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  TextareaDebounce,
} from '../ui';

type InputTextAreaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string | ReactNode;
  className?: string;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  debounceDelay?: number;
  isDebounce?: boolean;
  disableMessage?: boolean;
};

export const InputTextArea = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  textareaProps,
  debounceDelay,
  isDebounce,
  disableMessage = false,
}: InputTextAreaProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel className="text-[13px]">{label}</FormLabel>}
            <FormControl>
              {isDebounce ? (
                <TextareaDebounce
                  {...field}
                  {...textareaProps}
                  debounceDelay={debounceDelay}
                  className={`${error && 'border-destructive'} ${textareaProps?.className}`}
                />
              ) : (
                <Textarea
                  {...field}
                  {...textareaProps}
                  className={`${error && 'border-destructive'} ${textareaProps?.className}`}
                />
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {!disableMessage && <FormMessage className="text-[13px]" />}
          </FormItem>
        );
      }}
    />
  );
};
