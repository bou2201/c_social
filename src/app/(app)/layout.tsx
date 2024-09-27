import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const LayoutDynamic = dynamic(() => import('@/layouts/').then((res) => res.AppLayout), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'cSol • Social network for everyone.',
  description: 'Connect, share, and discover new experiences with cSol.',
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <LayoutDynamic />
      <div className="mt-16 pt-2 flex justify-center items-start">
        <div className="w-full md:max-w-2xl">{children}</div>
      </div>
    </>
  );
};

export default AppLayout;
