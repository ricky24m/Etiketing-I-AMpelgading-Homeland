import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    phone: '',
    emergency: '',
    email: ''
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);

    // Auto-fill dari user data jika login
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (userData) {
      setFormData({
        nama: userData.nama_lengkap || '',
        nik: userData.nik || '',
        phone: userData.nomor_telepon || '',
        emergency: '',
        email: userData.email || ''
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Pilih tanggal booking');
      return;
    }

    if (cartItems.length === 0) {
      alert('Keranjang kosong');
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const items = cartItems.map(item => `${item.name} x ${item.qty}`).join(', ');

    try {
      const response = await fetch('/api/booking/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tanggal: selectedDate.toISOString(),
          items,
          total
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Booking berhasil!');
        localStorage.removeItem('cartItems');
        router.push('/');
      } else {
        alert('Booking gagal: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <>
      <Head>
        <title>Checkout - I&apos;AMpel GADING</title>
      </Head>
      
      <Navbar />
      
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="cart-summary">
          <h3>Pesanan Anda</h3>
          {cartItems.map((item, idx) => (
            <div key={idx} className="cart-item">
              {item.name} × {item.qty} = Rp {(item.price * item.qty).toLocaleString()}
            </div>
          ))}
          <div className="total">
            <strong>Total: Rp {totalAmount.toLocaleString()}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Tanggal Booking:</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          <div className="form-grid">
            <input
              type="text"
              placeholder="Nama Pembooking"
              required
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
            <input
              type="text"
              placeholder="NIK"
              required
              value={formData.nik}
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
            />
            <input
              type="tel"
              placeholder="No. Telepon"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <input
              type="tel"
              placeholder="No. Telepon Darurat"
              required
              value={formData.emergency}
              onChange={(e) => setFormData({...formData, emergency: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <button type="submit" className="submit-btn">
            Konfirmasi Booking
          </button>
        </form>
      </div>
    </>
  );
}