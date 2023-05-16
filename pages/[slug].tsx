// pages/[slug].tsx

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Entry } from 'contentful';

import ReactPlayer from 'react-player';
import { client } from '@shared/api';
import { IPhoto, ISession, ISessionFields, IVideo } from '@types/contentful';
import OGTags from '@shared/layout/OGTags';
import { Masonry } from 'react-plock';

interface HomePageProps {
  books: Entry<ISession>[];
  book: Entry<ISession>;
  medias: Entry<IPhoto | IVideo>[];
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 3,
  });
  const book = books.find((book) => book.fields.slug === context.params?.slug);

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
  console.log({ res });
  return (
    <div className=" mx-auto px-4">
      <OGTags description={book.fields.title} />
      <Header books={books} />

      <Masonry
        items={medias}
        config={{
          columns: [1, 2, 3],
          gap: [24, 12, 6],
          media: [640, 768, 1024],
        }}
        render={(fields: any, index) => (
          <div key={index}>
            {'file' in fields ? (
              <img
                src={'https:' + fields.file.url}
                alt={fields.title}
                loading="lazy"
                className="object-cover h-full w-full"
              />
            ) : (
              <ReactPlayer
                showPreview
                controls
                url={fields.vimeoUrl}
                width="100%"
                height="100%"
                className="aspect-video"
              />
            )}
          </div>
        )}
      />
    </div>
  );
};
export default HomePage;

const Header = ({ books }: { books: Entry<ISession>[] }) => (
  <header className="flex flex-wrap items-center justify-between py-4 mb-8 container">
    <h1 className="font-title uppercase text-3xl">Rafael Mattar</h1>
    <ul className="flex gap-8 grow justify-center">
      <li>
        <Link href="/">Works</Link>
      </li>
      <li>
        <div className="relative group">
          <button className="">Autorais</button>
          <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white z-10 hidden group-hover:block">
            {books.map((book) => (
              <Link
                className="block px-4 py-2 text-sm"
                key={book.sys.id}
                href={`/${book.fields.slug}`}
              >
                {book.fields.name}
              </Link>
            ))}
          </div>
        </div>
      </li>
    </ul>
    <ul>Socials</ul>
  </header>
);
