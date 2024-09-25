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
            boxShadow:
              'rgba(0, 0, 0, 0.08) 0px 5px 5px 0px, rgba(25, 28, 33, 0.2) 0px 5px 5px -5px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px',
          },
          card: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      }}
    >
      {children}
    </CoreClerkProvider>
  );
};
