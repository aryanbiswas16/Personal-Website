import React, { useEffect, useRef } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId;
    let isHovering = false;
    let isClicking = false;

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Move dot instantly with transform
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const animate = () => {
      // Smooth follow for ring
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;
      
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const handleDown = () => {
      isClicking = true;
      dot.classList.add('clicking');
      ring.classList.add('clicking');
    };

    const handleUp = () => {
      isClicking = false;
      dot.classList.remove('clicking');
      ring.classList.remove('clicking');
    };

    const handleOver = (e) => {
      if (e.target.closest('a, button, .projects-card, [role="button"]')) {
        isHovering = true;
        ring.classList.add('hovering');
      }
    };

    const handleOut = (e) => {
      if (e.target.closest('a, button, .projects-card, [role="button"]')) {
        isHovering = false;
        ring.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
