import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  outputFileTracingRoot: path.join(process.cwd()),
}

export default nextConfig
