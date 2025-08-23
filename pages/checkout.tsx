import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [accessGranted, setAccessGranted] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    phone: '',
    emergency: '',
    email: ''
  });

  useEffect(() => {
    // Cek access control - harus melalui cart checkout
    const fromCart = sessionStorage.getItem('fromCart');
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (!fromCart || items.length === 0) {
      // Jika tidak melalui cart atau keranjang kosong, redirect ke katalog
      router.push('/katalog');
      return;
    }
    
    // Grant access
    setAccessGranted(true);
    setCartItems(items);
    
    // Clear access flag setelah digunakan
    sessionStorage.removeItem('fromCart');

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
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Pilih tanggal booking terlebih dahulu');
      return;
    }

    if (cartItems.length === 0) {
      alert('Keranjang kosong');
      return;
    }

    if (!formData.emergency) {
      alert('Nomor darurat harus diisi');
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
        // Simpan data order ke sessionStorage untuk halaman payment
        const orderData = {
          order_id: result.order_id,
          nama: formData.nama,
          email: formData.email,
          phone: formData.phone,
          tanggal: selectedDate.toISOString(),
          items,
          total
        };
        
        sessionStorage.setItem('orderData', JSON.stringify(orderData));
        
        // Hapus cart items
        localStorage.removeItem('cartItems');
        
        // Redirect ke halaman payment
        router.push('/payment');
      } else {
        alert('Booking gagal: ' + (result.error || result.message));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat memproses booking');
    }
  };

  const handleCancel = () => {
    if (confirm('Yakin ingin membatalkan checkout?')) {
      router.push('/katalog');
    }
  };

  // Navigasi bulan
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar
  const generateCalendar = () => {
    const today = new Date();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const days = [];
    
    // Days from previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div key={`prev-${day}`} className="calendar-day prev-month">
          {day}
        </div>
      );
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day current-month ${isPast ? 'past' : 'available'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => !isPast && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    // Days from next month
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day next-month">
          {day}
        </div>
      );
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            onClick={goToPreviousMonth}
            className="nav-button"
          >
            &lt;
          </button>
          <h3>{monthNames[currentMonth]} {currentYear}</h3>
          <button 
            onClick={goToNextMonth}
            className="nav-button"
          >
            &gt;
          </button>
        </div>
        <div className="calendar-weekdays">
          {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Loading state jika belum ada access
  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - I&apos;AMpel GADING</title>
      </Head>
      
      <Navbar variant="booking" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-2">Pilih Tanggal Booking</h1>
            <p className="text-gray-600">Pilih tanggal dan lengkapi data untuk melanjutkan booking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - Calendar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {generateCalendar()}
              {selectedDate && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium text-center">
                    <span className="text-sm">Tanggal terpilih:</span><br />
                    <span className="text-lg">
                      {selectedDate.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - Order Summary & Form */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Rincian Pesanan</h2>
                <div className="space-y-3">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Rp {item.price.toLocaleString()} × {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          Rp {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total Pembayaran:</span>
                    <span className="text-xl font-bold text-green-600">
                      Rp {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Data Pembooking */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Pembooking</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIK
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nik}
                        onChange={(e) => setFormData({...formData, nik: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan NIK"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon Darurat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.emergency}
                      onChange={(e) => setFormData({...formData, emergency: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan nomor telepon darurat"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nomor telepon yang dapat dihubungi dalam keadaan darurat
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={!selectedDate || cartItems.length === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Lanjutkan Pembayaran
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 md:flex-none bg-red-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Batalkan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}