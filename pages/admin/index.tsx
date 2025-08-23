import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAdminAuth from '../../hooks/useAdminAuth';
import AdminLogin from '../../components/admin/AdminLogin';

export default function AdminIndex() {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('AdminIndex useEffect - admin:', admin, 'loading:', loading); // Debug

    if (!loading && admin && !hasRedirected) {
      console.log('AdminIndex useEffect - redirecting to dashboard...'); // Debug
      setHasRedirected(true);
      router.push('/admin/dashboard');
    }
  }, [admin, loading, router, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (admin) {
    console.log('AdminIndex render - admin found, should redirect...'); // Debug
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return <AdminLogin />;
}