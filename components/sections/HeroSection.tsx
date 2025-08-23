import React, { useRef, useEffect, useState } from 'react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // Slide logic
  const slideToSecondary = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(2);
    setTimeout(() => setIsTransitioning(false), 1000);
  };
  const slideToMain = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(1);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  // Auto slide
  useEffect(() => {
    function autoSlide() {
      setCurrentSlide((prev) => (prev === 1 ? 2 : 1));
    }
    autoSlideRef.current = setInterval(autoSlide, 8000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, []);

  // Pause on hover
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const pause = () => autoSlideRef.current && clearInterval(autoSlideRef.current);
    const resume = () => {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === 1 ? 2 : 1));
      }, 8000);
    };
    section.addEventListener('mouseenter', pause);
    section.addEventListener('mouseleave', resume);
    return () => {
      section.removeEventListener('mouseenter', pause);
      section.removeEventListener('mouseleave', resume);
    };
  }, []);

  return (
    <section className="hero-section" id="home" ref={sectionRef}>
      <img src="/images/hero.jpg" alt="Header" className="hero-img" />
      <div className="hero-overlay">
        {currentSlide === 1 && (
          <>
            <button className="arrow-btn right" onClick={slideToSecondary}>&gt;</button>
            <div className="hero-text hero-slide">
              <h1>
                SELAMAT DATANG DI
                <span className="hero-title">BOOKING TIKET ONLINE I&apos;AMPEL GADING HOMELAND</span>
              </h1>
              <a href="/katalog" className="cta">Booking Sekarang</a>
            </div>
          </>
        )}
        {currentSlide === 2 && (
          <>
            <button className="arrow-btn left" onClick={slideToMain}>&lt;</button>
            <div className="hero-text hero-slide">
              <h2>TATA TERTIB PENGUNJUNG / PESERTA CAMP</h2><br />
              <ul>
                <li>✅ kesadaran diri, jangan bepergian jika kondisi badan sedang sakit.</li>
                <li>✅ Menjunjung tinggi norma-norma kesopanan & kesusilaan.</li>
                <li>✅ Dilarang Berbicara Keras, Berkata Kotor (Urakan).</li>
                <li>✅ Dilarang Buang air Kecil/Besar di sembarang tempat.</li>
                <li>✅ Dilarang membawa MIRAS & obat-obatan terlarang.</li>
                <li>✅ Dilarang meninggalkan sampah & bekas api unggun dalam kondisi berserakan di lokasi area camp. Datang Bersih, pulang bersih.</li>
                <li>✅ Pemberlakuan jam malam / jam Istirahat (Batas aktifitas sampai jam 00.00).</li>
                <li>✅ Batas mendirikan tenda (datang) bisa dimulai jam 15.00 / 3 sore keatas, batas bongkar tenda (pulang) max jam 10.00 siang.</li>
              </ul>
              <br />
              <h2>Melanggar peraturan akan dikenakan sanksi / denda.</h2>
            </div>
          </>
        )}
      </div>
    </section>
  );
}