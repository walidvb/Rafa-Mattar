import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import styled from 'styled-components';
import { useIntersection } from './IntersectionObserver';
import { useCallback, useState } from 'react';
import { map } from '@shared/helpers';;
import MaskedImage from '@shared/ui/Mask';
import { useSpring, animated } from 'react-spring'

const Wrapper = styled(animated.div)`
  grid-template-columns: 1fr;
  @media (min-width: 768px){
    grid-template-columns: 1fr var(--column-width, 0);
  }
  transition: all .1s ease-out;
`

export const OpacityDiv = styled.div`
  opacity: var(--opacity);
  p{
    color: white;
  }
`

export const WithMask = ({ image, title, shortDescription }: IProps) => {
  const [width, setWidth] = useState<number>(0)
  
  const onRatioChange = useCallback((percentage, isBelowFold) => {
    if (isBelowFold){
      if (percentage > .85){
        setWidth(Math.min(1, Math.max(0, map(percentage, .85, .95, 0, 1))))
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
    transform: `translateX(${(1 - width) * 25}vw)`,
  })
  const descStyles = useSpring({ 
    opacity: width,
    transform: `translateX(${(1 - width) * 50}vw)`,
   })

  return <div ref={ref} className="grid md:grid-cols-2 md:min-h-screen">
    <div className="relative">
      <animated.div style={wrapperStyles} className="flex place-content-center items-center h-full">
        <MaskedImage
          src={'https:' + image.fields.file.url} alt={image.fields.title}
          width={800}
          height={800}
          // layout="responsive"
        />
      </animated.div>
    </div>
    <animated.div style={descStyles} className="relative bg-bgGray text-white ">
      <div  className="md:w-[50vw] py-8 px-12 overflow-visible md:absolute top-1/2 md:-translate-y-1/2">
        <div className="text-2xl font-bold">{title}</div>
        <RichText data={shortDescription} />
      </div>
    </animated.div>
  </div>;
};
