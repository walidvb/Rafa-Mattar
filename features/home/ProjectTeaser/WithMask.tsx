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
      const threshold = window.innerWidth > 768 ? [.85, .98] : [.5, .8]
      if (percentage > threshold[0]){
        setWidth(Math.min(1, Math.max(0, map(percentage, threshold[0], threshold[1], 0, 1))))
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

  />

  // @ts-ignore
  return <animated.article ref={ref} style={wrapperStyles} className="grid md:grid-cols-2 md:min-h-screen relative">
      <TImage style={{ '--translateTo': '25' } as React.CSSProperties} className="flex place-content-center md:items-center h-full will-change bg-white">
        <div>
          {img}
        </div>
      </TImage>
    <TTextWrapper style={{'--translateTo': '50'} as React.CSSProperties} className="relative bg-bgGray text-white will-change ">
      <TText className="md:w-[50vw] py-8 px-12 overflow-visible md:absolute top-1/2">
        <div className="text-4xl font-bold mb-4">{title}</div>
        <RichText data={shortDescription} />
      </TText>
    </TTextWrapper>
  </animated.article>;
};
