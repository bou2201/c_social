import { getUserByUsername } from '@/actions/user.action';
import ScrollToTop from '@/app/scroll-to-top';
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

  const title = `${userProfile.data?.first_name ?? ''} ${userProfile.data?.last_name ?? ''} (@${
    userProfile.data?.username
  }) • Trang cá nhân`;
  const description = `Trang cá nhân (@${userProfile.data?.username})`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: userProfile.data?.image_url ? [{ url: userProfile.data?.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: userProfile.data?.image_url ?? undefined,
    },
  };
}

const ProfilePageDynamic = dynamic(() => import('@/page').then((res) => res.ProfileComponent), {
  ssr: false,
});

const ProfilePage = ({ params }: ProfilePageProps) => {
  return (
    <>
      <ScrollToTop />
      <ProfilePageDynamic username={params.username} />
    </>
  );
};

export default ProfilePage;
