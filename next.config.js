const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      allowedForwardedHosts: ['animated-space-invention-57pxqrr4w6wcw7w-3000.app.github.dev',  "localhost:3000"],
    },
  },
};

module.exports = {
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  },
  ...nextConfig, // Merge nextConfig with existing configuration
};
