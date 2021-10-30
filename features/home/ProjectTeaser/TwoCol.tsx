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

  return <div ref={ref} className="min-h-screen min-w-screen flex flex-col flex-reverse md:grid md:grid-cols-2">
    <div className="grid place-content-center text-4xl relative order-1">
      <div
        style={{ opacity: 1 - opacity * 2 }}
        className="md:absolute md:-translate-y-1/2 top-1/2 left-0 right-0 text-center"
      >
        {title}
      </div>
      <RichText data={shortDescription} style={{ opacity: opacity }} />
    </div>
    <div className="relative min-h-[30vh] w-screen md:w-auto">
      <Image src={`https:${image.fields.file.url}`} alt={title} layout='fill' objectFit="cover" />
    </div>
  </div>;
};
