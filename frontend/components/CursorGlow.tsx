'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);

  // Smooth physics-based spring animation for trailing cursor glow
  const cursorX = useSpring(-100, { damping: 25, stiffness: 250 });
  const cursorY = useSpring(-100, { damping: 25, stiffness: 250 });

  // Core tight dot spring
  const dotX = useSpring(-100, { damping: 35, stiffness: 400 });
  const dotY = useSpring(-100, { damping: 35, stiffness: 400 });

  useEffect(() => {
    // Only enable on devices that support hover (non-touch)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Large Ambient Neon Aura Glow */}
      <motion.div
        className="fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.22) 0%, rgba(168, 85, 247, 0.12) 45%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Inner Tight Neon Laser Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400/60 pointer-events-none z-50 shadow-[0_0_15px_rgba(0,242,254,0.6)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Core Glowing Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-300 pointer-events-none z-50 shadow-[0_0_10px_#00f2fe]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}