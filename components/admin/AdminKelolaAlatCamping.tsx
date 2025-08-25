import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function AdminAlatCampingUpload({ onUpload }: { onUpload: (url: string) => void }) {
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

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload-camping', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.success) {
      onUpload(data.url); // URL public dari bucket gambar-camping
      setSuccess(true);
    } else {
      alert('Upload gagal: ' + data.message);
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

export default function AdminKelolaAlatCamping() {
  const { data } = useSWR('/api/admin/alat-camping', fetcher);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [form, setForm] = useState<any>({
    id: null, gambar: '', nama_alat: '', harga: '', satuan: '', keterangan: '', status: ''
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = (type: 'add' | 'edit' | 'detail', alat?: any) => {
    setModalType(type);
    setShowModal(true);
    if (alat) setForm(alat);
    else setForm({ id: null, gambar: '', nama_alat: '', harga: '', satuan: '', keterangan: '', status: '' });
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setForm({ id: null, gambar: '', nama_alat: '', harga: '', satuan: '', keterangan: '', status: '' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (modalType === 'add') {
      await fetch('/api/admin/alat-camping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else if (modalType === 'edit') {
      await fetch('/api/admin/alat-camping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setLoading(false);
    handleClose();
    mutate('/api/admin/alat-camping');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus alat camping ini?')) return;
    await fetch('/api/admin/alat-camping', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutate('/api/admin/alat-camping');
  };

  const alatList = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Kelola Alat Camping</h3>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => handleOpen('add')}
        >
          Tambah Alat Camping
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-3">Gambar</th>
              <th className="py-2 px-3">Nama Alat</th>
              <th className="py-2 px-3">Harga</th>
              <th className="py-2 px-3">Satuan</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Keterangan</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alatList.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="py-2 px-3">
                  <img src={a.gambar} alt={a.nama_alat} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="py-2 px-3">{a.nama_alat}</td>
                <td className="py-2 px-3">Rp {Number(a.harga).toLocaleString()}</td>
                <td className="py-2 px-3">{a.satuan}</td>
                <td className="py-2 px-3">{a.status}</td>
                <td className="py-2 px-3 max-w-xs">{a.keterangan.length > 30 ? a.keterangan.slice(0, 30) + '...' : a.keterangan}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button
                    className="admin-action-btn bg-blue-100 text-blue-700 hover:bg-blue-200"
                    title="Detail"
                    onClick={() => handleOpen('detail', a)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    Detail
                  </button>
                  <button
                    className="admin-action-btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    title="Detail"
                    onClick={() => handleOpen('edit', a)}
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
                    onClick={() => handleDelete(a.id)}
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
                <h4 className="text-lg font-bold mb-2">Detail Alat Camping</h4>
                <img src={form.gambar} alt={form.nama_alat} className="w-32 h-32 object-cover rounded mb-2" />
                <div className="mb-2"><b>Nama Alat:</b> {form.nama_alat}</div>
                <div className="mb-2"><b>Harga:</b> Rp {Number(form.harga).toLocaleString()}</div>
                <div className="mb-2"><b>Satuan:</b> {form.satuan}</div>
                <div className="mb-2"><b>Status:</b> {form.status}</div>
                <div className="mb-2"><b>Keterangan:</b> {form.keterangan}</div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-lg font-bold">{modalType === 'add' ? 'Tambah' : 'Update'} Alat Camping</h4>
                <AdminAlatCampingUpload onUpload={url => setForm((f: any) => ({ ...f, gambar: url }))} />
                <input className="input-field w-full" placeholder="Nama Alat" name="nama_alat" value={form.nama_alat} onChange={e => setForm({ ...form, nama_alat: e.target.value })} required />
                <input className="input-field w-full" placeholder="Harga" name="harga" type="number" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} required />
                <input className="input-field w-full" placeholder="Satuan" name="satuan" value={form.satuan} onChange={e => setForm({ ...form, satuan: e.target.value })} required />
                <select
                  className="input-field w-full"
                  name="status"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="tidak aktif">Tidak Aktif</option>
                </select>
                <textarea className="input-field w-full" placeholder="Keterangan" name="keterangan" value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} required rows={3} />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  disabled={loading || !form.gambar}
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