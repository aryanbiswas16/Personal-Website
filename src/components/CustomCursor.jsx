import React, { useEffect, useState, useRef } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const rafRef = useRef();

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let targetX = 0;
    let targetY = 0;

    const updatePosition = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth lerp for the ring
      cursorRef.current.x += (targetX - cursorRef.current.x) * 0.15;
      cursorRef.current.y += (targetY - cursorRef.current.y) * 0.15;
      
      setPosition({
        x: cursorRef.current.x,
        y: cursorRef.current.y
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button') ||
          target.classList.contains('projects-card') ||
          target.classList.contains('btn-primary') ||
          target.classList.contains('btn-secondary')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button') ||
          target.classList.contains('projects-card') ||
          target.classList.contains('btn-primary') ||
          target.classList.contains('btn-secondary')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(rafRef.current);
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
