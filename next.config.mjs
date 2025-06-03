/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/admin",
  trailingSlash: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
