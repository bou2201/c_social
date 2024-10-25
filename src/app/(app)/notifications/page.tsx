import ScrollToTop from '@/app/scroll-to-top';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cSol • Thông báo',
};

const NotificationsPage = () => {
  return (
    <>
      <ScrollToTop />
      <div></div>
    </>
  );
};

export default NotificationsPage;
