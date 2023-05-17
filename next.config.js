/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.ctfassets.net', 'scontent.cdninstagram.com', "downloads.ctfassets.net"],
  }
};
