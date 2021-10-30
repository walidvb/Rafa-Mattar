import { IProps } from ".";
import { useState, useCallback } from 'react';
import { map } from '../../../shared/helpers/map';
import { useIntersection } from './IntersectionObserver';
import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { OpacityDiv } from './WithMask';

export const FullWidth = ({ image, title, shortDescription }: IProps) => {
  const [opacity, setOpacity] = useState(0);
  const onRatioChange = useCallback((percentage, isBelowFold) => {
    if (isBelowFold && percentage > .5) {
      setOpacity(map(percentage, 0.5, .9, 0, 1));
    }
  }, [setOpacity]);

  const ref = useIntersection({ callback: onRatioChange });


  return <div ref={ref} className="min-h-screen min-w-screen flex flex-col">
      
      <div className="relative flex-grow">
        <OpacityDiv className="
          text-2xl
          absolute
          flex place-content-center items-center
          top-0 left-0 right-0 bottom-0 bg-[#1117] 
          z-10
          text-white
        "
        style={{
          // @ts-ignore
          "--opacity": opacity,
        }}
        >
          {title}
        </OpacityDiv>
        <Image src={`https:${image.fields.file.url}`} alt={title} layout='fill' objectFit="cover" />
      </div>
    <RichText data={shortDescription} style={{ opacity }} className="max-w-[95vw]"/>
  </div>;
};