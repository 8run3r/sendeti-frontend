/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.sendeti.sk', pathname: '/**' },
      { protocol: 'https', hostname: 'sendeti.sk', pathname: '/**' },
      { protocol: 'https', hostname: '*.sendeti.sk', pathname: '/**' },
      { protocol: 'https', hostname: 'www.apoleus.sk', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.eshop-rychle.cz', pathname: '/**' },
      { protocol: 'https', hostname: '*.s2.eshop-rychle.cz', pathname: '/**' },
    ],
    minimumCacheTTL: 3600,
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
}
export default nextConfig
