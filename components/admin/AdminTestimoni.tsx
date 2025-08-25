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
                  <button
                    className="admin-action-btn bg-blue-100 text-blue-700 hover:bg-blue-200"
                    title="Detail"
                    onClick={() => handleOpen('detail', t)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    Detail
                  </button>
                  <button
                    className="admin-action-btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    title="Detail"
                    onClick={() => handleOpen('edit', t)}
                  >
                    <svg className="w-4 h-4 mr-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 013.536 3.536L7.5 20.036H4v-3.5L16.732 3.732z" />
                    </svg>
                    Ubah
                  </button>
                  <button
                    className="admin-action-btn bg-red-100 text-red-700 hover:bg-red-200"
                    title="Detail"
                    onClick={() => handleDelete(t.id)}
                  >
                    <svg className="w-4 h-4 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10" />
                    </svg>
                    Hapuss
                  </button>
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
                  {[5, 4, 3, 2, 1].map(n => (
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