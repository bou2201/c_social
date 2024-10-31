import { NotFound } from '@/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cSol • 404',
  description: 'Trang không tồn tại.',
};

const NotFoundPage = () => {
  return <NotFound />;
};

export default NotFoundPage;
