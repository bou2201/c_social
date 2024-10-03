/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000/',
        '*.http://localhost:3000/',
        'https://csol.loca.lt',
        '*.https://csol.loca.lt',
        'https://csol.vercel.app/',
        '*.https://csol.vercel.app/'
      ],
      bodySizeLimit: "6mb",
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
    ]
  }
};

export default nextConfig;
