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
        <link href="/films" rel="prefetch" />
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
};

export default BackgroundImage;
