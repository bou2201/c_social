/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  staticPageGenerationTimeout: 1000,
  serverRuntimeConfig: {
    requestTimeout: 30000,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000/',
        '*.http://localhost:3000/',
        'https://csol.loca.lt',
        '*.https://csol.loca.lt',
        'https://csol.vercel.app/',
        '*.https://csol.vercel.app/',
      ],
      bodySizeLimit: '6mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
