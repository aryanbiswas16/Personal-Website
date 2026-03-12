import React, { useEffect, useState, useRef } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId;
    let isActive = true;

    const handleMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (!isActive) return;

      // Dot follows instantly
      dotRef.current = targetRef.current;

      // Ring follows with smooth delay (higher lerp = more delay/smoothness)
      ringRef.current.x += (targetRef.current.x - ringRef.current.x) * 0.12;
      ringRef.current.y += (targetRef.current.y - ringRef.current.y) * 0.12;

      setDotPos(dotRef.current);
      setRingPos({ ...ringRef.current });

      rafId = requestAnimationFrame(animate);
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    const handleOver = (e) => {
      const t = e.target;
      if (t.closest('a, button, .projects-card, .btn-primary, .btn-secondary')) {
        setIsHovering(true);
      }
    };

    const handleOut = (e) => {
      const t = e.target;
      if (t.closest('a, button, .projects-card, .btn-primary, .btn-secondary')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    rafId = requestAnimationFrame(animate);

    return () => {
      isActive = false;
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
      <div className={`cursor-dot ${isClicking ? 'clicking' : ''}`}
        style={{ left: dotPos.x, top: dotPos.y }} />
      <div className={`cursor-ring ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{ left: ringPos.x, top: ringPos.y }} />
    </>
  );
};

export default CustomCursor;
