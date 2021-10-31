import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useIntersection } from './IntersectionObserver';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import { map } from '../../../shared/helpers/map';
import styled from 'styled-components';

const Fader = styled.div`
  opacity: var(--opacity);
  @media (min-width: 768px){
    :nth-child(2n + 1){
      opacity: calc(1 - var(--opacity));
    }
  }
`

export const TwoCol = ({ image, title, shortDescription }: IProps) => {
  const [opacity, setOpacity] = useState(0);
  const onRatioChange = useCallback((percentage) => {
    const thresholds = window.innerWidth > 768 ? [.8, .9] : [.4, .7]
    setOpacity(map(percentage, thresholds[0], thresholds[1], 0, 1));
  }, [setOpacity]);

  const ref = useIntersection({ callback: onRatioChange });


  return <article ref={ref} style={{ '--opacity': opacity } as React.CSSProperties} className="min-h-screen min-w-screen flex flex-col flex-reverse md:grid md:grid-cols-2">
    <div className="grid place-content-center text-4xl relative order-1 mt-4 md:mt-0">
      <Fader className="md:absolute md:-translate-y-1/2 top-1/2 left-0 right-0 text-center">
        {title}
      </Fader>
      <Fader>
        <RichText data={shortDescription}/>
      </Fader>
    </div>
    <div className="relative min-h-[30vh] w-screen md:w-auto">
      <Image src={`https:${image.fields.file.url}`} alt={title} layout='fill' objectFit="cover" />
    </div>
  </article>;
};
