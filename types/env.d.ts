declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_API: string;

    // Clerk
    readonly CLERK_SECRET_KEY: string;
    readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
    readonly NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
    readonly NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
    readonly NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
  }
}
