/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000/',
        'https://csol.loca.lt',
        '*.http://localhost:3000/',
        '*.https://csol.loca.lt'
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
