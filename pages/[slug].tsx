import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { GetStaticProps } from 'next';
import Image from 'next/image';

import Fancybox from '@features/shared/FancyBox';
import { Header } from '../features/Header';
import { getPageBySlug, getPages, strapiMediaUrl } from '@shared/api';
import OGTags from '@shared/layout/OGTags';
import { Masonry } from '../shared/Masonry';
import { MediaItem, Page } from '@shared/strapi-types';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface HomePageProps {
  pages: Page[];
  page: Page;
  items: MediaItem[];
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

  if (!page && context.params?.slug) {
    return { notFound: true };
  }

  const items =
    page?.items
      ?.filter((item) => {
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
    },
  };
};

const Media = ({ page, item }: { page: Page; item: MediaItem }) => {
  let body;

  if (item.type === 'video' && item.videoUrl) {
    body = (
      <div
        className="aspect-video max-w-full md:max-h-full min-w-full md:min-h-full md:h-[calc(350px - 1rem)] relative group legends-wrapper"
        style={{
          width: (1600 * (350 - 16)) / 900,
        }}
      >
        <a
          data-fancybox={page.slug}
          href={item.videoUrl}
          className="flex image-container cursor-pointer relative h-full w-full"
        >
          <ReactPlayer
            light
            showPreview
            controls
            url={item.videoUrl}
            width="100%"
            height="100%"
            className="h-full w-full z-0 pointer-events-none"
          />
          {item.title && (
            <div className="absolute p-4 inset-0 flex items-center place-content-center font-body text-neutral-50 bg-neutral-900/40 invisible group-hover:visible pointer-events-none uppercase text-xs">
              {item.title}
            </div>
          )}
        </a>
      </div>
    );
  } else if (item.type === 'image' && item.image?.url) {
    const imageUrl = strapiMediaUrl(item.image.url);
    const width = item.image.width ?? 800;
    const height = item.image.height ?? 600;
    const okWidth = 800;
    const newWidth = okWidth;
    const newHeight = (height * okWidth) / width;

    if (!imageUrl) {
      return null;
    }

    body = (
      <a
        data-fancybox={page.slug}
        href={imageUrl}
        className="image-container contents"
      >
        <Image
          src={imageUrl}
          alt={item.title}
          loading="lazy"
          width={newWidth}
          height={newHeight}
          className="image"
        />
      </a>
    );
  } else {
    return null;
  }

  return (
    <div
      data-size={item.type === 'video' ? 'lg' : 'md'}
      className={clsx(
        'p-1 max-w-full',
        'hover:brightness-[0.7]',
        item.type === 'video' ? 'aspect-video' : ''
      )}
      style={{
        height: 350,
      }}
    >
      {body}
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ pages, page, items }) => {
  const ogImage = strapiMediaUrl(page?.og?.image?.url);

  return (
    <div className="mx-auto max-w-[1921px] min-h-screen px-2 md:px-4 pb-2 flex flex-col">
      <OGTags
        title={page?.og?.title ?? undefined}
        description={page?.og?.description ?? undefined}
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
            <Media item={item} page={page} key={item.id} />
          ))}
        </Masonry>
      </Fancybox>
    </div>
  );
};

export default HomePage;
