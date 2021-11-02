import React, { ReactNode, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

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
    let left = clientX - cLeft - width / 2;
    let top = clientY - cTop - height / 2;
    if(cWidth - width < 1 || cHeight - height < 1){ 
      return 
    }
    left = Math.min(Math.max(0, left), cWidth - width / 2);
    top = Math.min(Math.max(0, top), cHeight - height / 2);
    // console.log('not skipping', left, top)
    // console.log(left, cWidth, width, cWidth - width)
    setLeft(`${left}px`);
    setTop(`${top}px`);
  };
  const pos = useSpring({ left, top });
  return <div onMouseMove={onMouseMove} className={`group relative overflow-hidden ${className}`}>
    {React.useMemo(() => children, [])}
    <Pointer
      ref={ref}
      // @ts-ignore
      style={{ '--left': pos.left, '--top': pos.top } as any}
      onClick={onClick}
      className={`text-3xl font-bold group-hover:opacity-100 delay-[100ms] opacity-0 tr${onClick ? ' cursor-pointer' : ' pointer-events-none'}`}
    >{pointerTitle}</Pointer>
  </div>;
};
const Pointer = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(var(--left)) translateY(var(--top));
  transition: opacity .1s ease-out, color 0s;
  z-index: 1000;
  color: white;
  mix-blend-mode: difference;
  white-space: nowrap;
`;
