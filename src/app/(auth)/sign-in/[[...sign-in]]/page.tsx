import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cSol • Đăng nhập',
};

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
