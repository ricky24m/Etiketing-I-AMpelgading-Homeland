import { useState, useEffect } from 'react';

type ModalType = 'login' | 'register' | 'forgot';

export default function AuthModal({
  isOpen,
  onClose,
  defaultType = 'login',
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ModalType;
}) {
  const [type, setType] = useState<ModalType>(defaultType);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState('');
  const [notifType, setNotifType] = useState<'success' | 'error'>('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Reset type saat modal dibuka
  useEffect(() => {
    if (isOpen) setType(defaultType);
  }, [isOpen, defaultType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotif('');
    try {
      if (type === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (data.success) {
          setNotif('Login berhasil!');
          setNotifType('success');
          localStorage.setItem('userData', JSON.stringify(data.user));
          window.location.reload();
        } else {
          setNotif(data.message);
          setNotifType('error');
        }
      } else if (type === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: form.nama,
            nik: form.nik,
            phone: form.phone,
            email: form.email,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setNotif('Registrasi berhasil! Silakan login.');
          setNotifType('success');
          setType('login');
        } else {
          setNotif(data.message);
          setNotifType('error');
        }
      } else if (type === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            nik: form.nik,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setNotif('Password berhasil diubah! Silakan login.');
          setNotifType('success');
          setType('login');
        } else {
          setNotif(data.message);
          setNotifType('error');
        }
      }
    } catch {
      setNotif('Terjadi kesalahan');
      setNotifType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-2 text-center">
          {type === 'login' && 'Login'}
          {type === 'register' && 'Registrasi'}
          {type === 'forgot' && 'Lupa Password'}
        </h2>
        {/* Switcher bawah judul */}
        {type === 'login' && (
          <div className="mb-4 text-center text-sm">
            Belum punya akun?{' '}
            <button
              className="text-blue-600 underline"
              type="button"
              onClick={() => setType('register')}
            >
              Silakan daftar
            </button>
          </div>
        )}
        {type === 'register' && (
          <div className="mb-4 text-center text-sm">
            Sudah punya akun?{' '}
            <button
              className="text-blue-600 underline"
              type="button"
              onClick={() => setType('login')}
            >
              Silakan Login
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <input
                className="input-field w-full"
                name="nama"
                placeholder="Nama Lengkap"
                required
                onChange={handleChange}
              />
              <input
                className="input-field w-full"
                name="nik"
                placeholder="NIK"
                required
                maxLength={16}
                onChange={handleChange}
              />
              <input
                className="input-field w-full"
                name="phone"
                placeholder="Nomor Telepon"
                required
                onChange={handleChange}
              />
              <input
                className="input-field w-full"
                name="email"
                placeholder="Email"
                type="email"
                required
                onChange={handleChange}
              />
              <div className="relative">
                <input
                  className="input-field w-full pr-10"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575m1.875-2.25A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.221-1.125 4.575m-1.875 2.25A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>
                  )}
                </button>
              </div>
            </>
          )}
          {type === 'forgot' && (
            <>
              <input className="input-field w-full" name="email" placeholder="Email" type="email" required onChange={handleChange} />
              <input className="input-field w-full" name="nik" placeholder="NIK" required maxLength={16} onChange={handleChange} />
              <div className="relative">
                <input
                  className="input-field w-full pr-10"
                  name="password"
                  placeholder="Password Baru"
                  type={showForgotPassword ? 'text' : 'password'}
                  required
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowForgotPassword(v => !v)}
                >
                  {showForgotPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575m1.875-2.25A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.221-1.125 4.575m-1.875 2.25A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>
                  )}
                </button>
              </div>
            </>
          )}
          {type === 'login' && (
            <>
              <input className="input-field w-full" name="email" placeholder="Email" type="email" required onChange={handleChange} />
              <div className="relative">
                <input
                  className="input-field w-full pr-10"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575m1.875-2.25A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.221-1.125 4.575m-1.875 2.25A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>
                  )}
                </button>
              </div>
            </>
          )}
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full" disabled={loading}>
            {loading ? 'Memproses...' : (type === 'login' ? 'Login' : type === 'register' ? 'Daftar' : 'Ubah Password')}
          </button>
        </form>
        {notif && (
          <div className={`mt-3 text-center text-sm ${notifType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {notif}
          </div>
        )}
        {type === 'login' && (
          <div className="flex justify-center mt-4 text-sm">
            <button className="text-blue-600 underline" type="button" onClick={() => setType('forgot')}>Lupa Password?</button>
          </div>
        )}
      </div>
    </div>
  );
}