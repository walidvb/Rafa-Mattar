import { getServerSideSitemap, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getProjects } from '@shared/api';

const siteUrl = process.env.SITE_URL || 'https://futurproche.ch';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const projects = await getProjects();
  const list = projects.map(({ fields: { slug } }) => ({
    loc: `${siteUrl}/projects/${slug}`,
    changefreq: 'weekly',
  }));
  // @ts-expect-error on changefreq not being a ChangeFreq
  return getServerSideSitemap(ctx, list);
};

// Default export to prevent next.js errors
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {}
