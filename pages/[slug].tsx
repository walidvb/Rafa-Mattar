// pages/[slug].tsx

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { createClient, Entry } from 'contentful';
import { ISession, IPhoto, IVideo } from '../@types/generated/contentful';
import ReactPlayer from 'react-player';
import { client } from '@shared/api';
import { ISessionFields } from '@types/contentful';

interface HomePageProps {
  books: Entry<ISession>[];
  book: Entry<ISession>;
  medias: Entry<IPhoto | IVideo>[];
}



export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 3,
  });
  const book = books.find(
    (book) => book.fields.slug === context.params?.slug
  ) as Entry<ISessionFields>;

  const res = (await client.getEntry(book.sys.id, {
    include: 3,
  })) as {
    fields: {
      medias: Entry<IPhoto | IVideo>[];
    };
  };

  const medias = res.fields.medias.map((media) =>
    media.sys.contentType.sys.id === 'photo'
      ? media.fields.photo.fields
      : media.fields
  );
  return {
    props: {
      books,
      book,
      medias

    },
  };
};

const HomePage: React.FC<HomePageProps> = ({ books, book, medias, res, mm }) => {
  console.log({ res, medias, mm });
  return (
    <div className="container mx-auto px-4">
      <header className="flex flex-wrap items-center justify-between py-4 mb-8">
        <div className="relative group">
          <button className="px-4 py-2 bg-gray-200 rounded">Books</button>
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
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medias.map((fields: (IPhoto | IVideo)['fields'], index) => (
          <div key={index} style={{ height: '500px' }}>
            {'file' in fields ? (
              <img
                src={'https:' + fields.file.url}
                alt={fields.title}
                className="object-cover h-full w-full"
              />
            ) : (
              <ReactPlayer url={fields.vimeoUrl} width="100%" height="100%" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomePage;
