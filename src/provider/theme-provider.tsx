'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export const ThemeProvider = ({
  children,
  ...props
}: Readonly<ThemeProviderProps>): JSX.Element => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
