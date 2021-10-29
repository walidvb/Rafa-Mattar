import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useIntersection } from './IntersectionObserver';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import { map } from '../../../shared/helpers/map';

export const TwoCol = ({ image, title, shortDescription }: IProps) => {
  const [opacity, setOpacity] = useState(0);
  const onRatioChange = useCallback((percentage) => {
    setOpacity(map(percentage, 0.8, .9, 0, 1));
  }, [setOpacity]);

  const ref = useIntersection({ callback: onRatioChange });


  console.log(opacity);
  return <div ref={ref} className="min-h-screen min-w-screen grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
    <div className="grid place-content-center text-4xl relative">
      <RichText data={shortDescription} style={{ opacity: opacity }} />
      <div
        style={{ opacity: 1 - opacity * 2 }}
        className="absolute -translate-y-1/2 top-1/2 left-0 right-0 text-center"
      >
        {title}
      </div>
    </div>
    <div className="relative">
      <Image src={`https:${image.fields.file.url}`} alt={title} layout='fill' objectFit="cover" />
    </div>
  </div>;
};
