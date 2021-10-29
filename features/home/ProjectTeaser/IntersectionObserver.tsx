import { useIntersection as nativeUseIntersection } from 'react-use';
import React,  { useRef, useEffect, ReactNode, useCallback, useMemo } from 'react';

export const useIntersection = ({ callback }: { callback: (percentage: number) => void; }) => {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = nativeUseIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  });
  const listener = useCallback((e) => {
    // compute percentage of div in viewport
    const { top } = intersectionRef.current?.getBoundingClientRect();
    const percentage = 1 - Math.abs(top / window.innerHeight);
    if (percentage > 0){
      callback?.(percentage);
    }
    else{
      window.removeEventListener('scroll', listener);
    }
  }, [callback]);

  useEffect(() => {
    if (intersection?.isIntersecting) {
      console.log('attaching listener')
      window.addEventListener('scroll', listener);
      return;
    }
    window.removeEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, [intersection?.isIntersecting, listener]);

  return intersectionRef
}
