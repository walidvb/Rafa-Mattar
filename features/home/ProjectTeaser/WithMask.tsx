import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import styled, { css } from 'styled-components';
import { useIntersection } from './IntersectionObserver';
import { useCallback, useState } from 'react';
import { map } from '@shared/helpers';;
import MaskedImage from '@shared/ui/Mask';
import { useSpring, animated } from 'react-spring'

export const OpacityDiv = styled.div`
  opacity: var(--x);
  @media (min-width: 768px){
  }
  p{
    color: white;
  }
`

const Mover = styled.div`
  @media(min-width: 768px){
    transform: translateX(calc(1vw * var(--translateTo) * ((1 - var(--x)))));
  }
`

export const WithMask = ({ image, title, shortDescription }: IProps) => {
  const [width, setWidth] = useState<number>(0)
  
  const onRatioChange = useCallback((percentage, isBelowFold) => {
    if (isBelowFold){
      const threshold = window.innerWidth > 768 ? .85 : .4
      if (percentage > threshold){
        setWidth(Math.min(1, Math.max(0, map(percentage, threshold, .95, 0, 1))))
      }
      else{
        setWidth(0)
      }
    }
    else{
      setWidth(1)
    }
  }, [setWidth])
  const ref = useIntersection({ callback: onRatioChange })

  const wrapperStyles = useSpring({
    '--x': width,
   })

  const img = <MaskedImage
    src={'https:' + image.fields.file.url} alt={image.fields.title}
    width={800}
    height={800}
    className="max-h-[30vh] max-w-[30vh]"
  />

  // @ts-ignore
  return <animated.div ref={ref} style={wrapperStyles} className="grid md:grid-cols-2 md:min-h-screen">
    <div className="relative">
      <Mover style={{ '--translateTo': '25' } as React.CSSProperties} className="flex place-content-center items-center h-full will-change">
        {img}
      </Mover>
    </div>
    <Mover style={{'--translateTo': '50'} as React.CSSProperties} className="relative bg-bgGray text-white will-change ">
      <div  className="md:w-[50vw] py-8 px-12 overflow-visible md:absolute top-1/2 md:-translate-y-1/2">
        <div className="text-2xl font-bold">{title}</div>
        <RichText data={shortDescription} />
      </div>
    </Mover>
  </animated.div>;
};
