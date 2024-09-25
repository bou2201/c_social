'use client';

import { InputHTMLAttributes, ReactNode } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputDebounce,
} from '../ui';

type InputTextProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  description?: string | ReactNode;
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  debounceDelay?: number;
  isDebounce?: boolean;
};

export const InputText = <T extends FieldValues>({
  name,
  label,
  description,
  className,
  inputProps,
  debounceDelay,
  isDebounce,
}: InputTextProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormLabel className="text-[13px]">{label}</FormLabel>
            <FormControl>
              {isDebounce ? (
                <InputDebounce
                  {...field}
                  {...inputProps}
                  debounceDelay={debounceDelay}
                  className={`${error && 'border-destructive'} ${inputProps?.className}`}
                />
              ) : (
                <Input
                  {...field}
                  {...inputProps}
                  className={`${error && 'border-destructive'} ${inputProps?.className}`}
                />
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className="text-[13px]" />
          </FormItem>
        );
      }}
    />
  );
};
