'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useTheme } from 'next-themes';

export const NProgressProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <ProgressBar
        key={theme}
        height="3px"
        color={theme === 'dark' ? '#FAFAFA' : '#09090B'}
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};
