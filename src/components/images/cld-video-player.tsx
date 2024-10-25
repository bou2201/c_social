'use client';

import { CldVideoPlayer as CldVideoPlayerDefault, CldVideoPlayerProps } from 'next-cloudinary';

export const CldVideoPlayer = (props: CldVideoPlayerProps) => {
  return <CldVideoPlayerDefault {...props} />;
};
