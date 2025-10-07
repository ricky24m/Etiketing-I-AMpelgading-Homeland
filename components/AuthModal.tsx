import React, { useState, useEffect } from 'react';

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
            kota_asal: form.kota_asal,
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
            kota_asal: form.kota_asal,
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
                name="kota_asal"
                placeholder="Kota Asal"
                required
                minLength={3}
                onChange={handleChange}
              />
              <input
                className="input-field w-full"
                name="phone"
                placeholder="Nomor Telepon (08xxxxxxxxx)"
                required
                pattern="^08\d{8,11}$"
                title="Format: 08xxxxxxxxx"
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
                  {showPassword ? '🙈' : '👁️'}
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
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </>
          )}
          {type === 'forgot' && (
            <>
              <input className="input-field w-full" name="email" placeholder="Email" type="email" required onChange={handleChange} />
              <input className="input-field w-full" name="kota_asal" placeholder="Kota Asal" required minLength={3} onChange={handleChange} />
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
                  {showForgotPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
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