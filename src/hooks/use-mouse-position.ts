
import { useState, useEffect, RefObject } from 'react';

type MousePosition = {
  x: number;
  y: number;
  elementX: number; // Normalized 0-1 position relative to element width
  elementY: number; // Normalized 0-1 position relative to element height
  velocityX?: number; // Optional velocity tracking
  velocityY?: number;
};

interface UseMousePositionOptions {
  trackVelocity?: boolean;
  throttleMs?: number;
}

/**
 * Enhanced hook to track mouse position with optional velocity tracking
 * and efficient throttling for performance optimization.
 */
export function useMousePosition(
  elementRef: RefObject<HTMLElement>,
  options: UseMousePositionOptions = {}
) {
  const { 
    trackVelocity = false, 
    throttleMs = 16 // ~60fps
  } = options;
  
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0.5, // Start centered
    elementY: 0.5,
    ...(trackVelocity ? { velocityX: 0, velocityY: 0 } : {})
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastX = 0;
    let lastY = 0;
    let lastUpdateTime = 0;
    let requestId: number | null = null;

    // Throttled update function for better performance
    const updateMousePosition = (ev: MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime < throttleMs) {
        if (!requestId) {
          requestId = requestAnimationFrame(() => {
            processMouseMove(ev, currentTime);
            requestId = null;
          });
        }
        return;
      }
      
      processMouseMove(ev, currentTime);
    };

    const processMouseMove = (ev: MouseEvent, currentTime: number) => {
      if (!elementRef.current) return;
      
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      
      // Get mouse position within the viewport
      const x = ev.clientX;
      const y = ev.clientY;
      
      // Calculate position relative to the element (0 to 1)
      const elementX = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
      const elementY = Math.min(Math.max((y - rect.top) / rect.height, 0), 1);
      
      // Calculate velocity if tracking is enabled
      let velocityData = {};
      if (trackVelocity && lastUpdateTime > 0) {
        const deltaTime = currentTime - lastUpdateTime;
        if (deltaTime > 0) {
          const velocityX = (x - lastX) / deltaTime;
          const velocityY = (y - lastY) / deltaTime;
          velocityData = { velocityX, velocityY };
        }
      }
      
      setMousePosition({ 
        x, 
        y, 
        elementX, 
        elementY,
        ...velocityData
      });
      
      lastX = x;
      lastY = y;
      lastUpdateTime = currentTime;
    };

    // Track mouse move events on the window
    window.addEventListener('mousemove', updateMousePosition);
    
    // Setting default values when mouse leaves viewport
    const handleMouseLeave = () => {
      setMousePosition(prev => ({
        ...prev,
        elementX: 0.5,
        elementY: 0.5,
        ...(trackVelocity ? { velocityX: 0, velocityY: 0 } : {})
      }));
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, [elementRef, trackVelocity, throttleMs]);

  return mousePosition;
}
