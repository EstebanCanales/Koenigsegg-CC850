'use client';
import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 233;
const PATH = '/frames/video1/frame_';
const LOAD_AHEAD = 16;
const LOAD_BEHIND = 6;
const MAX_CACHE_DISTANCE = 36;

function pad(number: number, length: number): string {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
}

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<number>>(new Set());
  const [isPrimed, setIsPrimed] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadFrame = (frameIndex: number) => {
      if (frameIndex < 0 || frameIndex >= FRAME_COUNT) return;
      if (cacheRef.current.has(frameIndex) || loadingRef.current.has(frameIndex)) return;

      loadingRef.current.add(frameIndex);
      const img = new Image();

      img.onload = () => {
        if (!alive) return;
        cacheRef.current.set(frameIndex, img);
        loadingRef.current.delete(frameIndex);
        if (frameIndex === 0) {
          setIsPrimed(true);
        }
      };

      img.onerror = () => {
        loadingRef.current.delete(frameIndex);
      };

      img.src = `${PATH}${pad(frameIndex + 1, 4)}.png`;
    };

    // First paint fast: only first frame.
    loadFrame(0);

    return () => {
      alive = false;
    };
  }, []);

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
    let currentFrame = -1;

    const loadFrame = (frameIndex: number) => {
      if (frameIndex < 0 || frameIndex >= FRAME_COUNT) return;
      if (cacheRef.current.has(frameIndex) || loadingRef.current.has(frameIndex)) return;

      loadingRef.current.add(frameIndex);
      const img = new Image();

      img.onload = () => {
        cacheRef.current.set(frameIndex, img);
        loadingRef.current.delete(frameIndex);
      };

      img.onerror = () => {
        loadingRef.current.delete(frameIndex);
      };

      img.src = `${PATH}${pad(frameIndex + 1, 4)}.png`;
    };

    const ensureWindowLoaded = (center: number) => {
      const start = Math.max(0, center - LOAD_BEHIND);
      const end = Math.min(FRAME_COUNT - 1, center + LOAD_AHEAD);
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

    const findNearestLoadedFrame = (target: number) => {
      if (cacheRef.current.has(target)) return target;

      let offset = 1;
      while (offset < FRAME_COUNT) {
        const right = target + offset;
        if (right < FRAME_COUNT && cacheRef.current.has(right)) return right;

        const left = target - offset;
        if (left >= 0 && cacheRef.current.has(left)) return left;

        offset += 1;
      }

      return 0;
    };

    const render = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionScrollSpan = Math.max(1, rect.height - windowH);

      let progress = (scrollY - sectionTop) / sectionScrollSpan;
      progress = Math.max(0, Math.min(1, progress));

      const ANIMATION_END = 0.85;
      const animProgress = Math.min(progress / ANIMATION_END, 1);
      const targetFrame = Math.min(Math.floor(animProgress * FRAME_COUNT), FRAME_COUNT - 1);

      ensureWindowLoaded(targetFrame);

      const frameToDraw = findNearestLoadedFrame(targetFrame);
      const frame = cacheRef.current.get(frameToDraw);
      if (frame && currentFrame !== frameToDraw) {
        currentFrame = frameToDraw;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      }

      const FADE_START = 0.94;
      let opacity = 1;
      if (progress > FADE_START) {
        opacity = 1 - (progress - FADE_START) / (1 - FADE_START);
      }
      canvas.style.opacity = opacity.toString();

      const t1 = document.getElementById('title-1');
      const t2 = document.getElementById('title-2');
      const t3 = document.getElementById('title-3');

      if (t1) {
        let t1Opacity = 1;
        if (animProgress > 0.2) t1Opacity = 1 - (animProgress - 0.2) / 0.1;
        t1.style.opacity = Math.max(0, t1Opacity).toString();
      }

      if (t2) {
        let t2Opacity = 0;
        if (animProgress > 0.35 && animProgress < 0.65) {
          t2Opacity = Math.min((animProgress - 0.35) / 0.1, 1);
          if (animProgress > 0.55) t2Opacity = 1 - (animProgress - 0.55) / 0.1;
        }
        t2.style.opacity = t2Opacity.toString();
      }

      if (t3) {
        const t3Opacity = animProgress > 0.7 ? Math.min((animProgress - 0.7) / 0.15, 1) : 0;
        t3.style.opacity = (t3Opacity * opacity).toString();
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
      { rootMargin: '400px 0px 400px 0px' },
    );

    observer.observe(container);

    // Prime next range after the first frame is visible.
    ensureWindowLoaded(0);
    render();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [isPrimed]);

  return (
    <div ref={containerRef} className="relative w-full h-[700vh] bg-[#F3F4F3]">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full object-contain z-0 mix-blend-multiply transition-opacity duration-1000 ${
            isPrimed ? 'opacity-100' : 'opacity-0'
          }`}
        ></canvas>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-1 w-[22vw] bg-linear-to-r from-[#F3F4F3] via-[#F3F4F3]/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-1 w-[22vw] bg-linear-to-l from-[#F3F4F3] via-[#F3F4F3]/50 to-transparent" />

        <div className="relative z-10 w-full h-full pointer-events-none p-12 md:p-24 text-[#111111]">
          <div id="title-1" className="absolute top-32 left-0 w-full text-center">
            <h1 className="text-4xl md:text-8xl font-serif tracking-tight leading-none mb-4">
              Tactile <span className="italic">Reality.</span>
            </h1>
            <p className="text-[11px] font-serif tracking-[0.4em] uppercase font-bold opacity-40">Engineering Emotion</p>
          </div>

          <div id="title-2" className="absolute top-40 left-12 md:left-24 text-left opacity-0">
            <h2 className="text-3xl md:text-6xl font-serif tracking-tight leading-none mb-4">
              The 50 Year <br />
              <span className="italic text-[0.8em]">Manifesto.</span>
            </h2>
            <p className="text-[11px] font-serif tracking-[0.4em] uppercase font-bold opacity-40">Resurrecting the Manual</p>
          </div>

          <div id="title-3" className="absolute top-1/4 right-12 md:right-24 text-right opacity-0">
            <h2 className="text-4xl md:text-7xl font-serif tracking-tighter text-[#111111] leading-[0.8] mb-8">
              Absolute
              <br />
              <span className="italic">Link.</span>
            </h2>
            <div className="flex flex-col items-end">
              <p className="text-[11px] font-serif tracking-[0.4em] uppercase mb-4 font-bold border-b border-[#111111]/10 pb-2 opacity-40">Ängelholm Sweden</p>
              <p className="text-lg md:text-xl font-serif tracking-tight font-light max-w-xs leading-relaxed italic text-right opacity-60">
                A mechanical masterpiece that possesses a heart, a soul, and a gear lever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
