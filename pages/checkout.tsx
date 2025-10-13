import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>(''); // Default kosong
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [accessGranted, setAccessGranted] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kota_asal: '',
    phone: '',
    emergency: '',
    email: '',
    kendaraan: ''
  });

  // Cek apakah ada item dengan kategori "Paket Camping" di keranjang
  const hasCampingItem = cartItems.some(item => 
    item.kategori === 'Paket Camping'
  );

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
        kota_asal: userData.kota_asal || '',
        phone: userData.nomor_telepon || '',
        emergency: '',
        email: userData.email || '',
        kendaraan: ''
      });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Pilih tanggal booking terlebih dahulu');
      return;
    }

    // Hanya wajib isi waktu jika ada item dengan kategori "Paket Camping"
    if (hasCampingItem && !selectedTime) {
      alert('Pilih waktu kedatangan untuk paket camping');
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

    if (!formData.kendaraan) {
      alert('Jumlah dan jenis kendaraan harus diisi');
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
          waktu_kedatangan: selectedTime || null, // Kirim null jika tidak diisi
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
          kota_asal: formData.kota_asal,
          kendaraan: formData.kendaraan,
          tanggal: selectedDate.toISOString(),
          waktu_kedatangan: selectedTime || null,
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

  // Generate time options (jam operasional 15:00 - 00:00)
  const generateTimeOptions = () => {
    const options = [
      <option key="empty" value="">
        -- Pilih Waktu Kedatangan --
      </option>
    ];
    
    // Dari 15:00 sampai 23:30 (hari yang sama)
    for (let hour = 15; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = `${timeString} WIB`;
        options.push(
          <option key={timeString} value={timeString}>
            {displayTime}
          </option>
        );
      }
    }
    
    // Tambah 00:00 (tengah malam)
    options.push(
      <option key="00:00" value="00:00">
        00:00 WIB
      </option>
    );
    
    return options;
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
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              {hasCampingItem ? 'Pilih Tanggal & Waktu Booking' : 'Pilih Tanggal Booking'}
            </h1>
            <p className="text-gray-600">
              {hasCampingItem 
                ? 'Pilih tanggal dan waktu kedatangan untuk paket camping, lalu lengkapi data untuk melanjutkan booking'
                : 'Pilih tanggal dan lengkapi data untuk melanjutkan booking'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - Calendar & Time Picker (conditional) */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Tanggal</h3>
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

              {/* Time Picker - Hanya tampil jika ada paket camping */}
              {hasCampingItem && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Waktu Kedatangan <span className="text-red-500">*</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waktu Kedatangan <span className="text-red-500">* (Wajib untuk paket camping)</span>
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        {generateTimeOptions()}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        📍 <strong>Jam Check-in Camping:</strong> 15:00 - 00:00 WIB<br />
                        <span className="text-orange-600">
                          ⚠️ <strong>Paket camping terdeteksi:</strong> Waktu kedatangan wajib diisi
                        </span>
                      </p>
                    </div>
                    
                    {selectedTime && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 font-medium text-center">
                          <span className="text-sm">Waktu kedatangan:</span><br />
                          <span className="text-lg">{selectedTime} WIB</span>
                        </p>
                      </div>
                    )}

                    {/* Info tentang items di keranjang */}
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-800 font-medium mb-1">🏕️ Paket Camping Terdeteksi:</p>
                      <div className="space-y-1">
                        {cartItems
                          .filter(item => item.kategori === 'Paket Camping')
                          .map((item, idx) => (
                            <div key={idx} className="text-xs text-orange-700 flex justify-between">
                              <span>{item.name}</span>
                              <span className="font-medium">🏕️ Camping</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info jika tidak ada paket camping */}
              {!hasCampingItem && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pemesanan</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      💡 <strong>Info:</strong> Pemilihan waktu kedatangan hanya diperlukan untuk paket camping. 
                      Pesanan Anda tidak memerlukan waktu kedatangan khusus.
                    </p>
                  </div>
                  
                  {/* Info tentang items di keranjang */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">📦 Pesanan Anda:</p>
                    <div className="space-y-1">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-500 flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium">📦 {item.kategori || 'Regular'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                        <p className="text-xs text-gray-500">
                          {item.kategori === 'Paket Camping' ? '🏕️ Paket Camping' : `📦 ${item.kategori || 'Regular'}`}
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
                        Kota Asal
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.kota_asal}
                        onChange={(e) => setFormData({...formData, kota_asal: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan kota asal"
                        minLength={3}
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
                  
                  {/* Field Kendaraan - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah dan Jenis Kendaraan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.kendaraan}
                      onChange={(e) => setFormData({...formData, kendaraan: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Contoh: 1 Motor atau 1 Motor dan 1 Mobil"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Sebutkan dengan jelas jumlah dan jenis kendaraan yang dibawa
                    </p>
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
                      disabled={!selectedDate || cartItems.length === 0 || (hasCampingItem && !selectedTime)}
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