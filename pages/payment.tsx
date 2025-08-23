import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Payment() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch QRIS data
  const { data: qrisData } = useSWR('/api/admin/qris', fetcher);

  useEffect(() => {
    // Ambil data order dari sessionStorage yang disimpan dari checkout
    const savedOrderData = sessionStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      // Jika tidak ada data order, redirect ke katalog
      router.push('/katalog');
    }
  }, [router]);

  const handleOrderComplete = async () => {
    if (!orderData) return;

    setLoading(true);
    
    try {
      // Update status order menjadi 'Belum terverifikasi'
      const response = await fetch('/api/admin/update-booking-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.order_id,
          status: 'Belum terverifikasi'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Set flag bahwa user datang dari payment page
        sessionStorage.setItem('fromPayment', 'true');
        
        // Simpan data order untuk halaman tiket
        sessionStorage.setItem('ticketData', JSON.stringify(orderData));
        
        // Hapus data payment
        sessionStorage.removeItem('orderData');
        
        // Redirect ke halaman tiket
        router.push('/tiket');
      } else {
        alert('Gagal memproses pesanan: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Terjadi kesalahan saat memproses pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Yakin ingin membatalkan pembayaran? Data pesanan akan hilang.')) {
      sessionStorage.removeItem('orderData');
      router.push('/katalog');
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '6283838838668'; // Ganti dengan nomor WhatsApp yang sesuai
    const message = `Halo, saya ingin mengirim bukti pembayaran untuk pesanan dengan Order ID: ${orderData?.order_id}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  const qris = qrisData?.data;

  return (
    <>
      <Head>
        <title>Pembayaran - I&apos;AMpel GADING</title>
      </Head>
      
      <Navbar variant="booking" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-2">Metode Pembayaran</h1>
            <p className="text-gray-600">Scan QR Code untuk melakukan pembayaran</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - QRIS */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">QR Code Pembayaran</h2>
              
              {qris ? (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                    <img 
                      src={qris.gambar} 
                      alt="QRIS Payment Code" 
                      className="w-80 h-80 object-contain"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Total Pembayaran
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      Rp {orderData.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📱</div>
                  <p className="text-gray-600">QR Code tidak tersedia</p>
                  <p className="text-sm text-gray-500 mt-2">Hubungi admin untuk bantuan</p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - Instructions & Order Details */}
            <div className="space-y-6">
              {/* Payment Instructions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Instruksi Pembayaran</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                      Harap scan QR Code di samping untuk melakukan pembayaran sejumlah{' '}
                      <span className="font-bold">Rp {orderData.total.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">Langkah Pembayaran:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Buka aplikasi mobile banking atau e-wallet Anda</li>
                      <li>Pilih menu "Scan QR" atau "Bayar dengan QR"</li>
                      <li>Scan QR Code yang tersedia di samping</li>
                      <li>Pastikan nominal pembayaran sesuai</li>
                      <li>Lakukan pembayaran</li>
                      <li>Screenshot bukti pembayaran</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{orderData.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Booking:</span>
                    <span>{new Date(orderData.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Pemesan:</span>
                    <span>{orderData.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{orderData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nomor Telepon:</span>
                    <span>{orderData.phone}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Items yang Dipesan:</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{orderData.items}</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total Pembayaran:</span>
                    <span className="text-2xl font-bold text-green-600">
                      Rp {orderData.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Instructions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Setelah Pembayaran</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-3">
                      Kirim bukti pembayaran ke WhatsApp ini, setelah itu kembali ke halaman ini dan tekan tombol "Pesanan Selesai"
                    </p>
                    <button
                      onClick={openWhatsApp}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Kirim Bukti Pembayaran
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      onClick={handleOrderComplete}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      {loading ? 'Memproses...' : 'Pesanan Selesai'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Batalkan Pesanan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}