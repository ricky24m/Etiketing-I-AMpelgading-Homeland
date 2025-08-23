import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Tiket() {
  const router = useRouter();
  const [ticketData, setTicketData] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek access control - harus melalui payment page
    const fromPayment = sessionStorage.getItem('fromPayment');
    const savedTicketData = sessionStorage.getItem('ticketData');
    
    if (!fromPayment || !savedTicketData) {
      // Jika tidak melalui payment page, redirect ke home
      router.push('/');
      return;
    }
    
    // Grant access dan set data
    setAccessGranted(true);
    setTicketData(JSON.parse(savedTicketData));
    
    // Clear access flag setelah digunakan
    sessionStorage.removeItem('fromPayment');
  }, [router]);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    
    setDownloading(true);
    
    try {
      // Capture element sebagai canvas
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new page if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`E-Ticket-${ticketData.order_id}.pdf`);
      
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Gagal mendownload tiket. Silakan coba lagi.');
    } finally {
      setDownloading(false);
    }
  };

  const handleBackToHome = () => {
    sessionStorage.removeItem('ticketData');
    router.push('/');
  };

  // Loading state jika belum ada access atau data
  if (!accessGranted || !ticketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>E-Ticket - I&apos;AMpel GADING</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Beranda
            </button>
            
            <button
              onClick={downloadTicket}
              disabled={downloading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {downloading ? 'Downloading...' : 'Download Tiket'}
            </button>
          </div>

          {/* Ticket */}
          <div 
            ref={ticketRef}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto max-w-3xl"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {/* Header Tiket */}
            <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 px-8 py-6 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full -translate-y-12"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">E-TICKET</h1>
                    <p className="text-green-100 text-lg">I'AMpel GADING HOMELAND</p>
                    <p className="text-green-200 text-sm mt-1">Wisata Alam & Camping Ground</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                      <p className="text-sm text-green-100">Order ID</p>
                      <p className="font-mono text-lg font-bold">{ticketData.order_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-6 h-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-full -translate-x-3 -translate-y-3"></div>
              <div className="absolute right-0 top-0 w-6 h-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-full translate-x-3 -translate-y-3"></div>
              <div className="border-t-2 border-dashed border-gray-200 mx-6"></div>
            </div>

            {/* Content Tiket */}
            <div className="px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Data Pemesan */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    Data Pemesan
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Nama Lengkap:</span>
                      <span className="font-semibold text-gray-800">{ticketData.nama}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="font-semibold text-gray-800">{ticketData.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">No. Telepon:</span>
                      <span className="font-semibold text-gray-800">{ticketData.phone}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Tanggal Booking:</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(ticketData.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detail Pesanan */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Detail Pesanan
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Paket yang Dipilih:</p>
                      <p className="font-semibold text-gray-800">{ticketData.items}</p>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-t-2 border-green-100">
                      <span className="text-lg font-bold text-gray-800">Total Pembayaran:</span>
                      <span className="text-2xl font-bold text-green-600">
                        Rp {Number(ticketData.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Section - Tanpa QR Code */}
              <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Informasi Penting</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Sebelum Datang:</h4>
                      <ul className="text-sm text-blue-700 text-left space-y-1">
                        <li>• Tunjukkan e-ticket ini saat check-in</li>
                        <li>• Datang 30 menit sebelum waktu yang ditentukan</li>
                        <li>• Bawa identitas asli sesuai data booking</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Kontak Bantuan:</h4>
                      <div className="text-sm text-green-700 text-left space-y-1">
                        <div>• WhatsApp: 085-123-456-789</div>
                        <div>• Email: info@iampelgading.com</div>
                        <div>• Jam Operasional: 08:00 - 17:00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Tiket dibuat pada: {new Date().toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-xs text-gray-400">
                  © 2025 I'AMpel GADING HOMELAND. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Booking Berhasil!</h3>
            <p className="text-green-700 mb-4">
              Terima kasih telah memilih I'AMpel GADING HOMELAND. 
              E-ticket Anda telah berhasil dibuat dan siap digunakan.
            </p>
            <p className="text-sm text-green-600">
              Silakan download e-ticket ini untuk disimpan dan ditunjukkan saat check-in.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}