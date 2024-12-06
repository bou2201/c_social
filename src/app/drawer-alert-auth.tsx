'use client';

import { DisplayDrawer } from '@/components/display-handler';
import { Button } from '@/components/ui';
import { Router } from '@/constants';
import { useRouter } from 'next-nprogress-bar';

type DrawerAlertAuthProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerAlertAuth = ({ open, setOpen }: DrawerAlertAuthProps) => {
  const router = useRouter();

  return (
    <DisplayDrawer open={open} setOpen={setOpen} trigger>
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col py-16">
          <caption className="font-bold text-xl opacity-80 mb-2">Đăng nhập để tương tác</caption>
          <span className="opacity-80 text-sm text-center mb-24">Tham gia cùng cSol, hòa mình vào cộng đồng của bạn</span>
          <Button
            variant="default"
            className="font-semibold mb-3 uppercase"
            size="lg"
            onClick={() => router.push(Router.SignIn)}
          >
            Đăng nhập
          </Button>
          <Button
            variant="outline"
            className="font-semibold uppercase"
            size="lg"
            onClick={() => setOpen(false)}
          >
            Huỷ bỏ
          </Button>
        </div>
      </div>
    </DisplayDrawer>
  );
};

export default DrawerAlertAuth;
