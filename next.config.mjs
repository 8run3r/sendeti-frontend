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
      {
        protocol: "https",
        hostname: "www.apoleus.sk",
      },
    ],
  },
};

export default nextConfig;
