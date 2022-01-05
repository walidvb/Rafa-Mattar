import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useIntersection } from './IntersectionObserver';
import { IProps } from './index';
import { map } from '../../../shared/helpers/map';
import styled from 'styled-components';
import { BWImage } from '../ui/BWImage';

const Fader = styled.div`
  opacity: var(--opacity);
  transform: translateY(calc(5px * var(--opacity)));
  transition: all .8s ease-in-out;
`

export const TwoCol = ({ image, title }: IProps) => {
  const [opacity, setOpacity] = useState(0);
  const onRatioChange = useCallback((percentage: number) => {
    const thresholds = window.innerWidth > 768 ? [.8, .9] : [.4, .7]
    // setOpacity(map(percentage, thresholds[0], thresholds[1], 0, 1));
    setOpacity(percentage > .7 ? 1 : 0);

  }, [setOpacity]);

  const ref = useIntersection({ callback: onRatioChange });


  return <article ref={ref} style={{ '--opacity': opacity } as React.CSSProperties} className="min-h-banner-lg md:min-h-quasi-screen min-w-screen flex-reverse grid grid-cols-2">
    <div className="grid place-content-center text-4xl relative order-1 mt-4 md:mt-0">
        <h2 className="font-bold">{title}</h2>
      <Fader className="md:absolute md:-translate-y-1/2 top-1/2 left-0 right-0 text-center font-bold">
      </Fader>
    </div>
    <BWImage className="relative min-h-banner w-auto">
      <Image src={`https:${image.fields.file.url}?w=800&h=800`} alt={title} layout='fill' objectFit="cover" />
    </BWImage>
  </article>;
};
