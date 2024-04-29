// pages/[slug].tsx

import { Entry } from 'contentful';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
} from 'next';

import Fancybox from '@features/shared/FancyBox';
import { client } from '@shared/api';
import OGTags from '@shared/layout/OGTags';
import { IPhoto, ISession, IVideo } from '@types/contentful';
import clsx from "clsx";
import dynamic from 'next/dynamic';
import { Header } from '../features/Header';
import { Masonry } from '../shared/Masonry';
import Image from 'next/image';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });


interface HomePageProps {
  books: Entry<ISession>[];
  book: ISession;
  medias: (IPhoto | IVideo)[];
}

export const MAIN_BOOK_SLUG = 'filmes';

export const getStaticPaths = async () => {
  const { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 3,
  });
  const paths = books.map((book) => ({
    params: {
      slug: book.fields.slug,
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetServerSidePropsContext
) => {
  let { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 3,
  });
  const slug = context.params?.slug || MAIN_BOOK_SLUG;
  const book = books.find((book) => book?.fields.slug === slug) || null;

  let medias = null;
  if (book) {
    const res = (await client.getEntry(book.sys.id, {
      include: 3,
    })) as {
      fields: {
        medias: Entry<IPhoto | IVideo>[];
      };
    };

    medias = res.fields.medias
      .map((media) => {
        if (!media.sys.contentType) {
          return;
        }
        if (media.sys.contentType.sys.id === 'photo') {
          if (!media.fields.photo?.fields) {
            return;
          }
          return media;
        }

        return media;
      })
      .filter(Boolean);
    books = books.filter((book) => book.fields.medias?.length);
  }

  return {
    revalidate: 120,
    props: {
      books,
      book,
      medias,
    },
  };
};

const Media = ({ book, media }: {
  book: ISession
  media: IPhoto | IVideo
}) => {
  let body;

  if (media.fields.vimeoUrl) {
    body = (
      <div
        className="aspect-video max-w-full md:max-h-full min-w-full md:min-h-full md:h-[calc(350px - 1rem)] relative group legends-wrapper"
        style={{
          width: (1600 * (350 - 16)) / 900,
        }}
      >
        <a
          data-fancybox={book.fields.slug}
          href={media.fields.vimeoUrl}
          className="flex image-container cursor-pointer relative h-full w-full"
        >
          <ReactPlayer
            light
            showPreview
            controls
            url={media.fields.vimeoUrl}
            width="100%"
            height="100%"
            className="h-full w-full z-0 pointer-events-none"
          />
          {media.fields.title && (
            <div className="absolute p-4 inset-0 flex items-center place-content-center font-body text-neutral-50 bg-neutral-900/40 invisible group-hover:visible pointer-events-none uppercase text-xs">
              {media.fields.title}
            </div>
          )}
        </a>
      </div>
    );
  } else {
    const {
      title,
      file: {
        details: { image },
        url,
      },
    } = media.fields.photo.fields;
    if (!image) {
      return null;
    }
    const { width, height } = image;
    const okWidth = 800;
    const newWidth = width * (okWidth / width);
    const newHeight = (height * okWidth) / width;
    body = (
      <a
        data-fancybox={book.fields.slug}
        href={'https:' + url}
        className="image-container contents"
      >
        <Image
          src={'https:' + url}
          alt={title}
          loading="lazy"
          width={newWidth}
          height={newHeight}
          className="image"
        />
      </a>
    );
  }

  return (
    <div
      data-size={media.fields.vimeoUrl ? 'lg' : 'md'}
      className={clsx(
        `p-1 max-w-full`,
        'hover:brightness-[0.7]',
        media.fields.vimeoUrl ? 'aspect-video' : ''
      )}
      style={{
        height: 350,
      }}
    >
      {body}
    </div>
  );
};



const HomePage: React.FC<HomePageProps> = ({ books, book, medias, res }) => {
  return (
    <div className="mx-auto max-w-[1921px] min-h-screen px-2 md:px-4 pb-2 flex flex-col">
      <OGTags description={book.fields.title} />
      <Header books={books} className="px-2 w-full" />

      <Fancybox
        options={{
          compact: true,
          hash: true,
          mousePanning: true,
        }}
        className="grow grid items-center"
      >
        <Masonry>
          {medias.map((media) => (
            <Media media={media} book={book} key={media.sys.id} />
          ))}
        </Masonry>
      </Fancybox>
    </div>
  );
};
export default HomePage;
// https://codepen.io/MadeByMike/pen/wqyKyq