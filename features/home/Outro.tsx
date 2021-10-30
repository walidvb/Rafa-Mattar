import Link from 'next/link';
import { Slide } from './HomeScreen';
import { useState, useCallback } from 'react';
import { map } from '@shared/helpers/map';
import { useIntersection } from './ProjectTeaser/IntersectionObserver';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';

const Antoine = styled(animated.span)`
  transform: translateX(calc(0px - var(--x)));
  display: inline-block;
`
const Valeria = styled(animated.span)`
  transform: translateX(var(--x));
  display: inline-block;
`

export const Outro = () => {
  const [translate, setTranslate] = useState<number>(0)

  const onRatioChange = useCallback((percentage, isBelowFold) => {
    if (isBelowFold) {
      if (percentage > .3) {
        setTranslate(Math.min(1, Math.max(0, map(percentage, .3, 1, 0, 1))))
      }
      else {
        setTranslate(0)
      }
    }
    else {
      setTranslate(1)
    }
  }, [setTranslate])

  const ref = useIntersection({ callback: onRatioChange })

  const style = useSpring({
    // transform: `translateX(${translate * -100}%)`,
    "--x": (1 - translate) * 40 + 'px',
  })

  return <Slide ref={ref} className="grid place-content-center px-4 text-center min-h-[60vh] md:min-h-screen">
    <Link href="/team">
      <a className="text-4xl hover:text-brand">
        {/* @ts-ignore */}
        <Antoine style={style}>Antoine <br className="md:hidden" />Harari</Antoine>
        <br className="md:hidden" />
        &nbsp;/&nbsp;
        <br className="md:hidden" />
        {/* @ts-ignore */}
        <Valeria style={style}>Valeria <br className="md:hidden" />Mazzucchi</Valeria>
      </a>
    </Link>
    <div className="text-gray-400 mt-6">
      Founders of Futur Proche
    </div>
  </Slide>;
};
