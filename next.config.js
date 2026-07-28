const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [128, 256, 384, 512, 640, 768, 1024, 1280],
    qualities: [75, 85, 90, 95, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'customer-assets.emergentagent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'mir-s3-cdn-cf.behance.net', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
    ],
  },
  serverExternalPackages: ['mongodb'],
};

module.exports = nextConfig;
