'use client';

import { CldImage as CldImageDefault, CldImageProps } from 'next-cloudinary';

export const CldImage = (props: CldImageProps) => {
  return <CldImageDefault {...props} />;
};
