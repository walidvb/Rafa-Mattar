import { IProps } from ".";
import { useState, useCallback } from 'react';
import { map } from '../../../shared/helpers/map';
import { useIntersection } from './IntersectionObserver';
import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { OpacityDiv } from './WithMask';
import styled from 'styled-components';


const Title = styled.h2`
  transform: translateY(calc(10px * (1 - var(--x))));
`
export const FullWidth = ({ image, title }: IProps) => {
  const [opacity, setOpacity] = useState(0);
  const onRatioChange = useCallback((percentage, isBelowFold) => {
    if (!isBelowFold){
      setOpacity(1);
      return
    }

    if(percentage > .6){
      // setOpacity(Math.min(1, map(percentage, 0.6, .9, 0, 1)));
      setOpacity(1);
      return
    }


    setOpacity(0);

  }, [setOpacity]);

  const ref = useIntersection({ callback: onRatioChange });

  return <article ref={ref} className="min-h-banner-lg md:min-h-quasi-screen min-w-screen flex flex-col filter grayscale hover:grayscale-0 transition-all">
      <div className="relative flex-grow min-h-banner">
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
          "--x": opacity,
        }}
        >
          <Title className="font-bold text-4xl">{title}</Title>
        </OpacityDiv>
      <Image src={`https:${image.fields.file.url}?w=1200`} alt={title} layout='fill' objectFit="cover" />
      </div>
    </article>;
};