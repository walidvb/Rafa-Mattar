// pages/[slug].tsx

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Entry } from 'contentful';

import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { client } from '@shared/api';
import { IPhoto, ISession, ISessionFields, IVideo } from '@types/contentful';
import OGTags from '@shared/layout/OGTags';
import Image from 'next/image';
import { FaVimeo } from 'react-icons/fa';
import Fancybox from '@features/shared/FancyBox';
import { Header } from '../features/Header';
import { useEffect, useRef } from 'react';
import clsx from "clsx"
import { useInRows } from './Masonry';


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
          return {
            ...media.fields.photo?.fields,
            size: media.fields.size || null,
          };
      }

      return{
        ...media.fields,
        size: media.fields.size || null,
      };
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

const Media = ({ book, title, file, vimeoUrl, height, width, url }) => {
  let body;
  if (vimeoUrl) {
    body = (
      <ReactPlayer
        light
        showPreview
        controls
        url={vimeoUrl}
        width="100%"
        height="100%"
        className="aspect-video h-full w-full"
      />
    );
  } else {
    const { url } =
    body = (
      <a
        data-fancybox={book.fields.slug}
        href={'https:' + url}
        className=" image-container contents"
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
    <div key={title} className={clsx(``)} style={{
      width: width,
      height: height,
    }}>
      {body}
    </div>
  );
};



const HomePage: React.FC<HomePageProps> = ({ books, book, medias, res }) => {
  // console.log({ res, medias })
  const rows = useInRows(medias)
  return (
    <div className="mx-auto">
      <OGTags description={book.fields.title} />
      <Header books={books} />

      <Fancybox
        options={{
          compact: true,
          hash: true,
          mousePanning: true,
        }}
      >
        <div className="flex flex-wrap">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex flex-wrap w-full"
              style={{
                height: row[0].height,
              }}
            >
              {row.map(({ height, width, url }, index) => (
                <Media book={book} {...{ height, width, url }} key={index} />
              ))}
            </div>
          ))}
        </div>
      </Fancybox>
    </div>
  );
};
export default HomePage;
// https://codepen.io/MadeByMike/pen/wqyKyq