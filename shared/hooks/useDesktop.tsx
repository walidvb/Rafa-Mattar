import { useState, useEffect } from 'react';

export const useDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth > 800);
    window.addEventListener('resize', () => {
      setIsDesktop(window.innerWidth > 800);
    });
    return () => window.removeEventListener('resize', () => { });
  }, []);

  return isDesktop;
};
