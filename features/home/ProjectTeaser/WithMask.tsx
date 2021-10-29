import Image from 'next/image';
import RichText from '@shared/ui/RichText';
import { IProps } from './index';
import styled from 'styled-components';
import { useIntersection } from './IntersectionObserver';
import { useCallback, useState } from 'react';
import { map } from '@shared/helpers';

const Wrapper = styled.div`
  grid-template-columns: 1fr var(--column-width, 0);
`

export const WithMask = ({ image, title, shortDescription }: IProps) => {
  const [width, setWidth] = useState<number>(0)
  
  const onRatioChange = useCallback((percentage) => {
    setWidth(map(percentage, .5, 1, 0, .5))
  }, [setWidth])

  useIntersection({ callback: onRatioChange })
  return <Wrapper className="grid min-h-screen" style={{
    //@ts-ignore
    '--column-width': width + 'fr',
  }}>
    <div className="relative">
      <Image src={'https:' + image.fields.file.url} alt={image.fields.title} layout="fill" objectFit="cover" />
    </div>
    <div>
      <div className="text-xl font-bold">{title}</div>
      {/* <RichText data={shortDescription} /> */}
    </div>
  </Wrapper>;
};
