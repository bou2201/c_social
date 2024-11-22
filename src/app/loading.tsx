'use client';

import { useTheme } from 'next-themes';
import HashLoader from 'react-spinners/HashLoader';

const LoadingPage = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-csol_white_foreground dark:bg-csol_black_foreground">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
        <HashLoader color={theme === 'dark' ? '#FAFAFA' : '#09090B'} loading={true} size={35} />
        <span className="text-sm">Xin vui lòng chờ ...</span>
      </div>
    </div>
  );
};

export default LoadingPage;
