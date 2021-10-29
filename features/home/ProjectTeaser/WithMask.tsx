import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import styled from 'styled-components';
import { useIntersection } from './IntersectionObserver';
import { useCallback, useState } from 'react';
import { map } from '@shared/helpers';

const Wrapper = styled.div`
  grid-template-columns: 1fr var(--column-width, 0);
  transition: var(--column-width) .1s ease-out;
`

const OpacityDiv = styled.div`
  opacity: var(--opacity);
  p{
    color: white;
  }
`

export const WithMask = ({ image, title, shortDescription }: IProps) => {
  const [width, setWidth] = useState<number>(0)
  
  const onRatioChange = useCallback((percentage, isBelowFold) => {
    if (isBelowFold){
      if (percentage > .7){
        setWidth(Math.min(1, Math.max(0, map(percentage, .7, .9, 0, 1))))
      }
      else{
        setWidth(0)
      }
    }
    else{
    }
  }, [setWidth])

  const ref = useIntersection({ callback: onRatioChange })
  return <Wrapper ref={ref} className="grid min-h-screen" style={{
    //@ts-ignore
    '--column-width': width + 'fr',
  }}>
    <div className="relative">
      <div className="flex place-content-center items-center h-full">
        <Image src={'https:' + image.fields.file.url} alt={image.fields.title} width={200} height={200} />
      </div>
    </div>
    {width !== 0 && <div className="relative bg-gray-400 text-white ">
      <OpacityDiv style={{
    //@ts-ignore
        '--opacity': width,
      }} className="w-[50vw] px-12 overflow-visible absolute top-1/2 -translate-y-1/2">
        <div className="text-2xl font-bold">{title}</div>
        <RichText data={shortDescription} />
      </OpacityDiv>
    </div>}
  </Wrapper>;
};
