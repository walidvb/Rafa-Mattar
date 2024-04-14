// pages/index.js
import { Header } from '@features/Header';
import { getStaticProps as getSP } from './[slug]';
import Head from 'next/head';

export const getStaticProps = getSP;
export default function Home({ books, book }) {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Rafael Mattar - Diretor de Fotografia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header books={books} className="shrink w-full px-2 md:px-4" />
      <style>
        {`
          body{
            background: url(/images/rafael-mattar.jpeg);
            background-size: cover;
            background-position: 35% center;
          }
          @media (min-width: 768px) {
            background-position: center;
          }
        `}
      </style>
      <div className="grow relative">
        {/* <div className="p-2 md:w-1/2">
          <Image
            src="/images/rafael-mattar.jpeg"
            alt="Rafael Mattar"
            className="object-cover w-full h-full rounded-sm"
            width={500}
            height={500}
          />
        </div> */}
        <div className="p-2 md:absolute md:top-[40%] left-1/2 pt-12 md:pt-0 md:-translate-y-full md:-translate-x-[120%]">
          <h1 className="text-3xl mb-4">Direção de Fotografia</h1>
          <p className="text-xl mb-2">
            <a
              href="mattarrafael@gmail.com"
              className="hover:no-underline underline"
            >
              mattarrafael@gmail.com
            </a>
          </p>
          <p className="text-xl mb-2">São Paulo / SP Brasil</p>
        </div>
      </div>
    </div>
  );
}
