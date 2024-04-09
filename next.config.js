/** @type {import('next').NextConfig} */
/** @type {import("dotenv").DotenvConfigOptions} */

// require('dotenv').config();

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com",'lh3.googleusercontent.com'],
  },
};


module.exports = {
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
};

module.exports = nextConfig;
