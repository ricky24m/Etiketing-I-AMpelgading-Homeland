import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
      const userData = localStorage.getItem('userData');
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, [isOpen]);

  const removeFromCart = (itemName: string) => {
    const updatedItems = cartItems.filter(item => item.name !== itemName);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const handleCheckout = () => {
    if (!user) return;
    router.push('/checkout');
    onClose();
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div
      className={`fixed top-0 right-0 z-[100] h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ maxWidth: 400 }}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l-2.5-2.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          Keranjang Belanja
        </h3>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-green-700 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col h-[calc(100vh-64px)]">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l-2.5-2.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <p className="text-lg font-medium">Keranjang kosong</p>
            <p className="text-sm text-center mt-2">Tambahkan produk ke keranjang untuk melanjutkan pembelian</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="border-b pb-3">
                  <div className="flex items-start justify-between gap-2">
                    {/* Kiri: Nama dan harga x qty */}
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold truncate block max-w-[160px]">{item.name}</span>
                      <div className="text-sm text-gray-600 mt-1">
                        Rp {item.price.toLocaleString()} x {item.qty}
                      </div>
                    </div>
                    {/* Kanan: Total harga dan hapus */}
                    <div className="flex flex-col items-end gap-2 min-w-[100px]">
                      <span className="font-semibold text-green-600 text-base">
                        Rp {(item.price * item.qty).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="text-red-500 hover:text-red-700"
                        title="Hapus"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Footer Actions */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <button 
              onClick={handleCheckout}
              disabled={!user}
              onMouseEnter={() => !user && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
                user 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Checkout Sekarang
            </button>
            {/* Tooltip */}
            {!user && showTooltip && (
              <div className="text-xs text-center text-red-600 mt-1">login terlebih dahulu</div>
            )}

            <button 
              onClick={clearCart}
              className="w-full py-2 px-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-colors duration-200"
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}