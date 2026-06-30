/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://rafaelmattar.com',
  generateRobotsTxt: true, // (optional)
  robotsTxtOptions: {
    additionalSitemaps: [`https://rafaelmattar.com/server-sitemap.xml`],
  },
}