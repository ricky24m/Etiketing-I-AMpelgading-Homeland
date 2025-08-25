import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useAdminAuth from '../../hooks/useAdminAuth';
import AdminSidebar from '../../components/admin/AdminSidebar';
import BookingTable from '../../components/admin/BookingTable';
import FinanceReport from '../../components/admin/FinanceReport';
import AdminTestimoni from '../../components/admin/AdminTestimoni';
import AdminGaleri from '../../components/admin/AdminGaleri';
import AdminKelolaMenu from '../../components/admin/AdminKelolaMenu';
import AdminKelolaAlatCamping from '../../components/admin/AdminKelolaAlatCamping';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminQRIS from '../../components/admin/AdminQRIS';

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();
  const tab = router.query.tab as string || 'booking';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin');
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin />;
  }

  const getPageTitle = () => {
    switch (tab) {
      case 'booking': return 'Daftar Booking';
      case 'finance': return 'Laporan Keuangan';
      case 'testimoni': return 'Kelola Testimoni';
      case 'galeri': return 'Kelola Galeri';
      case 'menu': return 'Kelola Menu';
      case 'alat': return 'Kelola Alat Camping';
      case 'qris': return 'Kelola QRIS';
      default: return 'Dashboard Admin';
    }
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()} - I&apos;AMpel GADING Admin</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar active={tab} isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-4">
              {/* Burger Menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Toggle Sidebar"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo */}
              <img
                src="/images/Logoo.png"
                alt="I'AMpel GADING Logo"
                className="h-10 w-auto object-contain"
              />
              
              {/* Page Title */}
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500">
                  Selamat datang, <span className="font-medium">{admin.nama_lengkap}</span>
                </p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Mobile Page Title */}
              <div className="md:hidden mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-600 mt-1">
                  Selamat datang, <span className="font-medium">{admin.nama_lengkap}</span>
                </p>
              </div>

              {/* Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {tab === 'booking' && <BookingTable />}
                  {tab === 'finance' && <FinanceReport />}
                  {tab === 'testimoni' && <AdminTestimoni />}
                  {tab === 'galeri' && <AdminGaleri />}
                  {tab === 'menu' && <AdminKelolaMenu />}
                  {tab === 'alat' && <AdminKelolaAlatCamping />}
                  {tab === 'qris' && <AdminQRIS />}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
}