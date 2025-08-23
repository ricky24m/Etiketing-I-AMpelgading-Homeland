import { useState } from 'react';
import AdminImageUpload from './AdminImageUpload';

export default function AdminAddMenu() {
  const [nama_menu, setNamaMenu] = useState('');
  const [harga, setHarga] = useState('');
  const [kategori, setKategori] = useState('');
  const [gambarUrl, setGambarUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/add-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_menu,
        harga,
        kategori,
        gambar: gambarUrl, // URL hasil upload ke Supabase
      }),
    });
    const data = await res.json();
    if (data.success) alert('Menu berhasil ditambah!');
    else alert('Gagal: ' + data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded shadow">
      <input
        className="input-field"
        value={nama_menu}
        onChange={e => setNamaMenu(e.target.value)}
        placeholder="Nama Menu"
        required
      />
      <input
        className="input-field"
        value={harga}
        onChange={e => setHarga(e.target.value)}
        placeholder="Harga"
        required
        type="number"
      />
      <input
        className="input-field"
        value={kategori}
        onChange={e => setKategori(e.target.value)}
        placeholder="Kategori"
        required
      />
      <AdminImageUpload onUpload={setGambarUrl} />
      <button type="submit" className="btn-primary w-full">Simpan Menu</button>
    </form>
  );
}