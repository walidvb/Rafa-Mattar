/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://futurproche.ch',
  generateRobotsTxt: true, // (optional)
  robotsTxtOptions: {
    additionalSitemaps: [`https://futurproche.ch/server-sitemap.xml`],
  },
};