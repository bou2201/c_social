import ScrollToTop from '@/app/scroll-to-top';
import dynamic from 'next/dynamic';

type ProfilePostPageProps = {
  params: {
    postId: string;
  };
};

const ProfilePostPageDynamic = dynamic(
  () => import('@/modules/post').then((res) => res.PostDetails),
  {
    ssr: false,
  },
);

const ProfilePostPage = ({ params }: ProfilePostPageProps) => {
  return (
    <>
      <ScrollToTop />
      <ProfilePostPageDynamic postId={params.postId} />
    </>
  );
};

export default ProfilePostPage;
