'use client';

import { Button } from '@/components/ui';
import { Router } from '@/constants';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';

export const NotFound = () => {
  const router = useRouter();

  return (
    <section className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-[family-name:var(--font-geist-mono)] text-5xl">404</h2>
        <p className="mt-4 text-lg opacity-70">Whoops! Trang bạn đang tìm kiếm không tồn tại</p>
        <Button
          variant="default"
          className='mt-6 font-semibold'
          onClick={() => {
            router.push(Router.Home);
          }}
        >
          <MoveLeft className="h-4 w-4 mr-3 opacity-70" />
          Về trang chủ
        </Button>
      </div>
    </section>
  );
};
