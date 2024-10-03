'use client';

import { memo, useMemo } from 'react';
import { NavLinkProps } from './nav-link';
import { usePathname } from 'next/navigation';
import { Router } from '@/constants';
import Link from 'next/link';
import { Button, SheetClose } from '../ui';

export const NavLinkResp = memo(({ slug, icon, label }: Omit<NavLinkProps, 'onClick'>) => {
  const pathname = usePathname();

  const getIsActive = useMemo(() => {
    if (slug === Router.Home) {
      return slug === pathname;
    } else {
      return slug === pathname || pathname?.startsWith(slug as string);
    }
  }, [pathname, slug]);

  return (
    slug && (
      <SheetClose asChild>
        <Link href={slug} className="w-full">
          <Button
            variant="ghost"
            size="icon"
            className={`w-full py-2 px-4 h-11 justify-start ${
              getIsActive ? 'bg-csol_white_foreground dark:bg-csol_black_foreground' : ''
            }`}
          >
            {icon}
            <strong>{label}</strong>
          </Button>
        </Link>
      </SheetClose>
    )
  );
});
NavLinkResp.displayName = NavLinkResp.name;
