import { ReactNode, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

export const WithPointer = ({ children, className = '', onClick,  pointerTitle }: { children: ReactNode; onClick?: () => void, className?: string, pointerTitle: string; }) => {
  const [top, setTop] = useState<string>('0px');
  const [left, setLeft] = useState<string>('0px');
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (evt: any) => {
    if (!ref.current) {
      return;
    }
    const { target, clientX, clientY } = evt;
    const pseudoRect = window.getComputedStyle(ref.current);
    const width = parseInt(pseudoRect.width);
    const height = parseInt(pseudoRect.height);
    const rect = target.getBoundingClientRect();
    let left = clientX - width / 2;
    let top = clientY - height / 2;

    left = Math.min(Math.max(0, left), window.innerWidth);
    //  top = Math.min(Math.max(height / 2, top), rect.height - height / 2);
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
      className={`text-2xl font-bold group-hover:inline hidden${onClick ? ' cursor-pointer' : ' pointer-events-none'}`}
    >{pointerTitle}</Pointer>
  </div>;
};
const Pointer = styled(animated.div)`
  position: fixed;
  top: var(--top);
  left: var(--left);
  transition: all .1s ease-out, color 0s;
  z-index: 1000;
  
`;
