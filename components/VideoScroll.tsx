'use client';
import { useEffect, useRef, useState } from 'react';

interface VideoScrollProps {
  src: string;
  height?: string;
  zoomAmount?: number;
}

export default function VideoScroll({ src, height = "150vh", zoomAmount = 0.15 }: VideoScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      video.currentTime = 0.001; // Prep first frame
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoaded);

    const handleScroll = () => {
      if (!containerRef.current || !video || !video.duration) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // LOGIC: Animation completes at 90% to avoid abrupt cuts
      const ANIMATION_END = 0.9;
      let progress = (windowH - rect.top) / (rect.height + windowH);
      progress = Math.max(0, Math.min(1, progress));
      
      let animProgress = Math.min(progress / ANIMATION_END, 1.0);

      // Seek video frame smoothly
      video.currentTime = video.duration * animProgress;

      // NEW LOGIC: Zoom OUT (like the first scroll) to keep it in frame
      // Starts at 1.0 and shrinks slightly to 0.9
      const currentScale = 1.0 - (animProgress * zoomAmount);
      video.style.transform = `scale(${currentScale})`;
      
      // Sync opacity with the end of the section
      const FADE_START = 0.92;
      let opacity = 0.9;
      if (progress > FADE_START) {
        opacity = 0.9 * (1.0 - ((progress - FADE_START) / (1.0 - FADE_START)));
      }
      video.style.opacity = opacity.toString();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [src, zoomAmount]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#F3F4F3]" style={{ height }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src={src}
          className="w-screen h-screen object-contain z-0 mix-blend-multiply transition-transform duration-75 ease-out will-change-transform"
          muted
          playsInline
          preload="auto"
          style={{
            maskImage: 'radial-gradient(circle, black 50%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 95%)'
          }}
        />
      </div>
    </div>
  );
}
