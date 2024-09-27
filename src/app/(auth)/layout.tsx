import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {};

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <section className="min-h-screen w-full flex justify-center items-center relative">
      {children}
      <div className="bg-transparent absolute -z-10 inset-0">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AuthLayout;
