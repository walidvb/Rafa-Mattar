// pages/[slug].tsx

import { Entry } from 'contentful';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import Fancybox from '@features/shared/FancyBox';
import { client } from '@shared/api';
import OGTags from '@shared/layout/OGTags';
import { IPhoto, ISession, IVideo } from '@types/contentful';
import clsx from "clsx";
import dynamic from 'next/dynamic';
import { Header } from '../features/Header';
import { Masonry } from '../shared/Masonry';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });


interface HomePageProps {
  books: Entry<ISession>[];
  book: ISession;
  medias: (IPhoto | IVideo)[];
}


export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let { items: books } = await client.getEntries<ISession>({
    content_type: 'session',
    include: 3,
  });
  const slug = context.params?.slug || 'work';
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
      if(media.sys.contentType.sys.id === 'photo')
      {
        if (!media.fields.photo?.fields){
          return
        }
        return media;
      }

      return media;
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

const Media = ({ book, media }: {
  book: ISession
  media: IPhoto | IVideo
}) => {
  let body;

  if (media.fields.vimeoUrl) {
    console.log(media.fields);
    body = (
      <ReactPlayer
        light
        showPreview
        controls
        url={media.fields.vimeoUrl}
        width="100%"
        height="100%"
        className="aspect-video h-full w-full"
      />
    );
  } else {
    const {  title, file: { details: {image}, url } } = media.fields.photo.fields
    if (!image) {
      return null;
    }
      const {
        width, height ,
      } = image;
    body = (
      <a
        data-fancybox={book.fields.slug}
        href={'https:' + url}
        className="image-container contents"
      >
        <img
          src={'https:' + url}
          alt={title}
          loading="lazy"
          width={width}
          height={height}
          className=" image"
        />
      </a>
    );
  }
  return (
    <div className={clsx(`p-1`)} style={{
      height: 350,
    }}>
      {body}
    </div>
  );
};



const HomePage: React.FC<HomePageProps> = ({ books, book, medias, res }) => {
  console.log({ res, medias })

  return (
    <div className="mx-auto px-2 max-w-[1921px]">
      <OGTags description={book.fields.title} />
      <Header books={books} />

      <Fancybox
        options={{
          compact: true,
          hash: true,
          mousePanning: true,
        }}
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