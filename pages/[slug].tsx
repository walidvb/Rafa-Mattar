// pages/[slug].tsx

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Entry } from 'contentful';

import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { client } from '@shared/api';
import { IPhoto, ISession, ISessionFields, IVideo } from '@types/contentful';
import OGTags from '@shared/layout/OGTags';
import { Masonry } from 'react-plock';
import Image from 'next/image';
import { FaVimeo } from 'react-icons/fa';
import Fancybox from '@features/shared/FancyBox';
import { Header } from '../features/Header';

interface HomePageProps {
  books: Entry<ISession>[];
  book: Entry<ISession>;
  medias: Entry<IPhoto | IVideo>[];
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 3,
  });
  const slug = context.params?.slug || "works"
  const book = books.find((book) => book.fields.slug === slug);

  const res = (await client.getEntry(book.sys.id, {
    include: 3,
  })) as {
    fields: {
      medias: Entry<IPhoto | IVideo>[];
    };
  };

  const medias = res.fields.medias
    .map((media) => {
      if (!media.sys.contentType) {
        return;
      }
      return media.sys.contentType.sys.id === 'photo'
        ? media.fields.photo?.fields
        : media.fields;
    })
    .filter(Boolean);

  books = books.filter((book) => book.fields.medias?.length);
  return {
    props: {
      books,
      book,
      medias,
      res,
    },
  };
};

const HomePage: React.FC<HomePageProps> = ({ books, book, medias, res }) => {
  return (
    <div className=" mx-auto px-4">
      <OGTags description={book.fields.title} />
      <Header books={books} />

      <Fancybox
        options={{
          compact: true,
          hash: true,
          mousePanning: true
        }}
      >
        <Masonry
          items={medias}
          config={{
            columns: [1, 2, 3, 4],
            gap: [20, 20, 20, 20],
            media: [640, 1200, 2000, 2400],
          }}
          render={(fields: any, index) =>
            'file' in fields ? (
              <a data-fancybox={book.fields.slug} href={'https:' + fields.file.url}>
                <Image
                  width="800"
                  height="800"
                  src={'https:' + fields.file.url}
                  alt={fields.title}
                  loading="lazy"
                  className="object-cover h-full w-full"
                />
              </a>
            ) : (
              <ReactPlayer
                light
                key={index}
                showPreview
                controls
                url={fields.vimeoUrl}
                width="100%"
                height="100%"
                className="aspect-video"
              />
            )
          }
        />
      </Fancybox>
    </div>
  );
};
export default HomePage;
