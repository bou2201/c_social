'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 30 * MINUTE,
      staleTime: 25 * MINUTE,
      retry: 2,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

export const QueryProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
