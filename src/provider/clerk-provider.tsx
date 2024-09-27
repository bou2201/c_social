'use client';

import { viVN } from '@clerk/localizations';
import { dark } from '@clerk/themes';
import { ClerkProvider as CoreClerkProvider } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export const ClerkProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement; // Access the <html> element

    const updateTheme = () => {
      const colorScheme = htmlElement.style.getPropertyValue('color-scheme');
      const htmlClass = htmlElement.classList.contains('dark') ? 'dark' : 'light';
      setIsDarkMode(colorScheme === 'dark' || htmlClass === 'dark');
    };

    // Run once to set the initial theme
    updateTheme();

    // Set up a MutationObserver to watch for changes to the class and style attributes
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(htmlElement, {
      attributes: true, // Watch for attribute changes
      attributeFilter: ['class', 'style'], // Only listen for changes in class or style attributes
    });

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  return (
    <CoreClerkProvider
      localization={viVN}
      appearance={{
        baseTheme: isDarkMode ? dark : undefined,
        variables: {
          colorPrimary: isDarkMode ? '#FAFAFA' : '#09090B',
          colorBackground: isDarkMode ? '#09090B' : '#FAFAFA',
          colorText: isDarkMode ? '#FAFAFA' : '#09090B',
        },
        elements: {
          cardBox: {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px',
          },
          card: {
            backgroundColor: isDarkMode ? '#18181B' : '#F4F4F5',
            boxShadow: 'none',
          },
          footer: {
            background: isDarkMode
              ? 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)), linear-gradient(#18181B, #18181B)'
              : 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)), linear-gradient(#F4F4F5, #F4F4F5)',
          },
        },
      }}
    >
      {children}
    </CoreClerkProvider>
  );
};
