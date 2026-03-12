import React, { useEffect, useState } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.closest('a') || 
          e.target.closest('button') ||
          e.target.classList.contains('projects-card')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Don't show on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div 
        className={`cursor-dot ${isClicking ? 'clicking' : ''}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      />
      <div 
        className={`cursor-ring ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </>
  );
};

export default CustomCursor;
