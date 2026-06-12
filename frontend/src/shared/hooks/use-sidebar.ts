import { useCallback, useEffect, useState } from "react";

const BREAKPOINT_MD = 768;

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= BREAKPOINT_MD
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  
useEffect (() => {
  const handleResize =()  => {
    if (window.innerWidth < BREAKPOINT_MD) setIsOpen(false)
      else setIsOpen(true);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

return {isOpen, open, close, toggle};
};  
