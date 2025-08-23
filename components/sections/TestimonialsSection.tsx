import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TestimonialsSection() {
  const { data } = useSWR('/api/admin/testimoni', fetcher);
  const testimonials = data?.data?.slice(0, 10) || [];

  // Bagi menjadi 2 baris (5 atas, 5 bawah)
  const topTestimonials = testimonials.slice(0, 5);
  const bottomTestimonials = testimonials.slice(5, 10);

  // Fungsi potong komen
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  // Duplikasi agar marquee infinite tanpa jeda
  const infiniteTop = [...topTestimonials, ...topTestimonials];
  const infiniteBottom = [...bottomTestimonials, ...bottomTestimonials];

  return (
    <section id="testimonials" className="min-h-screen flex items-center py-16 bg-white">
      <div className="max-w-[70rem] mx-auto px-2 w-full">
        <h2 className="text-3xl font-bold text-center mb-2">
          <span className="text-green-600">Testimoni</span> Pengunjung
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Apa kata mereka yang telah berkunjung ke I&apos;AMpel GADING Homeland
        </p>

        {/* Marquee Atas */}
        <div className="overflow-hidden mb-6">
          <div className="flex gap-6 animate-marquee-left">
            {infiniteTop.map((t: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-xl shadow p-6 flex flex-col gap-3 min-w-[270px] max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {t.nama[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.nama}</div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      {'★'.repeat(t.bintang)}
                      <span className="text-gray-500 ml-2">{t.bintang}.0</span>
                    </div>
                  </div>
                  <img src="/images/google.svg" alt="Google" className="ml-auto w-6 h-6" />
                </div>
                <p className="text-gray-700 text-base">
                  &quot;{truncate(t.komen, 80)}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Bawah */}
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-marquee-right">
            {infiniteBottom.map((t: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-xl shadow p-6 flex flex-col gap-3 min-w-[270px] max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {t.nama[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.nama}</div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      {'★'.repeat(t.bintang)}
                      <span className="text-gray-500 ml-2">{t.bintang}.0</span>
                    </div>
                  </div>
                  <img src="/images/google.svg" alt="Google" className="ml-auto w-6 h-6" />
                </div>
                <p className="text-gray-700 text-base">
                  &quot;{truncate(t.komen, 80)}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <a
            href="https://www.google.com/search?sca_esv=afa8570cfb57dbd5&sxsrf=AE3TifOAkeR86_zbe2oapOGbz9dq0o2e3w:1754130188167&q=I+AMpelgading+HOMELAND&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EyaZZjWYFFv-J6_5Kas9aMyj2pFo-oLr8S1ZFgWe6ZyY6OWXeyaL6bIuNiOnysqsRIZMNsh2NQ-po0Vqc6KcmchW_T9DJpsicZcrb7GvRD5B4UHzqA%3D%3D&sa=X&ved=2ahUKEwidtoWW9OuOAxXMzTgGHffsG2cQmJ0LegQINxAA&biw=1536&bih=776&dpr=1.25"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
            Lihat ulasan selengkapnya
          </a>
        </div>
      </div>

      {/* Marquee Animations */}
      <style jsx>{`
        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </section>
  );
}