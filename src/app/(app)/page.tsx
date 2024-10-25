import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ScrollToTop from '../scroll-to-top';

export const metadata: Metadata = {
  title: 'cSol • Trang chủ',
  description: 'Connect, share, and discover new experiences with cSol.',
};

const HomePageDynamic = dynamic(() => import('@/page').then((res) => res.HomeComponent), {
  ssr: false,
});

const HomePage = () => {
  return (
    <>
      <ScrollToTop />
      <HomePageDynamic />
    </>
  );
};

export default HomePage;
