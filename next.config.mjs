/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "www.sendeti.sk",
      },
      {
        protocol: "https",
        hostname: "*.sendeti.sk",
      },
    ],
  },
};

export default nextConfig;
