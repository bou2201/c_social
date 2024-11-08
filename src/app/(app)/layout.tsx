import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const LayoutDynamic = dynamic(() => import('@/layouts').then((res) => res.AppLayout), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'cSol • Social network for everyone.',
  description: 'Connect, share, and discover new experiences with cSol.',
};

const AppLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LayoutDynamic />
      <div className="mt-16 pt-2 flex justify-center items-start">
        <div className="w-full md:max-w-2xl">{children}</div>
      </div>
    </HydrationBoundary>
  );
};

export default AppLayout;
