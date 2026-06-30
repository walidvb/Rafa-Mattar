import { getServerSideSitemap } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getPageSlugs } from '@shared/api';

const siteUrl = process.env.SITE_URL || 'https://futurproche.ch';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slugs = await getPageSlugs();
  const list = slugs.map((slug) => ({
    loc: `${siteUrl}/${slug}`,
    changefreq: 'weekly',
  }));

  return getServerSideSitemap(ctx, [
    {
      loc: `${siteUrl}/`,
      changefreq: 'weekly',
      // @ts-expect-error
    },
    ...list,
  ]);
};

export default function ServerSitemap() {
  return null;
}
