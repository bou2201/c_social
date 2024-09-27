'use client';

import Link from 'next/link';
import { memo, MouseEventHandler, ReactNode, useMemo } from 'react';
import { DisplayTooltip } from '../display-handler';
import { Button } from '../ui';
import { usePathname } from 'next/navigation';
import { Router } from '@/constants';

export type NavLinkProps = {
  slug?: string;
  label: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const NavLink = memo(({ slug, icon, label, onClick }: NavLinkProps) => {
  const pathname = usePathname();

  const getIsActive = useMemo(() => {
    if (slug === Router.Home) {
      return slug === pathname;
    } else {
      return slug === pathname || pathname.startsWith(slug as string);
    }
  }, [pathname, slug]);

  if (onClick) {
    return (
      <DisplayTooltip
        content={label}
        trigger={
          <Button variant="ghost" size="icon" onClick={onClick} className="w-12 h-11">
            {icon}
          </Button>
        }
      />
    );
  }

  return (
    slug && (
      <Link href={slug}>
        <DisplayTooltip
          content={label}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-11 ${
                getIsActive ? 'bg-csol_white_foreground dark:bg-csol_black_foreground' : ''
              }`}
            >
              {icon}
            </Button>
          }
        />
      </Link>
    )
  );
});
NavLink.displayName = NavLink.name;
