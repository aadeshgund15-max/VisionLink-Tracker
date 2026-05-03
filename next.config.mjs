/** @type {import('next').NextConfig} */
const nextConfig = {
  /* This configuration allows the app to fetch and display image previews 
     from any external website link you paste. */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
