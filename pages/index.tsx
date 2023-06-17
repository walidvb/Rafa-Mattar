// components/BackgroundImage.js
import Link from 'next/link';
import React from 'react';

const BackgroundImage = () => {
  const imageUrl = {
    desktop: '/path/to/desktop/image.jpg',
    mobile: '/path/to/mobile/image.jpg',
  };

  return (
    <Link href="/filmes">
      <div
        className="bg-cover bg-center h-screen relative"
        style={{
          backgroundImage: `url(/images/bg.jpeg)`,
        }}
      >
        <div className="absolute top-8 right-8">
          <span className="text-xl text-white">Entrar</span>
        </div>
      </div>
    </Link>
  );
};

export default BackgroundImage;
