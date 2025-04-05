
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Only apply mouse tracking on larger screens
    if (windowSize.width > 1024) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [windowSize.width]);

  // Calculate spotlight position for subtle lighting effect
  const spotlightX = mousePosition.x / windowSize.width * 100;
  const spotlightY = mousePosition.y / windowSize.height * 100;

  // Only apply spotlight effect on larger screens
  const spotlightStyle = windowSize.width > 1024 
    ? {
        backgroundImage: `radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <div className="flex flex-col min-h-screen relative">
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out z-10"
        style={spotlightStyle}
      />
      <Header />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
