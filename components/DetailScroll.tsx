'use client';
import { useEffect, useRef, useState } from 'react';

function pad(number: number, length: number): string {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
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
    height = "400vh", 
    dynamicTitles,
    subtitle 
}: DetailScrollProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentTitleIdx, setCurrentTitleIdx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        let loaded = 0;
        const totalToLoad = endFrame - startFrame + 1;
        for (let i = startFrame; i <= endFrame; i++) {
            const img = new Image();
            img.onload = () => {
                loaded++;
                if (loaded === totalToLoad) setIsLoaded(true);
            };
            img.src = `${path}${pad(i, 4)}.png`;
            imagesRef.current[i - startFrame] = img;
        }
    }, [path, startFrame, endFrame]);

    useEffect(() => {
        if (!isLoaded) return;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = imagesRef.current[0].width;
        canvas.height = imagesRef.current[0].height;

        const render = () => {
            const rect = container.getBoundingClientRect();
            const windowH = window.innerHeight;
            
            let progress = -rect.top / (rect.height - windowH);
            progress = Math.max(0, Math.min(1, progress));
            
            // Lógica de cambio de texto con detección de índice
            if (dynamicTitles && dynamicTitles.length > 0) {
                const idx = Math.min(Math.floor(progress * dynamicTitles.length), dynamicTitles.length - 1);
                if (idx !== currentTitleIdx) {
                    setCurrentTitleIdx(idx);
                }
            }

            const totalFrames = endFrame - startFrame;
            const frameIdx = Math.min(Math.floor(progress * totalFrames), totalFrames);

            if (imagesRef.current[frameIdx]) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imagesRef.current[frameIdx], 0, 0, canvas.width, canvas.height);
            }
        };

        window.addEventListener('scroll', render, { passive: true });
        render();
        return () => window.removeEventListener('scroll', render);
    }, [isLoaded, startFrame, endFrame, dynamicTitles, currentTitleIdx]);

    return (
        <div ref={containerRef} className="relative w-full bg-[#F3F4F3]" style={{ height }}>
            <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-0 w-full h-full object-cover mix-blend-multiply"
                ></canvas>


                <div className="absolute inset-0 z-20 p-12 md:p-24 pointer-events-none flex flex-col justify-start">
                    {subtitle && (
                        <p className="text-[11px] tracking-[0.4em] uppercase font-bold opacity-40 mb-4">
                            {subtitle}
                        </p>
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
