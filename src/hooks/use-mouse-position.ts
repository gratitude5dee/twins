
import { useState, useEffect } from 'react';

type MousePosition = {
  x: number;
  y: number;
  elementX: number;
  elementY: number;
};

export function useMousePosition(elementRef: React.RefObject<HTMLElement>) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
  });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!elementRef.current) return;
      
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      
      // Get mouse position within the viewport
      const x = ev.clientX;
      const y = ev.clientY;
      
      // Calculate position relative to the element (0 to 1)
      const elementX = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
      const elementY = Math.min(Math.max((y - rect.top) / rect.height, 0), 1);
      
      setMousePosition({ x, y, elementX, elementY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [elementRef]);

  return mousePosition;
}
