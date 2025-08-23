import { useState, useEffect } from 'react';

export interface AdminUser {
  id: number;
  username: string;
  nama_lengkap: string;
  email: string;
}

export default function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    console.log('useAdminAuth useEffect - adminData from localStorage:', adminData); // Debug
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        console.log('useAdminAuth useEffect - parsed admin:', parsedAdmin); // Debug
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('useAdminAuth login - attempting login...'); // Debug
      
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('useAdminAuth login - response status:', res.status); // Debug
      
      const data = await res.json();
      console.log('useAdminAuth login - response data:', data); // Debug
      
      if (data.success) {
        console.log('useAdminAuth login - setting admin data...'); // Debug
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        setAdmin(data.admin);
        console.log('useAdminAuth login - admin state updated:', data.admin); // Debug
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  console.log('useAdminAuth current state:', { admin, loading }); // Debug

  return { admin, loading, login, logout };
}