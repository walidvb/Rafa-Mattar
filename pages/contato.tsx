// pages/index.js
import { Header } from '@features/Header';
import { getServerSideProps as getSSR } from './[slug]';
import Head from 'next/head';
import Image from 'next/image';

export const getServerSideProps = getSSR;

export default function Home({ books, book }) {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Rafael Mattar - Diretor de Fotografia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header books={books} className="shrink w-full px-4" />
      <div className="container grow mx-auto flex flex-col md:flex-row justify-around md:items-center max-w-7xl md:px-8 lg:px-12 xl:px-20">
        <div className="p-2 md:w-1/2">
          <Image
            src="/images/rafael-mattar.jpeg"
            alt="Rafael Mattar"
            className="object-cover w-full h-full rounded-sm"
            width={500}
            height={500}
          />
        </div>
        <div className="p-5 md:w-1/2">
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
