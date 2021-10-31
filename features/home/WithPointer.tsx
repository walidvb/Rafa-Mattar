import { ReactNode, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useDebounce } from 'react-use';

export const WithPointer = ({ children, className = '', onClick,  pointerTitle }: { children: ReactNode; onClick?: () => void, className?: string, pointerTitle: string; }) => {
  const [top, setTop] = useState<string>('-100px');
  const [left, setLeft] = useState<string>('-100px');
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (evt: any) => {
    if (!ref.current) {
      return;
    }
    const { target, clientX, clientY } = evt;
    const pseudoRect = window.getComputedStyle(ref.current);
    const rect = target.getBoundingClientRect();
    const { width: cWidth, height: cHeight, left: cLeft, top: cTop } = rect
    const width = parseInt(pseudoRect.width);
    const height = parseInt(pseudoRect.height);
    let left = clientX - width / 2;
    let top = clientY - height / 2;
    if(cWidth - width < 1 || cHeight - height < 1){ 
      console.log('skipping', target)
      return 
    }
    left = Math.min(Math.max(cLeft, left), cWidth - width);
    top = Math.min(Math.max(cTop, top), rect.bottom - height);
    console.log('not skipping', left, top)
    // console.log(left, cWidth, width, cWidth - width)
    setLeft(`${left}px`);
    setTop(`${top}px`);
  };
  const pos = useSpring({ left, top });
  return <div onMouseMove={onMouseMove} className={`group ${className}`}>
    {children}
    <Pointer
      ref={ref}
      style={pos}
      onClick={onClick}
      className={`text-3xl font-bold group-hover:opacity-100 delay-[100ms] opacity-0 transition-all tr${onClick ? ' cursor-pointer' : ' pointer-events-none'}`}
    >{pointerTitle}</Pointer>
  </div>;
};
const Pointer = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(var(--left)) translateY(var(--top));
  transition: all .1s ease-out, color 0s;
  z-index: 1000;
  color: white;
  mix-blend-mode: difference;
  white-space: nowrap;
`;
