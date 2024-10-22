import { getUserByUsername } from '@/actions/user.action';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

type ProfilePageProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const userProfile = await getUserByUsername(params.username);

  if (!userProfile) {
    return {
      title: 'Người dùng không tồn tại',
      description: 'Không tim thấy dữ liệu.',
    };
  }

  return {
    title: `${userProfile.data?.username} • Trang cá nhân`,
    description: `Trang cá nhân ${userProfile.data?.username}`,
    openGraph: {
      title: `${userProfile.data?.username} • Trang cá nhân`,
      description: `Trang cá nhân ${userProfile.data?.username}`,
      images: userProfile.data?.image_url ? [{ url: userProfile.data?.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${userProfile.data?.username} • Trang cá nhân`,
      description: `Tài khoản ${userProfile.data?.username}`,
      images: userProfile.data?.image_url ?? undefined,
    },
  };
}

const ProfilePageDynamic = dynamic(() => import('@/page').then((res) => res.ProfileComponent), {
  ssr: false,
});

const ProfilePage = ({ params }: ProfilePageProps) => {
  return <ProfilePageDynamic username={params.username} />;
};

export default ProfilePage;
