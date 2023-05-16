/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {

    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.ctfassets.net', 'scontent.cdninstagram.com'],
  },
  async redirects() {
    return [
      {
        source: '/lost-cells',
        destination: '/documentaires/lost-cells',
        permanent: true,
      },
      {
        source: '/letincelle',
        destination: '/documentaires/letincelle',
        permanent: true,
      },
      {
        source: '/grotesque',
        destination: '/documentaires/grotesque',
        permanent: true,
      },
    ];
  },
};
