import { GetStaticProps } from 'next';

import Fancybox from '@features/shared/FancyBox';
import { Header } from '../features/Header';
import { MediaTile } from '../features/gallery/MediaTile';
import { getPageBySlug, getPages, getSiteConfig, strapiMediaUrl } from '@shared/api';
import OGTags from '@shared/layout/OGTags';
import { Masonry } from '../shared/Masonry';
import { MediaItem, Page, SiteConfig } from '@shared/strapi-types';

interface HomePageProps {
  pages: Page[];
  page: Page;
  items: MediaItem[];
  siteConfig: SiteConfig | null;
}

export const MAIN_PAGE_SLUG = 'films';

export const getStaticPaths = async () => {
  const pages = await getPages();
  const paths = pages.map((page) => ({
    params: {
      slug: page.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (context) => {
  const slug = (context.params?.slug as string) || MAIN_PAGE_SLUG;
  const pages = await getPages();
  const page = (await getPageBySlug(slug)) ?? pages.find((p) => p.slug === slug) ?? null;
  const siteConfig = await getSiteConfig();

  if (!page && context.params?.slug) {
    return { notFound: true };
  }

  const items =
    page?.items
      ?.filter((item) => {
        if (item.published === false) {
          return false;
        }

        if (item.type === 'image') {
          return Boolean(item.image?.url);
        }
        return Boolean(item.videoUrl);
      })
      .map((item) => item) ?? [];

  return {
    revalidate: 120,
    props: {
      pages,
      page,
      items,
      siteConfig,
    },
  };
};

const HomePage: React.FC<HomePageProps> = ({ pages, page, items, siteConfig }) => {
  const ogImage =
    strapiMediaUrl(page?.og?.image?.url) ?? strapiMediaUrl(siteConfig?.og?.image?.url);
  const ogDescription = page?.og?.description ?? siteConfig?.og?.description ?? undefined;

  return (
    <div className="mx-auto max-w-[1921px] min-h-screen px-2 md:px-4 pb-2 flex flex-col">
      <OGTags
        title={page?.og?.title ?? undefined}
        description={ogDescription}
        image={ogImage}
        path={page?.slug}
      />
      <Header pages={pages} className="px-2 w-full" />

      <Fancybox
        options={{
          compact: true,
          hash: true,
          mousePanning: true,
        }}
        className="grow grid items-center"
      >
        <Masonry>
          {items.map((item) => (
            <div key={item.id} className="max-w-full overflow-hidden" style={{ height: 350 }}>
              <MediaTile item={item} page={page} />
            </div>
          ))}
        </Masonry>
      </Fancybox>
    </div>
  );
};

export default HomePage;
