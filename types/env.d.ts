declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_API: string;

    // Prisma & Supabase
    readonly DATABASE_URL: string;
    readonly DIRECT_URL: string;

    // Clerk
    readonly CLERK_SECRET_KEY: string;
    readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
    readonly NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
    readonly NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
    readonly NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;

    // Clerk webhook
    readonly CLERK_SIGNING_SECRET: string;

    // Cloudinary
    readonly NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS: string;
    readonly NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    readonly NEXT_PUBLIC_CLOUDINARY_API_KEY: string;
    readonly CLOUDINARY_API_SECRET: string;
    readonly CLOUDINARY_URL: string;
  }
}
