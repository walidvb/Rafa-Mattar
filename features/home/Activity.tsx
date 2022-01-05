import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WithPointer } from './WithPointer';
import { Ig } from '../../shared/layout/Footer';

const url = `https://graph.instagram.com/me/media?fields=media_count,media_type,permalink,media_url,caption&&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_API_TOKEN}`;

export const Activity = () => {
  const [images, setImages] = useState([]);
  const [err, setErr] = useState(false);
  
  useEffect(() => {
    (async () => {
      try{
        const response = await fetch(url);
        const { data } = await response.json();
        setImages(data);
        setErr(false)
      } catch(err){
        setErr(true)
        console.log(err);
      }
    })();
  }, [setImages]);

  return <div id="actualite" className="mx-auto container  pt-12 md:mt-32 px-2 md:px-0" style={{ scrollMarginTop: "var(--header-height)" }}>
    <h2 className="text-3xl md:text-6xl font-bold mb-8 md:mb-16">Actualité</h2>
    {err ? <p>Une erreur est survenue...</p> : (
      <WithPointer pointerTitle={<Ig className="h-12 w-12 opacity-50 hover:text-brand"/>} className="grid grid-cols-3 gap-0 md:gap-0 max-w-[1000px] mx-auto">
        {images.map((feed: IGFeed) => (
          <a className="hover:opacity-75" href={feed.permalink} target="_blank" rel="noreferrer" key={feed.id} title={feed.caption}>
            {(feed.media_type === 'IMAGE' || feed.media_type === 'CAROUSEL_ALBUM')
              ? <Image alt={feed.caption} width={200} height={200} src={feed.media_url} key={feed.id} layout="responsive" />
              : <video key={feed.id} src={feed.media_url} />}
          </a>
        ))}
      </WithPointer>
    )}
  </div>;
};
type IGFeed = {
  media_type: string;
  media_url: string;
  id: string;
  permalink: string;
  caption: string;
};
