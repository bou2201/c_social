import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

declare const globalThis: {
  cloudinary: typeof cloudinary | undefined;
} & typeof global;

const cld = globalThis.cloudinary ?? cloudinary;

export default cld;

if (process.env.NODE_ENV !== 'production') globalThis.cloudinary = cld;
