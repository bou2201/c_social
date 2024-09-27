import { UserProfile } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cSol • Trang cá nhân',
};

const MePage = () => {
  return (
    <UserProfile
      appearance={{
        elements: {
          rootBox: 'w-auto',
          cardBox: 'max-md:w-full max-w-full md:max-w-2xl',
          profileSectionHeader__profile: 'md:w-[8.5rem]',
          profileSectionHeader__username: 'md:w-[8.5rem]',
          profileSectionHeader__emailAddresses: 'md:w-[8.5rem]',
          profileSectionHeader__connectedAccounts: 'md:w-[8.5rem]',
          pageScrollBox: 'dark:bg-csol_black_foreground',
        },
      }}
    />
  );
};

export default MePage;
