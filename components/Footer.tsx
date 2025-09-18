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
                    Dusun Ampelgading,Kenteng<br />
                    Bandungan, Kabupaten <br /> Semarang, Jawa Tengah
                  </p>
                </div>
                {/* Media Sosial */}
                <div className="min-w-[140px]">
                  <h4 className="text-lg font-semibold mb-4 text-yellow-400">
                    Media Sosial
                  </h4>
                  <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                  <div className="flex space-x-3">
                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/6285169425600"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-green-400 transition-colors duration-200 inline-flex items-center"
                      title="WhatsApp"
                    >
                      <span className="sr-only">WhatsApp</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </a>
                    
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/ampelgading_homeland?igsh=ejV4aTBtZjVmY24w"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-pink-400 transition-colors duration-200 inline-flex items-center"
                      title="Instagram"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    
                    {/* Facebook */}
                    <a
                      href="#" // Ganti dengan URL Facebook yang sebenarnya
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-blue-500 transition-colors duration-200 inline-flex items-center"
                      title="Facebook"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    
                    {/* YouTube */}
                    <a
                      href="https://m.youtube.com/@ampelgadinghomelandofficia8858?fbclid=PAT01DUAMvN-xleHRuA2FlbQIxMAABpwAGBA_E5lo-n6wtxH6pei0U-gZImTQmusBjqjXCk2epAglOwIdgEvZLxsFD_aem_U7EWEMoRVWLCyK0WF4gPUQ" // Ganti dengan URL YouTube yang sebenarnya
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-red-500 transition-colors duration-200 inline-flex items-center"
                      title="YouTube"
                    >
                      <span className="sr-only">YouTube</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                    
                    {/* TikTok */}
                    <a
                      href="https://www.tiktok.com/@ampelgading.homeland"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-gray-900 hover:bg-white hover:rounded-full transition-all duration-200 inline-flex items-center p-1"
                      title="TikTok"
                    >
                      <span className="sr-only">TikTok</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
