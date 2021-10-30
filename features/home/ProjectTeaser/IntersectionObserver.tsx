import { useIntersection as nativeUseIntersection } from 'react-use';
import React,  { useRef, useEffect, ReactNode, useCallback, useMemo } from 'react';

export const useIntersection = ({ callback }: { callback: (percentage: number, isBelowFold: boolean) => void; }) => {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = nativeUseIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  });
  const listener = useCallback((e) => {
    // compute percentage of div in viewport
    //@ts-ignore
    const rect = intersectionRef.current?.getBoundingClientRect();
    if(!rect){
      rmListener(listener)
      return
    }
    const { top } = rect
    const percentage = 1 - Math.abs(top / window.innerHeight);
    if (percentage > 0){
      callback?.(percentage, top > 0);
    }
    else{
      rmListener(listener)
    }
  }, [callback]);
  
  const rmListener = (l: any) => {
    window.removeEventListener('scroll', l);
  }

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
