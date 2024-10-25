'use client';

import { DisplaySheet } from '@/components/display-handler';
import { NavLink, NavLinkProps, NavLinkResp } from '@/components/navigation';
import { Button } from '@/components/ui';
import { Router } from '@/constants';
import { UserButton, useUser } from '@clerk/nextjs';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Heart, House, Plus, Search, UserRound, Menu } from 'lucide-react';
import { PostDialog, postSelectors } from '@/modules/post';

export const AppLayout = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const openPostDialog = postSelectors.isOpen();
  const setOpenPostDialog = postSelectors.setIsOpen();

  const HEADER_NAVIGATION: NavLinkProps[] = useMemo(() => {
    return [
      {
        icon: <House className="w-6 h-6 opacity-70" />,
        slug: Router.Home,
        label: 'Trang chủ',
      },
      {
        icon: <Search className="w-6 h-6 opacity-70" />,
        slug: Router.Search,
        label: 'Tìm kiếm',
      },
      {
        icon: <Plus className="w-6 h-6 opacity-70" />,
        label: 'Tạo',
        onClick: () => setOpenPostDialog(true),
      },
      {
        icon: <Heart className="w-6 h-6 opacity-70" />,
        slug: Router.Notifications,
        label: 'Thông báo',
      },
      {
        icon: <UserRound className="w-6 h-6 opacity-70" />,
        slug: Router.ProfilePage + '/' + user?.username,
        label: 'Trang cá nhân',
      },
    ];
  }, [setOpenPostDialog, user?.username]);

  const HEADER_NAVIGATION_RESP: Omit<NavLinkProps, 'onClick'>[] = useMemo(() => {
    return [
      {
        icon: <House className="w-6 h-6 mr-2 opacity-70" />,
        slug: Router.Home,
        label: 'Trang chủ',
      },
      {
        icon: <Search className="w-6 h-6 mr-2 opacity-70" />,
        slug: Router.Search,
        label: 'Tìm kiếm',
      },
      {
        icon: <Heart className="w-6 h-6 mr-2 opacity-70" />,
        slug: Router.Notifications,
        label: 'Thông báo',
      },
      {
        icon: <UserRound className="w-6 h-6 mr-2 opacity-70" />,
        slug: Router.ProfilePage + '/' + user?.username,
        label: 'Trang cá nhân',
      },
    ];
  }, [user?.username]);

  return (
    <>
      <header className="px-4 py-2 flex items-center gap-3 fixed z-50 top-0 w-full bg-white dark:bg-csol_black">
        <Link
          href={Router.Home}
          className="flex-1 inline-block font-semibold text-2xl font-[family-name:var(--font-geist-mono)]"
        >
          cSol.
        </Link>

        <div className="hidden sm:flex flex-1 justify-center items-center gap-3">
          {HEADER_NAVIGATION.map((item) => (
            <NavLink key={item.slug} {...item} />
          ))}
        </div>

        <div className="flex flex-1 justify-end items-center gap-3">
          <DisplaySheet
            trigger={
              <Button
                variant="outline"
                size="icon"
                className="inline-flex sm:hidden w-10 h-10 rounded-full bg-csol_white_foreground dark:bg-csol_black_foreground"
              >
                <Menu className="w-4 h-4" />
              </Button>
            }
            title="Danh mục"
            open={openSheet}
            setOpen={setOpenSheet}
          >
            <div className="flex flex-col gap-2 items-start justify-start mt-5">
              {HEADER_NAVIGATION_RESP.map((item) => (
                <NavLinkResp key={item.slug} {...item} />
              ))}
            </div>
          </DisplaySheet>

          <Button
            variant="outline"
            size="icon"
            onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
            className="w-10 h-10 rounded-full bg-csol_white_foreground dark:bg-csol_black_foreground"
          >
            {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </Button>

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-10 h-10',
              },
            }}
          />
        </div>
      </header>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpenPostDialog(true)}
        className="w-12 h-12 fixed bottom-6 right-6 bg-csol_white_foreground dark:bg-csol_black_foreground hover:scale-125 transform-gpu"
      >
        <Plus className="w-6 h-w-6 opacity-70 " />
      </Button>

      {openPostDialog && <PostDialog open={openPostDialog} setOpen={setOpenPostDialog} />}
    </>
  );
};
