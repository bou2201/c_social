import { getPost } from '@/actions/post.action';
import ScrollToTop from '@/app/scroll-to-top';
import { getTitleContentMetadata } from '@/utils/func';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

type ProfilePostPageProps = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({ params }: ProfilePostPageProps): Promise<Metadata> {
  const post = await getPost(Number(params.postId));

  const { content } = post?.data ?? {};

  return {
    title: getTitleContentMetadata(content as string) ?? '',
  };
}

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
