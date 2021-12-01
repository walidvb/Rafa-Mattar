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
        <span className="md:hidden">
          <br />
          –
          <br />
        </span>
        <span className="hidden md:inline-block">
          &nbsp;/&nbsp;
        </span>
        {/* @ts-ignore */}
        <Valeria style={style}>Valeria <br className="md:hidden" />Mazzucchi</Valeria>
      </a>
    </Link>
    <div>
      <a title="contact us" className="inline-block px-10 font-bold py-2 rounded-full uppercase bg-brand text-white mt-32 hover:opacity-75 transition-all" href="mailto:info@futurproche.ch"> Write to us</a>
    </div>
  </Slide>;
};
