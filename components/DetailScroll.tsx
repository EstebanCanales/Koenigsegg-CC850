'use client';
import { useEffect, useRef, useState } from 'react';

const LOAD_AHEAD = 14;
const LOAD_BEHIND = 5;
const MAX_CACHE_DISTANCE = 28;

function pad(number: number, length: number): string {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
}

interface DetailScrollProps {
  path: string;
  startFrame: number;
  endFrame: number;
  height?: string;
  dynamicTitles?: string[];
  subtitle?: string;
}

export default function DetailScroll({
  path,
  startFrame,
  endFrame,
  height = '400vh',
  dynamicTitles,
  subtitle,
}: DetailScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<number>>(new Set());
  const [isPrimed, setIsPrimed] = useState(false);
  const [currentTitleIdx, setCurrentTitleIdx] = useState(0);

  const totalFrames = endFrame - startFrame + 1;

  useEffect(() => {
    cacheRef.current.clear();
    loadingRef.current.clear();
    setIsPrimed(false);

    let alive = true;

    const loadFrame = (relativeIndex: number) => {
      if (relativeIndex < 0 || relativeIndex >= totalFrames) return;
      if (cacheRef.current.has(relativeIndex) || loadingRef.current.has(relativeIndex)) return;

      loadingRef.current.add(relativeIndex);
      const img = new Image();
      const absoluteFrame = startFrame + relativeIndex;

      img.onload = () => {
        if (!alive) return;
        cacheRef.current.set(relativeIndex, img);
        loadingRef.current.delete(relativeIndex);
        if (relativeIndex === 0) {
          setIsPrimed(true);
        }
      };

      img.onerror = () => {
        loadingRef.current.delete(relativeIndex);
      };

      img.src = `${path}${pad(absoluteFrame, 4)}.png`;
    };

    // Start with first frame only.
    loadFrame(0);

    return () => {
      alive = false;
    };
  }, [path, startFrame, totalFrames]);

  useEffect(() => {
    if (!isPrimed) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const firstFrame = cacheRef.current.get(0);
    if (!canvas || !container || !firstFrame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = firstFrame.width;
    canvas.height = firstFrame.height;

    let isActive = false;
    let ticking = false;
    let renderedFrame = -1;

    const loadFrame = (relativeIndex: number) => {
      if (relativeIndex < 0 || relativeIndex >= totalFrames) return;
      if (cacheRef.current.has(relativeIndex) || loadingRef.current.has(relativeIndex)) return;

      loadingRef.current.add(relativeIndex);
      const img = new Image();
      const absoluteFrame = startFrame + relativeIndex;

      img.onload = () => {
        cacheRef.current.set(relativeIndex, img);
        loadingRef.current.delete(relativeIndex);
      };

      img.onerror = () => {
        loadingRef.current.delete(relativeIndex);
      };

      img.src = `${path}${pad(absoluteFrame, 4)}.png`;
    };

    const ensureWindowLoaded = (center: number) => {
      const start = Math.max(0, center - LOAD_BEHIND);
      const end = Math.min(totalFrames - 1, center + LOAD_AHEAD);
      for (let i = start; i <= end; i++) {
        loadFrame(i);
      }

      for (const frameIndex of cacheRef.current.keys()) {
        if (frameIndex === 0) continue;
        if (Math.abs(frameIndex - center) > MAX_CACHE_DISTANCE) {
          cacheRef.current.delete(frameIndex);
        }
      }
    };

    const nearestLoaded = (target: number) => {
      if (cacheRef.current.has(target)) return target;

      let offset = 1;
      while (offset < totalFrames) {
        const right = target + offset;
        if (right < totalFrames && cacheRef.current.has(right)) return right;

        const left = target - offset;
        if (left >= 0 && cacheRef.current.has(left)) return left;

        offset += 1;
      }

      return 0;
    };

    const render = () => {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;

      let progress = -rect.top / Math.max(1, rect.height - windowH);
      progress = Math.max(0, Math.min(1, progress));

      if (dynamicTitles && dynamicTitles.length > 0) {
        const idx = Math.min(Math.floor(progress * dynamicTitles.length), dynamicTitles.length - 1);
        setCurrentTitleIdx((prev) => (prev === idx ? prev : idx));
      }

      const targetFrame = Math.min(Math.floor(progress * (totalFrames - 1)), totalFrames - 1);
      ensureWindowLoaded(targetFrame);

      const frameToDraw = nearestLoaded(targetFrame);
      const frame = cacheRef.current.get(frameToDraw);
      if (frame && frameToDraw !== renderedFrame) {
        renderedFrame = frameToDraw;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      }
    };

    const onScroll = () => {
      if (!isActive || ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        render();
        ticking = false;
      });
    };

    const onResize = () => {
      if (!isActive) return;
      render();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive = Boolean(entry?.isIntersecting);
        if (isActive) {
          render();
        }
      },
      { rootMargin: '350px 0px 350px 0px' },
    );

    observer.observe(container);

    ensureWindowLoaded(0);
    render();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [isPrimed, path, startFrame, totalFrames, dynamicTitles]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#F3F4F3]" style={{ height }}>
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full object-cover mix-blend-multiply"></canvas>

        <div className="absolute inset-0 z-20 p-12 md:p-24 pointer-events-none flex flex-col justify-start">
          {subtitle && (
            <p className="text-[11px] tracking-[0.4em] uppercase font-bold opacity-40 mb-4">{subtitle}</p>
          )}

          <div className="relative h-32 overflow-hidden">
            {dynamicTitles?.map((title, index) => (
              <h4
                key={title}
                className={`absolute top-0 left-0 text-5xl md:text-8xl italic leading-none transition-all duration-1000 ease-in-out transform ${
                  index === currentTitleIdx
                    ? 'opacity-90 translate-y-0'
                    : index < currentTitleIdx
                      ? 'opacity-0 -translate-y-8'
                      : 'opacity-0 translate-y-8'
                }`}
              >
                {title}
              </h4>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
