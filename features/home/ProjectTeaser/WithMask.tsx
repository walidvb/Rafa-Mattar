import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import styled, { css } from 'styled-components';
import { useIntersection } from './IntersectionObserver';
import { useCallback, useState } from 'react';
import { map } from '@shared/helpers';;
import MaskedImage from '@features/home/ui/Mask';
import { useSpring, animated } from 'react-spring'

export const OpacityDiv = styled.div`
  opacity: var(--x);
  transition: all .8s ease-in-out;
  @media (min-width: 768px){
  }
  p{
    color: white;
  }
`

const TRANSLATE_STYLES = 'transform: translateX(calc(1vw * var(--translateTo) * ((1 - var(--x)))));'

const TImage = styled.div`
  z-index: 5;
  position: absolute;
  top: 0;
  transform: translateX(calc(100% * var(--x)));
  @media(min-width: 768px){
    ${TRANSLATE_STYLES}
    position: static;
  }
  /* used to center the canvas */
  span{
    max-width: 100%;
    display: flex!important;
    align-items: center;
  }
`
  
const TTextWrapper = styled.div`
  @media(min-width: 768px){
    ${TRANSLATE_STYLES}
  }
`

const TText = styled(OpacityDiv)`
  
transform: translateX(calc(-20px * (1 - var(--x)))) ;
  @media(min-width: 768px){
    transform: translateX(calc(400px * (1 - var(--x)))) translateY(-50%);
  }
`

export const WithMask = ({ image, title, shortDescription }: IProps) => {
  const [width, setWidth] = useState<number>(0)
  
  const onRatioChange = useCallback((percentage: number, isBelowFold: boolean) => {
    if (isBelowFold){
      const threshold = window.innerWidth > 768 ? [.50, .85] : [.5, .8]
      if (percentage > threshold[0]){
        // setWidth(Math.min(1, Math.max(0, map(percentage, threshold[0], threshold[1], 0, 1))))
        setWidth(1);
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

  const W = 800, H = 800;
  const img = <MaskedImage
    src={'https:' + image.fields.file.url + `?w=${W}&h=${H}`}
    // @ts-ignore
    alt={image.fields.title}
    width={800}
    height={800}
  />

  // @ts-ignore
  return <animated.article ref={ref} style={wrapperStyles} className="grid md:grid-cols-2 min-h-banner md:min-h-quasi-screen relative place-content-center">
      <TImage style={{ '--translateTo': '25' } as React.CSSProperties} className="flex place-content-center md:items-center justify-center h-full will-change bg-white p-8">
        {img}
      </TImage>
    <TTextWrapper style={{ '--translateTo': '50' } as React.CSSProperties} className="relative bg-bgGray text-white will-change grid place-content-center">
      <div className="md:w-[50vw] py-8 px-12 ">
        <div className="text-4xl font-bold text-center">{title}</div>
      </div>
    </TTextWrapper>
  </animated.article>;
};
