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

  const { first_name = '', last_name = '', username = '', image_url } = userProfile.data || {};
  const title = `${first_name} ${last_name} (@${username}) • Trang cá nhân`;
  const description = `Trang cá nhân (@${username})`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image_url ? [{ url: image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image_url ? [image_url] : [],
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
