import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function AdminGaleriUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-galeri', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        onUpload(data.url);
        setSuccess(true);
      } else {
        alert('Upload gagal: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={success} />
      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
      )}
      {!success && (
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
      {success && (
        <div className="text-green-600 font-semibold">Upload berhasil!</div>
      )}
    </div>
  );
}

export default function AdminGaleri() {
  const { data } = useSWR('/api/admin/galeri', fetcher);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [form, setForm] = useState({ id: null, gambar: '', judul: '', deskripsi: '' });
  const [loading, setLoading] = useState(false);

  const handleOpen = (type: 'add' | 'edit' | 'detail', galeri?: any) => {
    setModalType(type);
    setShowModal(true);
    if (galeri) setForm(galeri);
    else setForm({ id: null, gambar: '', judul: '', deskripsi: '' });
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setForm({ id: null, gambar: '', judul: '', deskripsi: '' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (modalType === 'add') {
      await fetch('/api/admin/galeri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else if (modalType === 'edit') {
      await fetch('/api/admin/galeri', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setLoading(false);
    handleClose();
    mutate('/api/admin/galeri');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus galeri ini? Gambar juga akan dihapus dari storage.')) return;
    
    try {
      const response = await fetch('/api/admin/galeri', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Galeri berhasil dihapus beserta gambarnya!');
        mutate('/api/admin/galeri');
      } else {
        alert('Gagal menghapus galeri: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting galeri:', error);
      alert('Terjadi kesalahan saat menghapus galeri');
    }
  };

  const galeri = data?.data || [];
  const maxed = galeri.length >= 6;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Kelola Galeri</h3>
        <button
          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${maxed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleOpen('add')}
          disabled={maxed}
        >
          Tambah Galeri
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-3">Gambar</th>
              <th className="py-2 px-3">Judul</th>
              <th className="py-2 px-3">Deskripsi</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {galeri.map((g: any) => (
              <tr key={g.id} className="border-b">
                <td className="py-2 px-3">
                  <img src={g.gambar} alt={g.judul} className="w-20 h-20 object-cover rounded" />
                </td>
                <td className="py-2 px-3">{g.judul}</td>
                <td className="py-2 px-3 max-w-xs">
                  {g.deskripsi.length > 40 ? g.deskripsi.slice(0, 40) + '...' : g.deskripsi}
                </td>
                <td className="py-2 px-3 flex gap-2">
                  <button
                    className="admin-action-btn bg-blue-100 text-blue-700 hover:bg-blue-200"
                    title="Detail"
                    onClick={() => handleOpen('detail', g)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    Detail
                  </button>
                  <button
                    className="admin-action-btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    title="Detail"
                    onClick={() => handleOpen('edit', g)}
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
                    onClick={() => handleDelete(g.id)}
                  >
                    <svg className="w-4 h-4 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10" />
                    </svg>
                    Hapus
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
                <h4 className="text-lg font-bold mb-2">Detail Galeri</h4>
                <img src={form.gambar} alt={form.judul} className="w-32 h-32 object-cover rounded mb-2" />
                <div className="mb-2"><b>Judul:</b> {form.judul}</div>
                <div className="mb-2"><b>Deskripsi:</b> {form.deskripsi}</div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-lg font-bold">{modalType === 'add' ? 'Tambah' : 'Edit'} Galeri</h4>
                <AdminGaleriUpload onUpload={url => setForm(f => ({ ...f, gambar: url }))} />
                <input
                  className="input-field w-full"
                  placeholder="Judul"
                  value={form.judul}
                  onChange={e => setForm({ ...form, judul: e.target.value })}
                  required
                />
                <textarea
                  className="input-field w-full"
                  placeholder="Deskripsi"
                  value={form.deskripsi}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  required
                  rows={3}
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