import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        // Cache video assets for 1 year
        source: '/api/video/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache all images for 1 month (dress images may change)
        source: '/api/images/:filename',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Proxy video through Next.js to add cache headers
        source: '/api/video/main-landing',
        destination: 'https://jtbggfxmoawunabhjvrd.supabase.co/storage/v1/object/public/assets/main_landing.mp4',
      },
      {
        // Proxy all images through Next.js for caching
        source: '/api/images/:filename',
        destination: 'https://jtbggfxmoawunabhjvrd.supabase.co/storage/v1/object/public/images/:filename',
      },
    ];
  },
};

export default nextConfig;
