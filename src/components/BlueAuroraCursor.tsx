import React, { useEffect, useRef, useState } from 'react';

export const BlueAuroraCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Default to visible immediately upon mount
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply global cursor: none so default system pointer is completely hidden
    const styleEl = document.createElement('style');
    styleEl.id = 'aurora-hide-cursor';
    styleEl.innerHTML = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Instant positioning for central inner dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Detect if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive =
          target.closest(
            'button, a, input, select, textarea, [role="button"], [role="link"], .cursor-pointer, [data-interactive="true"]'
          ) !== null ||
          window.getComputedStyle(target).cursor === 'pointer';
        setIsHovered(interactive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial position sync
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }

    // Physics lag loop: smooth linear interpolation (LERP)
    const updatePhysics = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      const existingStyle = document.getElementById('aurora-hide-cursor');
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, []);

  const ringSize = isClicked ? 30 : isHovered ? 60 : 42;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999999] transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer Trailing Ring with physics lag & flowing electric blue/sapphire/cyan gradient */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center transition-[width,height] duration-200 ease-out"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-spin-slow transition-all duration-200"
          style={{
            filter: isHovered
              ? 'drop-shadow(0 0 10px #00f0ff) drop-shadow(0 0 20px #0044ff) drop-shadow(0 0 35px rgba(0, 240, 255, 0.8))'
              : 'drop-shadow(0 0 6px #00f0ff) drop-shadow(0 0 14px rgba(0, 68, 255, 0.9)) drop-shadow(0 0 22px rgba(0, 240, 255, 0.6))',
          }}
        >
          <defs>
            <linearGradient id="blueAuroraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="35%" stopColor="#0044ff" stopOpacity="1" />
              <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="1" />
            </linearGradient>
            <radialGradient id="auroraInnerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity={isHovered ? '0.35' : '0.15'} />
              <stop offset="60%" stopColor="#0044ff" stopOpacity={isHovered ? '0.2' : '0.05'} />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Semi-transparent inner aura backing */}
          <circle cx="50" cy="50" r="43" fill="url(#auroraInnerGlow)" />

          {/* Primary High-Visibility Glowing Ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#blueAuroraGradient)"
            strokeWidth={isHovered ? '6' : '4.5'}
            strokeLinecap="round"
          />

          {/* Crisp Bright White-Cyan Inner Edge Highlight */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity={isHovered ? '0.9' : '0.65'}
            strokeDasharray="18 12 30 8"
          />
        </svg>

        {/* Ambient Pulsing Aura for interactive hovering */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.6) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Inner Central Dot: Ultra-Bright White Core + Glowing Cyan/Neon Blue Radiance */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform rounded-full transition-all duration-100 ease-out flex items-center justify-center"
        style={{
          width: isClicked ? '8px' : isHovered ? '13px' : '10px',
          height: isClicked ? '8px' : isHovered ? '13px' : '10px',
          background: 'radial-gradient(circle, #ffffff 40%, #00f0ff 100%)',
          border: '1.5px solid #ffffff',
          boxShadow: isHovered
            ? '0 0 12px #ffffff, 0 0 24px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #0044ff, 0 0 80px rgba(0, 240, 255, 0.9)'
            : '0 0 8px #ffffff, 0 0 18px #00f0ff, 0 0 30px #00f0ff, 0 0 45px #0044ff, 0 0 65px rgba(0, 68, 255, 0.8)',
        }}
      >
        {/* Intense white center point */}
        <span className="w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
      </div>
    </div>
  );
};
