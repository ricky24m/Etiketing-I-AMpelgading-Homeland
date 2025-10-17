import Head from 'next/head';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SewaAlatCamping() {
  const { data, error } = useSWR('/api/alat-camping', fetcher);
  const [alatQty, setAlatQty] = useState<{ [id: number]: number }>({});
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
    const updateCartItems = () => {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
    };
    window.addEventListener('storage', updateCartItems);
    return () => window.removeEventListener('storage', updateCartItems);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + (item.qty || 0), 0);

  const handleQtyChange = (id: number, delta: number) => {
    setAlatQty(qty => ({
      ...qty,
      [id]: Math.max(0, (qty[id] || 0) + delta)
    }));
  };

  const handleSimpanAlatCamping = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    let added = 0;
    (data?.data || []).forEach((alat: any) => {
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

  if (error) return <div className="min-h-screen flex items-center justify-center">Gagal memuat data alat camping</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Memuat data alat camping...</div>;

  return (
    <>
      <Head>
        <title>Sewa Alat Camping - I&apos;AMpel GADING</title>
      </Head>
      <Navbar variant="booking" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-green-700">Sewa Alat Camping</h1>
          
          {data?.data?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {data.data.map((alat: any) => {
                const qty = alatQty[alat.id] || 0;
                return (
                  <div key={alat.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                    <img
                      src={alat.gambar}
                      alt={alat.nama_alat}
                      className="w-full h-48 object-contain mb-4 bg-gray-100 rounded"
                      onError={e => { e.currentTarget.src = '/images/placeholder.svg'; }}
                    />
                    <h3 className="font-semibold text-lg text-center mb-2">{alat.nama_alat}</h3>
                    <div className="text-green-700 font-bold text-base mb-4 text-center">
                      Rp {Number(alat.harga).toLocaleString()} 
                      <span className="font-normal text-gray-500 ml-1">/ {alat.satuan}</span>
                    </div>
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
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">Belum ada alat camping yang tersedia</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              onClick={handleSimpanAlatCamping}
            >
              Simpan ke Keranjang
            </button>
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed z-50 bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-colors duration-200"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l-2.5-2.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
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