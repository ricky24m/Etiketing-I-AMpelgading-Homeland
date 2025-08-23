import React, { useRef, useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type GaleriItem = {
  gambar: string;
  judul: string;
  deskripsi: string;
};

// Helper untuk chunk array jadi grup 3
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function GallerySection() {
  const { data } = useSWR('/api/admin/galeri', fetcher);
  const galeri: GaleriItem[] = data?.data || [];

  // Bagi galeri jadi grup 3 gambar per slide
  const slides = chunkArray<GaleriItem>(galeri, 3);

  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const slideToGallery = (idx: number) => {
    if (isTransitioning || idx === currentGallerySlide) return;
    setIsTransitioning(true);
    setCurrentGallerySlide(idx);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    function autoSlide() {
      setCurrentGallerySlide((prev) => (prev + 1) % slides.length);
    }
    autoSlideRef.current = setInterval(autoSlide, 8000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [slides.length]);

  return (
    <section id="galeri" className="min-h-screen flex items-center py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          <span className="text-green-600">Galeri</span> Pengunjung
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Apa saja yang mereka lakukan saat berkunjung ke I&apos;AMpel GADING Homeland
        </p>
        <div className="relative group">
          <div className="flex items-center justify-center gap-6">
            {/* Arrow Left */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-green-600 hover:text-white text-green-600 border border-green-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              onClick={() => slideToGallery((currentGallerySlide - 1 + slides.length) % slides.length)}
              aria-label="Sebelumnya"
              tabIndex={0}
            >
              &lt;
            </button>
            {/* Gallery Slide */}
            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${currentGallerySlide * 100}%)` }}
              >
                {slides.map((slide, idx) => (
                  <div key={idx} className="min-w-full flex gap-6">
                    {slide.map((item, i) => (
                      <div key={i} className="relative group/gallery flex-1 rounded-xl overflow-hidden shadow-lg bg-white">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-full h-[450px] object-cover transition-transform duration-300 group-hover/gallery:scale-105"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                          <h4 className="text-lg font-bold text-white mb-1">{item.judul}</h4>
                          <p className="text-white text-sm">{item.deskripsi.length > 60 ? item.deskripsi.slice(0, 60) + '...' : item.deskripsi}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Arrow Right */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-green-600 hover:text-white text-green-600 border border-green-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              onClick={() => slideToGallery((currentGallerySlide + 1) % slides.length)}
              aria-label="Selanjutnya"
              tabIndex={0}
            >
              &gt;
            </button>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border-2 border-green-600 transition-all duration-200 ${currentGallerySlide === idx ? 'bg-green-600' : 'bg-white'}`}
                onClick={() => slideToGallery(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}