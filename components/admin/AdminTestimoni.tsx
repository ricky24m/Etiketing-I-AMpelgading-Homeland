import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminTestimoni() {
  const { data, isLoading } = useSWR('/api/admin/testimoni', fetcher);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [form, setForm] = useState({ id: null, nama: '', bintang: 5, komen: '' });
  const [loading, setLoading] = useState(false);

  const handleOpen = (type: 'add' | 'edit' | 'detail', testimoni?: any) => {
    setModalType(type);
    setShowModal(true);
    if (testimoni) setForm(testimoni);
    else setForm({ id: null, nama: '', bintang: 5, komen: '' });
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setForm({ id: null, nama: '', bintang: 5, komen: '' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (modalType === 'add') {
      await fetch('/api/admin/testimoni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else if (modalType === 'edit') {
      await fetch('/api/admin/testimoni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setLoading(false);
    handleClose();
    mutate('/api/admin/testimoni');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus testimoni ini?')) return;
    await fetch('/api/admin/testimoni', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutate('/api/admin/testimoni');
  };

  const testimoni = data?.data || [];
  const maxed = testimoni.length >= 10;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Kelola Testimoni</h3>
        <button
          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${maxed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleOpen('add')}
          disabled={maxed}
        >
          Tambah Testimoni
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-3">Nama</th>
              <th className="py-2 px-3">Bintang</th>
              <th className="py-2 px-3">Komen</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {testimoni.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="py-2 px-3">{t.nama}</td>
                <td className="py-2 px-3 text-yellow-500">{'★'.repeat(t.bintang)}</td>
                <td className="py-2 px-3 max-w-xs">
                  {t.komen.length > 40 ? t.komen.slice(0, 40) + '...' : t.komen}
                </td>
                <td className="py-2 px-3 flex gap-2">
                  <button className="text-blue-600 underline" onClick={() => handleOpen('detail', t)}>Detail</button>
                  <button className="text-green-600 underline" onClick={() => handleOpen('edit', t)}>Edit</button>
                  <button className="text-red-600 underline" onClick={() => handleDelete(t.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400" onClick={handleClose}>✕</button>
            {modalType === 'detail' ? (
              <>
                <h4 className="text-lg font-bold mb-2">Detail Testimoni</h4>
                <div className="mb-2"><b>Nama:</b> {form.nama}</div>
                <div className="mb-2"><b>Bintang:</b> {'★'.repeat(form.bintang)}</div>
                <div className="mb-2"><b>Komentar:</b> {form.komen}</div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-lg font-bold">{modalType === 'add' ? 'Tambah' : 'Edit'} Testimoni</h4>
                <input
                  className="input-field w-full"
                  placeholder="Nama"
                  value={form.nama}
                  onChange={e => setForm({ ...form, nama: e.target.value })}
                  required
                />
                <select
                  className="input-field w-full"
                  value={form.bintang}
                  onChange={e => setForm({ ...form, bintang: Number(e.target.value) })}
                  required
                >
                  {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} Bintang</option>
                  ))}
                </select>
                <textarea
                  className="input-field w-full"
                  placeholder="Komentar"
                  value={form.komen}
                  onChange={e => setForm({ ...form, komen: e.target.value })}
                  required
                  rows={4}
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}