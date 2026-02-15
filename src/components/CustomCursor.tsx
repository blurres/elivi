import { memo, useEffect, useRef } from 'react';

export const CustomCursor = memo(() => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const ringScaleRef = useRef(1);
  const enabledRef = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      enabledRef.current = finePointer.matches && !reducedMotion.matches;

      if (!enabledRef.current) {
        if (dotRef.current) dotRef.current.style.display = 'none';
        if (ringRef.current) ringRef.current.style.display = 'none';
      } else {
        if (dotRef.current) dotRef.current.style.display = 'block';
        if (ringRef.current) ringRef.current.style.display = 'block';
      }
    };

    const updateCursor = () => {
      rafRef.current = null;

      if (!enabledRef.current || !dotRef.current || !ringRef.current) return;

      const { x, y } = positionRef.current;
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${ringScaleRef.current})`;
    };

    const queueFrame = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(updateCursor);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enabledRef.current) return;
      positionRef.current = { x: event.clientX, y: event.clientY };
      queueFrame();
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (!enabledRef.current || !ringRef.current) return;

      const target = event.target as HTMLElement;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');

      ringScaleRef.current = isClickable ? 1.8 : 1;
      ringRef.current.style.opacity = isClickable ? '0.85' : '0.5';
      ringRef.current.style.backgroundColor = isClickable ? 'rgba(255,255,255,0.12)' : 'transparent';
      queueFrame();
    };

    const handlePointerLeave = () => {
      if (!enabledRef.current) return;
      positionRef.current = { x: -100, y: -100 };
      queueFrame();
    };

    updateEnabled();

    finePointer.addEventListener('change', updateEnabled);
    reducedMotion.addEventListener('change', updateEnabled);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      finePointer.removeEventListener('change', updateEnabled);
      reducedMotion.removeEventListener('change', updateEnabled);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999] will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-5 h-5 rounded-full border border-white/90 pointer-events-none z-[9998] will-change-transform transition-[opacity,background-color] duration-150"
        style={{ opacity: 0.5 }}
      />
    </>
  );
});

CustomCursor.displayName = 'CustomCursor';
