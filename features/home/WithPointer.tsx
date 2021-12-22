import React, { ReactNode, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

export const WithPointer = ({ children, className = '', onClick, pointerTitle, within = true }: { children: ReactNode; onClick?: () => void, className?: string, pointerTitle: string; within: boolean }) => {
  const [top, setTop] = useState<string>('-100px');
  const [left, setLeft] = useState<string>('-100px');
  const ref = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const onMouseMove = (evt: any) => {
    if (!ref.current || !wrapper.current) {
      return;
    }
    const { clientX, clientY } = evt;
    const pseudoRect = window.getComputedStyle(ref.current);
    const rect = wrapper.current.getBoundingClientRect();
    const { width: cWidth, height: cHeight, left: cLeft, top: cTop } = rect
    const width = parseInt(pseudoRect.width);
    const height = parseInt(pseudoRect.height);
    let left, top;
    if(within) {
      left = clientX - cLeft - width / 2;
      top = clientY - cTop - height / 2;
      left = Math.min(Math.max(0, left), cWidth - width);
      top = Math.min(Math.max(0, top), cHeight - height) + 'px';
    }
    else {
      left = clientX - cLeft - width / 2;
      top = `100%`;
    }
    setLeft(`${left}px`);
    setTop(`${top}`);
  };
  const pos = useSpring({ left, top });
  return <div ref={wrapper} onMouseMove={onMouseMove} className={`group relative ${within && 'overflow-hidden'} ${className}`}>
    {React.useMemo(() => children, [children])}
    <Pointer
      ref={ref}
      // @ts-ignore
      within={within}
      // @ts-ignore
      style={{ '--left': pos.left, '--top': pos.top } as any}
      onClick={onClick}
      className={`${within ? 'text-3xl font-bold' : ' duration-[400ms]'} delay-[100ms] group-hover:opacity-100  opacity-0 tr${onClick ? ' cursor-pointer' : ' pointer-events-none'} w-xs`}
    >
      {pointerTitle}
      </Pointer>
  </div>;
};

const Pointer = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(var(--left)) translateY(var(--top));
  transition: opacity .1s ease-out, color 0s;
  z-index: 1000;
  white-space: nowrap;
  
  ${
    // @ts-ignore
    ({ within }) => within ? 
  `
    color: white;
    mix-blend-mode: difference;
  ` :
  `
    color: black
  `
}
`;
