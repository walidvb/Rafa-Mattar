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

const HomePage: React.FC<HomePageProps> = ({ books, book, medias, res }) => {
  console.log({ res, medias })
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
        <div className="flex flex-wrap"
        >
          {medias.map(({ title, file, vimeoUrl, size, ...all }, index) => {
            let body
            if (vimeoUrl){
              body = <ReactPlayer
              light
              key={index}
              showPreview
              controls
              url={vimeoUrl}
              width="100%"
              height="100%"
              className="aspect-video h-full w-full"
              />
            } else{
              console.log({ file, size, index });
              if(!file.details.image){
                console.log(file)
                return null
              }
              const vert = file.details.image.width < file.details.image.height;
              if(vert){
              }
              body = (
                <a data-fancybox={book.fields.slug} href={'https:' + file.url}>
                  <Image
                    width={(size === 's' ? '800' : '1200')}
                    height="800"
                    src={'https:' + file.url}
                    alt={title}
                    loading="lazy"
                    className="object-cover h-full w-full"
                  />
                </a>
              );
            }
              return (
                <div
                  key={title}
                  className={clsx(`grow shrink h-[450px] p-1`)}
                >
                {body}
                </div>
              );})}
        </div>
      </Fancybox>
    </div>
  );
};
export default HomePage;
// https://codepen.io/MadeByMike/pen/wqyKyq