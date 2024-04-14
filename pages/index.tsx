// components/BackgroundImage.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const BackgroundImage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <link url="/films" rel="prefetch" />
      </Head>
      <div suppressHydrationWarning>
        <video
          autoPlay
          muted
          src="/intro-video.mp4"
          onEnded={() => {
            router.replace('/films');
          }}
          width="100%"
          height="100%"
          className="fixed inset-0 object-cover w-full h-full"
        />
      </div>
    </>
  );
  return (
    <Link href="/films">
      <div
        id="bg-img"
        className="bg-cover bg-center h-screen relative"
        style={{
          backgroundImage: `url(/images/bg.jpeg)`,
        }}
      >
        <div className="absolute top-8 right-8">
          <span className="text-lg text-white">Entrar</span>
        </div>
      </div>
    </Link>
  );
};

export default BackgroundImage;
