import { getServerSideSitemap, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { client } from '@shared/api';
import { ISession } from '@types/contentful';


const siteUrl = process.env.SITE_URL || 'https://futurproche.ch';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 0,
  });
  const list = books
    .filter(({ fields: { slug } }) => slug !== 'work')
    .map(({ fields: { slug } }) => ({
      loc: `${siteUrl}/${slug}`,
      changefreq: 'weekly',
    }));
    return getServerSideSitemap(ctx, [{
      loc: `${siteUrl}/`,
      changefreq: 'weekly',
      // @ts-expect-error
    }, ...list]);
};

// Default export to prevent next.js errors
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {}
