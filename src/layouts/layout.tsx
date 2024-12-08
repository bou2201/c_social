'use client';

import { DisplayPopover, DisplaySheet } from '@/components/display-handler';
import { NavLink, NavLinkProps, NavLinkResp } from '@/components/navigation';
import { Avatar, AvatarFallback, AvatarImage, Button, Separator } from '@/components/ui';
import { Router } from '@/constants';
import { useClerk, useUser } from '@clerk/nextjs';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Heart, House, Plus, Search, UserRound, Menu, LogOut } from 'lucide-react';
import { PostDialog, postSelectors } from '@/modules/post';
import { getShortName } from '@/utils/func';
import { getUserByUsername } from '@/actions/user.action';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PopoverClose } from '@radix-ui/react-popover';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next-nprogress-bar';
import DrawerAlertAuth from '@/app/drawer-alert-auth';

export const AppLayout = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [openPopoverAvt, setOpenPopoverAvt] = useState<boolean>(false);
  const [openAlertAuth, setOpenAlertAuth] = useState<boolean>(false);

  const { signOut } = useClerk();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const openPostDialog = postSelectors.isOpen();
  const setOpenPostDialog = postSelectors.setIsOpen();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.username],
    queryFn: () => getUserByUsername(user?.username as string),
  });

  const { mutate: executeLogout, isPending: isLoadingLogout } = useMutation({
    mutationFn: () => signOut({ redirectUrl: Router.Home }),
  });

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
        onClick: () => {
          if (user) {
            setOpenPostDialog(true);
          } else {
            setOpenAlertAuth(true);
          }
        },
      },
      {
        icon: <Heart className="w-6 h-6 opacity-70" />,
        // slug: Router.Notifications,
        label: 'Thông báo',
        onClick: () => {
          if (user) {
            router.push(Router.Notifications);
          } else {
            setOpenAlertAuth(true);
          }
        },
      },
      {
        icon: <UserRound className="w-6 h-6 opacity-70" />,
        // slug: Router.ProfilePage + '/' + user?.username,
        label: 'Trang cá nhân',
        onClick: () => {
          if (user) {
            router.push(Router.ProfilePage + '/' + user?.username);
          } else {
            setOpenAlertAuth(true);
          }
        },
      },
    ];
  }, [router, setOpenPostDialog, user]);

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
        // slug: Router.Notifications,
        label: 'Thông báo',
        onClick: () => {
          if (user) {
            router.push(Router.Notifications);
          } else {
            setOpenAlertAuth(true);
          }
        },
      },
      {
        icon: <UserRound className="w-6 h-6 mr-2 opacity-70" />,
        // slug: Router.ProfilePage + '/' + user?.username,
        label: 'Trang cá nhân',
        onClick: () => {
          if (user) {
            router.push(Router.ProfilePage + '/' + user?.username);
          } else {
            setOpenAlertAuth(true);
          }
        },
      },
    ];
  }, [router, user]);

  const renderAvatarButton = useCallback(() => {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full"
        onClick={() => setOpenPopoverAvt(true)}
      >
        <Avatar className="h-full w-full flex-shrink-0">
          <AvatarImage src={profile?.data?.image_url ?? ''} className="object-cover" />
          <AvatarFallback>{getShortName(`${user?.firstName} ${user?.lastName}`)}</AvatarFallback>
        </Avatar>
      </Button>
    );
  }, [profile, user]);

  if (isLoadingLogout) {
    return <LoadingPage />;
  }

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

          {user ? (
            <DisplayPopover
              open={openPopoverAvt}
              setOpen={setOpenPopoverAvt}
              trigger={renderAvatarButton()}
              className="w-72"
            >
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={profile?.data?.image_url ?? ''} className="object-cover" />
                  <AvatarFallback>
                    {getShortName(`${user?.firstName} ${user?.lastName}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {`${profile?.data?.first_name ?? '...'} ${profile?.data?.last_name}`}
                  </p>
                  <span className="opacity-70 text-sm">@{profile?.data?.username}</span>
                </div>
              </div>

              <Separator className="mt-4 mb-2" />

              <Link href={Router.ProfilePage + '/' + user?.username}>
                <PopoverClose asChild>
                  <Button className="opacity-80 w-full !gap-5 justify-start mb-1" variant="ghost">
                    <UserRound className="w-4 h-4" /> Trang cá nhân
                  </Button>
                </PopoverClose>
              </Link>
              <Button
                className="opacity-80 w-full !gap-5 justify-start"
                variant="ghost"
                onClick={() => executeLogout()}
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </Button>
            </DisplayPopover>
          ) : (
            <Button
              variant="default"
              className="font-semibold"
              onClick={() => router.push(Router.SignIn)}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </header>

      {user && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenPostDialog(true)}
          className="w-12 h-12 fixed max-md:hidden bottom-6 right-6 bg-csol_white_foreground dark:bg-csol_black_foreground hover:scale-125 transform-gpu"
        >
          <Plus className="w-6 h-w-6 opacity-70 " />
        </Button>
      )}

      {openPostDialog && <PostDialog open={openPostDialog} setOpen={setOpenPostDialog} />}

      <DrawerAlertAuth open={openAlertAuth} setOpen={setOpenAlertAuth} />
    </>
  );
};
