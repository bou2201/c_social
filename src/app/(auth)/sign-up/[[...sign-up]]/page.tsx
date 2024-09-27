import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cSol • Đăng ký',
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
