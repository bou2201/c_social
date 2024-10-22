'use client';

import { getUserByUsername } from '@/actions/user.action';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

export const ProfileComponent = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getUserByUsername(username),
  });

  if (isError) {
    return notFound();
  }

  return <></>;
};
