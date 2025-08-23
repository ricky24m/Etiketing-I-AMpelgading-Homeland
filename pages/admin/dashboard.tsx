import { useRouter } from 'next/router';
import { useEffect } from 'react';
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar active={tab} />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tab === 'booking' && 'Daftar Booking'}
              {tab === 'finance' && 'Laporan Keuangan'}
              {tab === 'testimoni' && 'Kelola Testimoni'}
              {tab === 'galeri' && 'Kelola Galeri'}
              {tab === 'menu' && 'Kelola Menu'}
              {tab === 'alat' && 'Kelola Alat Camping'}
              {tab === 'qris' && 'Kelola QRIS'}
            </h1>
            <p className="text-gray-600">
              Selamat datang, <span className="font-medium">{admin.nama_lengkap}</span>
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {tab === 'booking' && <BookingTable />}
            {tab === 'finance' && <FinanceReport />}
            {tab === 'testimoni' && <AdminTestimoni />}
            {tab === 'galeri' && <AdminGaleri />}
            {tab === 'menu' && <AdminKelolaMenu />}
            {tab === 'alat' && <AdminKelolaAlatCamping />}
            {tab === 'qris' && <AdminQRIS />}
          </div>
        </div>
      </main>
    </div>
  );
}