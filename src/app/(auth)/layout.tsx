import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {};

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <section className="min-h-screen w-full flex justify-center items-center">{children}</section>
  );
};

export default AuthLayout;
