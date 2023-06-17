// components/BackgroundImage.js
import Link from 'next/link';
import React from 'react';

const BackgroundImage = () => {

  return (
    <Link href="/filmes">
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
