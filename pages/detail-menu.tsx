import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const alatFetcher = (url: string) => fetch(url).then(res => res.json());

export default function DetailMenu() {
  const router = useRouter();
  const { id } = router.query;
  const [qty, setQty] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const { data, error } = useSWR(id ? `/api/menu/${id}` : null, fetcher);

  // Untuk alat camping
  const isSewaAlatCamping = data?.data?.kategori === 'Sewa Alat Camping';
  const { data: alatData } = useSWR(isSewaAlatCamping ? '/api/alat-camping' : null, alatFetcher);
  const [alatQty, setAlatQty] = useState<{ [id: number]: number }>({});

  // Hitung jumlah item di keranjang
  useEffect(() => {
    const updateCartItems = () => {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
    };
    updateCartItems();
    window.addEventListener('storage', updateCartItems);
    return () => window.removeEventListener('storage', updateCartItems);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + (item.qty || 0), 0);

  const handleAddToCart = () => {
    if (qty > 0 && data?.data) {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existingItem = items.find((item: any) => item.name === data.data.nama_menu);

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        items.push({
          name: data.data.nama_menu,
          price: data.data.harga,
          qty: qty,
          kategori: data.data.kategori, // Simpan kategori
          satuan: data.data.satuan
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(items));
      setCartItems(items);
      alert(`${data.data.nama_menu} (${qty}x) berhasil ditambahkan ke keranjang`);
      setQty(0);
    } else {
      alert('Pilih minimal 1 item');
    }
  };

  // Handler untuk plus/minus
  const handleQtyChange = (id: number, delta: number) => {
    setAlatQty(qty => ({
      ...qty,
      [id]: Math.max(0, (qty[id] || 0) + delta)
    }));
  };

  // Simpan ke cart semua alat yang qty > 0
  const handleSimpanAlatCamping = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    let added = 0;
    (alatData?.data || []).forEach((alat: any) => {
      const qty = alatQty[alat.id] || 0;
      if (qty > 0) {
        const existing = items.find((item: any) => item.name === alat.nama_alat && item.type === 'alat');
        if (existing) {
          existing.qty += qty;
        } else {
          items.push({
            name: alat.nama_alat,
            price: alat.harga,
            satuan: alat.satuan,
            qty,
            type: 'alat',
            gambar: alat.gambar
          });
        }
        added++;
      }
    });
    localStorage.setItem('cartItems', JSON.stringify(items));
    setCartItems(items);
    if (added > 0) {
      alert(`${added} alat camping berhasil ditambahkan ke keranjang`);
      setAlatQty({});
    } else {
      alert('Pilih minimal 1 alat camping');
    }
  };

  if (error) return <div>Gagal memuat detail menu</div>;
  if (!data) return <div>Memuat detail menu...</div>;
  if (!data.success) return <div>Menu tidak ditemukan</div>;

  const menu = data.data;

  return (
    <>
      <Head>
        <title>Detail Menu - {menu.nama_menu}</title>
      </Head>
      <Navbar variant="booking" />

      {/* Hero kecil dengan judul dan breadcrumb */}
      <div className="relative w-full h-40 flex items-center bg-gray-200">
        <img
          src={menu.gambar}
          alt={menu.nama_menu}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ opacity: 0.25 }}
          onError={e => { e.currentTarget.src = '/images/placeholder.svg'; }}
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 flex flex-col justify-center w-full h-full px-6">
          <h1 className="text-2xl font-bold text-white text-center mb-2 drop-shadow">{menu.nama_menu}</h1>
          <nav className="flex items-center gap-2 text-sm text-gray-200 justify-center">
            <a href="/" className="hover:underline">Beranda</a>
            <span>/</span>
            <a href="/katalog" className="hover:underline">Booking</a>
            <span>/</span>
            <span className="text-green-300">{menu.nama_menu}</span>
          </nav>
        </div>
      </div>

      {/* Konten utama - berbeda untuk Sewa Alat Camping */}
      {isSewaAlatCamping ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center mb-8">Pilih Alat Camping yang Ingin Disewa</h2>
          
          {alatData?.data?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {alatData.data.map((alat: any) => {
                const qty = alatQty[alat.id] || 0;
                return (
                  <div key={alat.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                    {/* Gambar */}
                    <img 
                      src={alat.gambar} 
                      alt={alat.nama_alat} 
                      className="w-full h-48 object-contain mb-4 bg-gray-100 rounded"
                      onError={e => { e.currentTarget.src = '/images/placeholder.svg'; }}
                    />
                    
                    {/* Nama Alat */}
                    <h3 className="font-semibold text-lg text-center mb-2">{alat.nama_alat}</h3>
                    
                    {/* Harga dan Satuan */}
                    <div className="text-green-700 font-bold text-base mb-4 text-center">
                      Rp {Number(alat.harga).toLocaleString()} 
                      <span className="font-normal text-gray-500 ml-1">/ {alat.satuan}</span>
                    </div>
                    
                    {/* Button Plus Minus */}
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        className="w-10 h-10 rounded-full bg-green-600 text-white text-xl flex items-center justify-center hover:bg-green-700 transition-colors"
                        onClick={() => handleQtyChange(alat.id, -1)}
                      >-</button>
                      <span className="text-xl font-semibold w-12 text-center">{qty}</span>
                      <button
                        className="w-10 h-10 rounded-full bg-green-600 text-white text-xl flex items-center justify-center hover:bg-green-700 transition-colors"
                        onClick={() => handleQtyChange(alat.id, 1)}
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Belum ada alat camping yang tersedia</p>
            </div>
          )}
          
          {/* Button Simpan di bawah */}
          <div className="flex justify-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              onClick={handleSimpanAlatCamping}
            >
              Simpan ke Keranjang
            </button>
          </div>
        </div>
      ) : (
        // Tampilan normal untuk menu selain Sewa Alat Camping
        <main className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow p-6 mt-8">
          {/* Tabel dan keterangan */}
          <div className="flex-1">
            <table className="w-full mb-4 border rounded">
              <thead>
                <tr className="bg-green-100">
                  <th className="py-2 px-3 text-left">Nama Paket</th>
                  <th className="py-2 px-3 text-left">Harga</th>
                  <th className="py-2 px-3 text-left">Satuan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-3">{menu.nama_menu}</td>
                  <td className="py-2 px-3">Rp {Number(menu.harga).toLocaleString()}</td>
                  <td className="py-2 px-3">{menu.satuan}</td>
                </tr>
              </tbody>
            </table>
            <div className="prose max-w-none text-gray-700">
              <h4 className="font-semibold mb-2">Keterangan</h4>
              <div dangerouslySetInnerHTML={{ __html: (menu.keterangan || '').replace(/\n/g, '<br>') }} />
            </div>
          </div>
          {/* Samping: qty dan simpan */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded bg-green-600 text-white text-xl flex items-center justify-center"
                onClick={() => setQty(Math.max(0, qty - 1))}
              >-</button>
              <span className="text-lg font-semibold w-8 text-center">{qty}</span>
              <button
                className="w-8 h-8 rounded bg-green-600 text-white text-xl flex items-center justify-center"
                onClick={() => setQty(qty + 1)}
              >+</button>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
              onClick={handleAddToCart}
            >
              Simpan ke Keranjang
            </button>
          </div>
        </main>
      )}

      {/* Floating Cart Button (FAB) */}
      {cartItemCount >= 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed z-50 bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="Lihat Keranjang"
          style={{ boxShadow: '0 4px 24px rgba(22,163,74,0.25)' }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l-2.5-2.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {cartItemCount}
          </span>
        </button>
      )}

      {/* Slide-out Cart */}
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