'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navLinks = [
    { label: 'Heritage', href: '/#heritage' },
    { label: 'Invention', href: '/#invention' },
    { label: 'Precision', href: '/#precision' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(currentProgress);
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md py-3' : 'bg-transparent py-8'
    }`}>
      {/* Scroll Progress Bar - Pure Black */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-[#111111] transition-all duration-300" style={{ width: `${scrollProgress}%` }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-10">
          <Link href="/#top" className="group flex items-center space-x-3">
            <img 
              src="/koenigsegg-logo.svg" 
              alt="Koenigsegg" 
              className="h-5 w-auto transition-all duration-500 group-hover:scale-110" 
            />
            <span className="text-[14px] font-serif tracking-[0.2em] uppercase text-[#111111] group-hover:italic transition-all">
              CC850
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-[11px] font-serif tracking-[0.2em] uppercase text-[#111111] hover:italic transition-all">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-8">
          <Link href="/#specs" className="hidden sm:block text-[11px] font-serif tracking-[0.2em] uppercase text-[#111111] hover:italic transition-all">
            Specs
          </Link>
          <a
            href="https://www.koenigsegg.com/contact"
            target="_blank"
            rel="noreferrer"
            className="bg-[#111111] text-white px-8 py-2.5 rounded-none text-[10px] font-serif uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-sm"
          >
            Inquire
          </a>
        </div>
      </div>
    </nav>
  );
}
