import { useState, useEffect } from 'react';
import Image from 'next/image';

export const Activity = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const url = `https://graph.instagram.com/me/media?fields=media_count,media_type,permalink,media_url,caption&&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_API_TOKEN}`;
    (async () => {
      const response = await fetch(url);
      const { data } = await response.json();
      console.log(data);
      setImages(data);
    })();
  }, [setImages]);

  return <div id="actualite" className="mx-auto container  mt-12 md:mt-32 px-2 md:px-0">
    <h2 className="text-3xl md:text-6xl font-bold mb-8 md:mb-16">Actualité</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {images.map((feed: IGFeed) => (
        <a className="hover:opacity-75" href={feed.permalink} target="_blank" rel="noreferrer" key={feed.id} title={feed.caption}>
          {(feed.media_type === 'IMAGE' || feed.media_type === 'CAROUSEL_ALBUM')
            ? <Image alt={feed.caption} width={200} height={200} src={feed.media_url} key={feed.id} layout="responsive" />
            : <video key={feed.id} src={feed.media_url} />}
        </a>
      ))}
    </div>
  </div>;
};
type IGFeed = {
  media_type: string;
  media_url: string;
  id: string;
  permalink: string;
  caption: string;
};
