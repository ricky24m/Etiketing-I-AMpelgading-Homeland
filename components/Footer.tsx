import React from 'react';

export default function Footer() {
  return (
    <footer className="relative w-full min-h-[350px] mt-12 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/footer.jpg')",
          zIndex: 0
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[350px] flex flex-col justify-between">

          {/* Bagian Atas (Brand + Kolom) */}
          <div className="py-16">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
              {/* Brand Section */}
              <div className="flex-1 min-w-[220px] max-w-xs mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                  I&apos;AMpelgading HOMELAND
                </h3>
                <p className="text-gray-200 leading-relaxed text-sm max-w-md">
                  Destinasi wisata alam terbaik di ketinggian 1350 mdpl yang menawarkan
                  pengalaman camping, jeep adventure, dan outbound tak terlupakan.
                  Nikmati keindahan alam pegunungan dengan fasilitas lengkap dan
                  pelayanan terbaik untuk liburan yang berkesan.
                </p>
              </div>
              {/* Tiga Kolom Kanan */}
              <div className="flex flex-1 justify-end gap-8 flex-wrap">
                {/* Fitur */}
                <div className="min-w-[140px]">
                  <h4 className="text-lg font-semibold mb-4 text-yellow-400">
                    Fitur
                  </h4>
                  <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                  <nav className="space-y-2">
                    <a href="/katalog" className="text-gray-200 hover:text-yellow-400 transition-colors duration-200 text-sm inline-block">
                      Booking Online
                    </a>
                    <br />
                    <a href="/panduan" className="text-gray-200 hover:text-yellow-400 transition-colors duration-200 text-sm inline-block">
                      Panduan Booking
                    </a>
                  </nav>
                </div>
                {/* Kontak & Lokasi */}
                <div className="min-w-[180px]">
                  <h4 className="text-lg font-semibold mb-4 text-yellow-400">
                    Kontak & Lokasi
                  </h4>
                  <div className="w-12 h-0.5 bg-yellow-400 mb-4 max-w-xs"></div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Dusun Ampelgading, <br />Kenteng<br />
                    Bandungan, Kabupaten <br /> Semarang, Jawa Tengah
                  </p>
                </div>
                {/* Media Sosial */}
                <div className="min-w-[140px]">
                  <h4 className="text-lg font-semibold mb-4 text-yellow-400">
                    Media Sosial
                  </h4>
                  <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                  <div className="flex space-x-4">
                    <a
                      href="https://wa.me/6285169425600"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-green-400 transition-colors duration-200 inline-flex items-center"
                    >
                      <span className="sr-only">WhatsApp</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/ampelgading_homeland?igsh=ejV4aTBtZjVmY24w"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-pink-400 transition-colors duration-200 inline-flex items-center"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.297C4.198 14.81 3.708 13.659 3.708 12.362s.49-2.448 1.297-3.33c.881-.881 2.033-1.297 3.33-1.297s2.448.416 3.33 1.297c.881.881 1.297 2.033 1.297 3.33s-.416 2.448-1.297 3.33c-.882.807-2.033 1.296-3.33 1.296zm7.598 0c-1.297 0-2.448-.49-3.33-1.297-.881-.881-1.297-2.033-1.297-3.33s.416-2.448 1.297-3.33c.881-.881 2.033-1.297 3.33-1.297s2.448.416 3.33 1.297c.881.881 1.297 2.033 1.297 3.33s-.416 2.448-1.297 3.33c-.882.807-2.033 1.296-3.33 1.296z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@ampelgading.homeland"
                      className="text-gray-200 hover:text-blue-400 transition-colors duration-200 inline-flex items-center"
                    >
                      <span className="sr-only">TikTok</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="w-full border-t border-gray-600 bg-black/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
              <div>
                © 2025 I&apos;AMpelgading HOMELAND. All rights reserved
              </div>
              <div className="mt-2 md:mt-0">
                Created by GIAT 12 KKNPMM UNNES
              </div>
            </div>
          </div>
      </div>
    </footer>
  );
}
