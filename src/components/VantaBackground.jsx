import React, { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min.js";
import * as THREE from "three";

// Reusable Vanta background (NET effect) that sits behind the app content
const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!vantaEffect && vantaRef.current && !prefersReducedMotion) {
      const effect = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x40e0d0, // turquoise to match highlights
        backgroundColor: 0x1a1a2e,
        // NET light: fewer points, wider spacing, shorter line connections
        points: 9.0,
        maxDistance: 16.0,
        spacing: 24.0,
      });
      setVantaEffect(effect);
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="vanta-bg" aria-hidden />;
};

export default VantaBackground;
