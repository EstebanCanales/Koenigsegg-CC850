'use client';
import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 233;
const PATH = '/frames/video1/frame_';

function pad(number: number, length: number): string {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [loadedFrames, setLoadedFrames] = useState(0);

    useEffect(() => {
        let loaded = 0;
        if (imagesRef.current.length > 0) return;
        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.onload = () => {
                loaded++;
                setLoadedFrames(loaded);
            };
            img.src = `${PATH}${pad(i + 1, 4)}.png`;
            imagesRef.current[i] = img;
        }
    }, []);

    useEffect(() => {
        if (loadedFrames < FRAME_COUNT) return;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = imagesRef.current[0].width;
        canvas.height = imagesRef.current[0].height;
        
        let ticking = false;
        let currentFrame = -1;

        const render = () => {
            const scrollY = window.scrollY;
            const windowH = window.innerHeight;
            const rect = container.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionScrollSpan = rect.height - windowH;
            
            let progress = (scrollY - sectionTop) / sectionScrollSpan;
            progress = Math.max(0, Math.min(1, progress));
            
            const ANIMATION_END = 0.85;
            let animProgress = Math.min(progress / ANIMATION_END, 1.0);
            const targetFrame = Math.min(Math.floor(animProgress * FRAME_COUNT), FRAME_COUNT - 1);
            
            canvas.style.transform = 'none';

            const FADE_START = 0.94;
            let opacity = 1.0;
            if (progress > FADE_START) {
                opacity = 1.0 - ((progress - FADE_START) / (1.0 - FADE_START));
            }
            canvas.style.opacity = opacity.toString();

            if (currentFrame !== targetFrame) {
                currentFrame = targetFrame;
                if (imagesRef.current[targetFrame]) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(imagesRef.current[targetFrame], 0, 0, canvas.width, canvas.height);
                }
            }
            
            const t1 = document.getElementById('title-1');
            const t2 = document.getElementById('title-2');
            const t3 = document.getElementById('title-3');

            if (t1) {
                let t1Opacity = 1;
                if (animProgress > 0.2) t1Opacity = 1 - (animProgress - 0.2) / 0.1;
                t1.style.opacity = Math.max(0, t1Opacity).toString();
                t1.style.transform = 'none';
            }
            if (t2) {
                let t2Opacity = 0;
                if (animProgress > 0.35 && animProgress < 0.65) {
                    t2Opacity = Math.min((animProgress - 0.35) / 0.1, 1);
                    if (animProgress > 0.55) t2Opacity = 1 - (animProgress - 0.55) / 0.1;
                }
                t2.style.opacity = t2Opacity.toString();
                t2.style.transform = 'none';
            }
            if (t3) {
                const t3Opacity = animProgress > 0.7 ? Math.min((animProgress - 0.7) / 0.15, 1.0) : 0;
                t3.style.opacity = (t3Opacity * opacity).toString();
                t3.style.transform = 'none';
            }
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    render();
                    ticking = false;
                });
                ticking = true;
            }
        };

        render();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [loadedFrames]);

    return (
        <div ref={containerRef} className="relative w-full h-[1200vh] bg-[#F3F4F3]">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
                <canvas 
                    ref={canvasRef} 
                    className={`absolute top-0 left-0 w-full h-full object-contain z-0 mix-blend-multiply transition-opacity duration-1000 ${loadedFrames >= FRAME_COUNT ? 'opacity-100' : 'opacity-0'}`}
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
                            The 50 Year <br/><span className="italic text-[0.8em]">Manifesto.</span>
                        </h2>
                        <p className="text-[11px] font-serif tracking-[0.4em] uppercase font-bold opacity-40">Resurrecting the Manual</p>
                    </div>
                    
                    <div id="title-3" className="absolute top-1/4 right-12 md:right-24 text-right opacity-0">
                        <h2 className="text-4xl md:text-7xl font-serif tracking-tighter text-[#111111] leading-[0.8] mb-8">
                            Absolute<br/><span className="italic">Link.</span>
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
