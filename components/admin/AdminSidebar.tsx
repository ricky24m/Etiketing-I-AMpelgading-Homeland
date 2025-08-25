import Link from 'next/link';
import { useRouter } from 'next/router';
import useAdminAuth from '../../hooks/useAdminAuth';

interface AdminSidebarProps {
  active: string;
  isOpen: boolean;
}

export default function AdminSidebar({ active, isOpen }: AdminSidebarProps) {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Yakin ingin logout?')) {
      logout();
      router.push('/admin');
    }
  };

  return (
    <aside className={`fixed left-0 top-0 z-30 h-full bg-gradient-to-b from-green-800 to-green-900 text-white transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } w-72 shadow-2xl`}>
      <div className="p-6 h-full flex flex-col">
        {/* Admin Info - moved to top and updated spacing */}
        <div className="bg-green-700/50 rounded-xl p-4 mb-6 mt-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold text-sm">
                {admin?.nama_lengkap?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{admin?.nama_lengkap}</p>
              <p className="text-green-200 text-xs">@{admin?.username}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <Link href="/admin/dashboard">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'booking' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Daftar Booking
            </span>
          </Link>

          <Link href="/admin/dashboard?tab=finance">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'finance' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Keuangan
            </span>
          </Link>

          <Link href="/admin/dashboard?tab=testimoni">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'testimoni' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Testimoni
            </span>
          </Link>

          <Link href="/admin/dashboard?tab=galeri">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'galeri' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002-2v12a2 2 0 01-2 2z" />
              </svg>
              Galeri
            </span>
          </Link>

          <Link href="/admin/dashboard?tab=menu">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'menu' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Kelola Menu
            </span>
          </Link>

          <Link href="/admin/dashboard?tab=alat">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'alat' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Kelola Alat Camping
            </span>
          </Link>

          <Link href="/admin/dashboard?tab=qris">
            <span className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              active === 'qris' 
                ? 'bg-green-600 shadow-lg' 
                : 'hover:bg-green-700/50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h2m0-6V9a3 3 0 00-3-3H9m1.5-2-3 3 3 3" />
              </svg>
              QRIS
            </span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-left hover:bg-red-600/20 rounded-xl transition-all duration-200 text-red-300 hover:text-red-200"
          >
            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}