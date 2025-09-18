import Head from 'next/head';
import Navbar from '../components/Navbar';
import Cart from '../components/Cart';
import useSWR from 'swr';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Katalog() {
  const [showCart, setShowCart] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);

  const { data, error, isLoading } = useSWR('/api/menu', fetcher);

  useEffect(() => {
    const updateCartItems = () => {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
    };

    updateCartItems();
    window.addEventListener('storage', updateCartItems);

    return () => window.removeEventListener('storage', updateCartItems);
  }, []);

  // Filter menu by keyword
  const filteredMenus =
    data?.data?.filter((menu: any) =>
      menu.nama_menu.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      menu.kategori.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Gagal memuat data menu</h3>
          <p className="text-gray-600 mb-6">Silakan refresh halaman atau coba lagi nanti.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Memuat menu...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Katalog Booking - I&apos;AMpel GADING</title>
        <meta
          name="description"
          content="Pilih paket wisata dan alat camping untuk booking online"
        />
      </Head>

      <Navbar variant="booking" />

      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="text-center py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pilih Pesanan Anda
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan paket wisata dan peralatan camping terbaik untuk petualangan Anda
          </p>
        </div>

        {/* Search Section */}
        <div className="flex justify-start max-w-7xl mx-auto px-4 mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Cari paket wisata atau alat camping..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-full text-gray-700 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="max-w-5xl mx-auto px-4 pb-16">
          {filteredMenus.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchKeyword ? 'Tidak ada hasil ditemukan' : 'Menu tidak tersedia'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchKeyword
                    ? 'Coba kata kunci lain atau lihat semua paket yang tersedia.'
                    : 'Saat ini belum ada menu yang tersedia.'}
                </p>
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Lihat Semua Menu
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
              {filteredMenus.map((menu: any) => (
                <div
                  key={menu.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 w-full max-w-[420px] h-[350px] flex flex-col items-center"
                >
                  {/* Image */}
                  <div className="relative w-full h-[240px] bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={menu.gambar_url || '/images/placeholder.svg'}
                      alt={menu.nama_menu}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ aspectRatio: '4/3' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.svg';
                        e.currentTarget.alt = 'Gambar tidak tersedia';
                      }}
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        {menu.kategori || 'Paket'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full text-left mt-3 mb-1 px-2">
                    <span className="font-bold text-2xl text-gray-800 truncate block">{menu.nama_menu}</span>
                  </div>
                  {/* Button + Text */}
                  <div className="p-4 w-full flex flex-col items-start mt-auto">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <a
                        href={
                          menu.kategori === 'Sewa Alat Camping'
                            ? '/sewa-alat-camping'
                            : `/detail-menu?id=${menu.id}`
                        }
                        className="button inline-flex items-start bg-green-600 text-white px-3 py-1.5 rounded-[15px] text-xs font-light transition-all duration-200 hover:bg-emerald-600 hover:text-white hover:scale-105"
                      >
                        Selengkapnya
                      </a>
                      untuk melihat lebih detail
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Cart Button */}
      {cartItemCount >= 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed z-50 bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="Lihat Keranjang"
          style={{ boxShadow: '0 4px 24px rgba(22,163,74,0.25)' }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l-2.5-2.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {cartItemCount}
          </span>
        </button>
      )}

      <Cart
        isOpen={showCart}
        onClose={() => {
          setShowCart(false);
          const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
          setCartItems(items);
        }}
      />
      <Footer />
    </>
  );
}
