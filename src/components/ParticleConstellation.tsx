import React, { useEffect, useRef } from 'react';

// Authentic Matrix Digital Rain with Ocean Aurora Palette
// Palette: Brilliant cyans (#00f0ff), Deep sky blues (#00a8ff), Vibrant mint greens (#39ff14), Soft teal (#20b2aa / #2dd4bf)
const AURORA_COLORS = [
  '#00f0ff', // brilliant cyan
  '#00a8ff', // deep sky blue
  '#39ff14', // vibrant mint green
  '#20b2aa', // soft teal
  '#2dd4bf', // luminous teal
  '#00f0ff', // brilliant cyan
];

const MATRIX_CHARS =
  'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF01XYZ:・.=*+-<>¦｜╌~#$@%&';

interface Column {
  x: number;
  y: number; // in row units
  speed: number;
  length: number;
  colorOffset: number;
  chars: string[];
}

export const ParticleConstellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const fontSize = 16;
    let columns: Column[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const initColumns = () => {
      const numCols = Math.ceil(width / fontSize);
      columns = [];
      for (let i = 0; i < numCols; i++) {
        const length = Math.floor(Math.random() * 20) + 12;
        const colChars: string[] = [];
        for (let j = 0; j < 50; j++) {
          colChars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }

        columns.push({
          x: i * fontSize,
          y: Math.floor(Math.random() * -(height / fontSize)), // staggered start
          speed: Math.random() * 0.4 + 0.65,
          length,
          colorOffset: Math.random() * AURORA_COLORS.length,
          chars: colChars,
        });
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Force pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      initColumns();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = 0;
    const fps = 36;
    const interval = 1000 / fps;
    let globalPhase = 0;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      globalPhase += 0.035;

      // Semi-transparent black overlay for decaying matrix trails on pure black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed;

        // Mouse proximity interaction: slight acceleration and glowing burst
        const distToMouse = Math.abs(col.x - mouseX);
        const isNearMouse = distToMouse < 90 && Math.abs(col.y * fontSize - mouseY) < 120;

        // Occasional glyph change inside the column for authentic matrix flicker
        if (Math.random() < 0.08) {
          const randIdx = Math.floor(Math.random() * col.chars.length);
          col.chars[randIdx] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        }

        const headY = Math.floor(col.y);
        const charX = col.x + fontSize / 2;

        // Draw trail of characters
        for (let j = 0; j < col.length; j++) {
          const charRow = headY - j;
          const charY = charRow * fontSize;

          if (charY < -fontSize || charY > height + fontSize) continue;

          const char = col.chars[Math.abs(charRow) % col.chars.length];

          if (j === 0) {
            // Head character: blazing white / electric cyan highlight
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = isNearMouse ? '#ffffff' : '#e0ffff';
            ctx.fillText(char, charX, charY);
            ctx.shadowBlur = 0;
          } else {
            // Trailing characters: smoothly cycle and shift through Ocean Aurora palette
            // (brilliant cyans #00f0ff, deep sky blues #00a8ff, vibrant mint greens #39ff14, soft teal #20b2aa)
            const colorProgress =
              (globalPhase + col.colorOffset + (j / col.length) * 2.5) % AURORA_COLORS.length;
            const colorIdx = Math.floor(colorProgress);
            const nextColorIdx = (colorIdx + 1) % AURORA_COLORS.length;
            const chosenColor =
              Math.random() < 0.15
                ? AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)]
                : AURORA_COLORS[colorIdx];

            // Fading alpha along the tail
            const fadeAlpha = Math.max(0.08, 1 - (j / col.length) * 0.95);

            ctx.globalAlpha = isNearMouse ? Math.min(1, fadeAlpha * 1.6) : fadeAlpha;
            ctx.fillStyle = isNearMouse ? '#39ff14' : chosenColor;

            // Subtle glow for upper trail characters
            if (j < 4) {
              ctx.shadowColor = chosenColor;
              ctx.shadowBlur = 6;
            } else {
              ctx.shadowBlur = 0;
            }

            ctx.fillText(char, charX, charY);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
          }
        }

        // Reset column to top once past bottom with random delay
        if (col.y * fontSize > height && Math.random() > 0.96) {
          col.y = Math.floor(Math.random() * -15);
          col.speed = Math.random() * 0.4 + 0.65;
          col.length = Math.floor(Math.random() * 20) + 12;
          col.colorOffset = (col.colorOffset + 1) % AURORA_COLORS.length;
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
      }}
    />
  );
};

export const MatrixDigitalRain = ParticleConstellation;
