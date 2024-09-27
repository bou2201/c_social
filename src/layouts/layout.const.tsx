import { NavLinkProps } from '@/components/navigation';
import { Router } from '@/constants';
import { Heart, House, Plus, Search, UserRound } from 'lucide-react';

export const HEADER_NAVIGATION: NavLinkProps[] = [
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
    onClick: () => {},
  },
  {
    icon: <Heart className="w-6 h-6 opacity-70" />,
    slug: Router.Notifications,
    label: 'Thông báo',
  },
  {
    icon: <UserRound className="w-6 h-6 opacity-70" />,
    slug: Router.Me,
    label: 'Trang cá nhân',
  },
];

export const HEADER_NAVIGATION_RESP: Omit<NavLinkProps, 'onClick'>[] = [
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
    slug: Router.Me,
    label: 'Trang cá nhân',
  },
];
