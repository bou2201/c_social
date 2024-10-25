import ScrollToTop from '@/app/scroll-to-top';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cSol • Tìm kiếm',
};

const SearchPage = () => {
  return (
    <>
      <ScrollToTop />
      <div></div>
    </>
  );
};

export default SearchPage;
