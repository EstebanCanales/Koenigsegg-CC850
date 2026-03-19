import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollSequence from "@/components/ScrollSequence";
import DetailScroll from "@/components/DetailScroll";
import ScrollRevealObserver from "@/components/ScrollRevealObserver";

export default function Home() {
  const legacyLinks = [
    { label: "Invention", href: "/#invention" },
    { label: "Chronology", href: "/#heritage" },
    { label: "Engineering", href: "/#engineering" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/koenigsegg/" },
    {
      label: "Youtube",
      href: "https://www.youtube.com/channel/UCZJHWJZmE2B_fPwt5HMjVjQ",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/koenigsegg-automotive-ab/",
    },
  ];

  const technicalStats = [
    {
      label: "RAW_VIGOR",
      value: "1385",
      unit: "HP",
      className: "min-h-[420px] md:col-span-7 md:row-span-2 md:min-h-0 md:h-full",
      valueClassName: "text-[6.5rem] md:text-[11rem] lg:text-[14rem]",
    },
    {
      label: "EQUILIBRIUM",
      value: "1:1",
      unit: "RATIO",
      className: "min-h-[220px] md:col-span-5 md:min-h-0 md:h-full",
      valueClassName: "text-6xl md:text-[8rem]",
    },
    {
      label: "BINARY_SHIFT",
      value: "6+9",
      unit: "SPD",
      className: "min-h-[220px] md:col-span-2 md:min-h-0 md:h-full",
      valueClassName: "text-5xl md:text-[6.5rem]",
    },
    {
      label: "CURATED_SERIES",
      value: "70",
      unit: "UNITS",
      className: "min-h-[220px] md:col-span-3 md:min-h-0 md:h-full",
      valueClassName: "text-6xl md:text-[8rem]",
    },
  ];

  return (
    // Devolvemos el scroll al navegador (min-h-screen en lugar de h-screen)
    <main
      id="top"
      className="min-h-screen bg-white text-[#111111] font-serif selection:bg-[#111111] selection:text-white"
    >
      <ScrollRevealObserver />
      <Navbar />

      {/* 1. Hero Zone - Punto de inicio */}
      <section id="hero" className="scroll-mt-24 relative w-full">
        <ScrollSequence />
      </section>

      {/* 2. Philosophy Section */}
      <section
        id="heritage"
        data-scroll-reveal
        className="scroll-mt-24 bg-white px-6 pt-28 pb-20 md:px-12 md:pt-40 md:pb-28 text-center"
      >
        <div className="max-w-7xl mx-auto">
          <h3 className="text-[11px] tracking-[0.4em] uppercase mb-16 underline underline-offset-[12px] decoration-[#111111]/10 opacity-40">
            The Chronology of Precision
          </h3>
          <h2 className="text-5xl md:text-[9rem] tracking-tight leading-[0.85] mb-20">
            Engineering <span className="italic">Emotion.</span>
          </h2>
          <p className="text-xl md:text-4xl leading-tight max-w-5xl mx-auto italic opacity-60">
            "The CC850 is not a resurrection. It is an awakening of the visceral
            connection between hand and road."
          </p>
        </div>
      </section>

      {/* 3. Detail Scroll: DYNAMIC MOVEMENT (BLOQUEADO POR SNAP) */}
      <section id="invention" className="scroll-mt-24 relative w-full">
        <DetailScroll
          path="/frames/video2/frame_"
          startFrame={1}
          endFrame={121}
          height="500vh"
          subtitle="Kinetic Geometry"
          dynamicTitles={[
            "Sculpted by Velocity.",
            "The Aerodynamic Blueprint.",
            "Kinetic perfection.",
          ]}
        />
      </section>

      {/* 4. Architecture Section */}
      <section
        id="engineering"
        data-scroll-reveal
        className="scroll-mt-24 w-full bg-white overflow-hidden"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#F3F4F3] border-y border-[#111111]/5">
          <img
            src="/images/image.png"
            alt="Koenigsegg Exterior"
            className="w-full h-full object-cover mix-blend-multiply"
          />
          <div className="absolute bottom-12 left-12 max-w-lg text-white">
            <p className="text-[11px] tracking-[0.4em] uppercase mb-4 font-bold opacity-70">
              Fluidity in Carbon
            </p>
            <h5 className="text-4xl md:text-5xl italic leading-tight">
              Where the wind meets the weave.
            </h5>
          </div>
        </div>
      </section>

      {/* 5. Feature Photo - Form & Function */}
      <section
        id="precision"
        data-scroll-reveal
        className="scroll-mt-24 w-full bg-white overflow-hidden"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#F3F4F3] border-y border-[#111111]/5">
          <img
            src="/images/image copy 5.png"
            alt="Koenigsegg Interior"
            className="w-full h-full object-cover  mix-blend-multiply"
          />
          <div className="absolute top-1/2 right-12 -translate-y-1/1 z-10 text-right max-w-md text-white">
            <p className="text-[11px] tracking-[0.4em] uppercase mb-4 font-bold opacity-40">
              Mechanical Anatomy
            </p>
            <h5 className="text-5xl md:text-6xl italic leading-none">
              Precision beyond the visible.
            </h5>
          </div>
        </div>
      </section>

      {/* 6. Third Image Section */}
      <section
        id="chamber"
        data-scroll-reveal
        className="scroll-mt-24 w-full bg-white overflow-hidden"
      >
        <div className="relative aspect-21/9 w-full overflow-hidden bg-[#F3F4F3] border-y border-[#111111]/5">
          <img
            src="/images/image copy 4.png"
            alt="Koenigsegg Detail"
            className="w-full h-full object-cover mix-blend-multiply"
          />
          <div className="absolute bottom-12 left-12 z-10 max-w-md text-white">
            <p className="text-[11px] tracking-[0.4em] uppercase mb-4 font-bold opacity-40">
              Carbon Chamber
            </p>
            <h5 className="text-5xl md:text-6xl italic leading-none opacity-90">
              Stillness under load.
            </h5>
          </div>
        </div>
      </section>

      {/* 7. Technical Stats */}
      <section
        id="specs"
        data-scroll-reveal
        className="scroll-mt-24 relative w-full overflow-hidden bg-[#090909]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255,255,255,0.045) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.045) 50%, rgba(255,255,255,0.045) 75%, transparent 75%, transparent),
              linear-gradient(-45deg, rgba(0,0,0,0.35) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.35) 75%, transparent 75%, transparent)
            `,
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 8px 8px",
          }}
        />
        <div className="w-full">
          <div className="relative z-10 grid min-h-screen grid-cols-1 gap-px bg-white/15 md:h-screen md:grid-cols-12 md:grid-rows-2">
            {technicalStats.map((item) => (
              <article
                key={item.label}
                className={`${item.className} group relative bg-[#090909]/70 p-5 md:p-8 flex flex-col justify-between overflow-hidden`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-bold text-white/50">
                    {item.label}
                  </p>
                </div>

                <div className="relative z-10 flex items-end gap-2">
                  <span
                    className={`${item.valueClassName} tracking-[-0.08em] leading-none text-white`}
                  >
                    {item.value}
                  </span>
                  <span className="pb-3 md:pb-5 text-xs md:text-sm tracking-[0.35em] uppercase text-white/70">
                    {item.unit}
                  </span>
                </div>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final Statement */}
      <section
        id="finality"
        data-scroll-reveal
        className="scroll-mt-24 bg-white border-t border-[#111111]/5 px-6 pt-28 pb-24 md:pt-40 md:pb-32 flex flex-col items-center text-center"
      >
        <h3 className="text-[11px] tracking-[0.4em] uppercase mb-16 underline underline-offset-[10px] decoration-[#111111]/10 font-bold opacity-40">
          Finality
        </h3>
        <h2 className="text-7xl md:text-[14rem] italic mb-20 tracking-tighter opacity-90">
          Allocated.
        </h2>
        <div className="h-40 w-[1px] bg-[#111111]/10 mx-auto" />
        <p className="text-[11px] tracking-[0.4em] uppercase mt-20 font-bold opacity-60">
          The 70 Year Journey Complete
        </p>
      </section>

      {/* 9. Footer */}
      <footer
        id="footer"
        data-scroll-reveal
        className="scroll-mt-24 relative py-60 bg-white border-t border-[#111111]/5 overflow-hidden w-full"
      >
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] pointer-events-none opacity-20 z-0">
          <img src="/koenigsegg-logo.svg" alt="" className="w-full h-auto" />
        </div>

        <div className="relative z-10 max-w-1400px mx-auto px-6 md:px-12">
          <div className="mb-60 max-w-6xl">
            <p className="text-4xl md:text-7xl leading-[1.1] tracking-tight italic opacity-90">
              "We build machines that possess a soul, for drivers who understand
              that <span className="not-italic">mechanical life</span> is the
              ultimate luxury."
            </p>
            <div className="mt-16 flex items-center space-x-6">
              <div className="w-16 h-px bg-[#111111]/20" />
              <span className="text-[11px] uppercase tracking-[0.5em] font-bold opacity-40">
                Christian von Koenigsegg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-start border-t border-[#111111]/10 pt-32">
            <div className="space-y-12">
              <Link href="/#top" className="inline-block">
                <img
                  src="/koenigsegg-logo.svg"
                  alt="Koenigsegg"
                  className="h-8 w-auto opacity-60"
                />
              </Link>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-30 leading-relaxed">
                  Ängelholm, Sweden
                </p>
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-10 leading-relaxed">
                  Established 1994
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="text-[10px] uppercase tracking-[0.6em] font-bold opacity-20 italic text-[#111111]">
                Legacy Directory
              </p>
              <ul className="space-y-8">
                {legacyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-2xl md:text-3xl hover:italic transition-all duration-500 block hover:translate-x-2 opacity-80 hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-12">
              <p className="text-[10px] uppercase tracking-[0.6em] font-bold opacity-20 italic text-[#111111]">
                Global_Connect
              </p>
              <ul className="space-y-8">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-2xl md:text-3xl hover:italic transition-all duration-500 block hover:translate-x-2 opacity-80 hover:opacity-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
