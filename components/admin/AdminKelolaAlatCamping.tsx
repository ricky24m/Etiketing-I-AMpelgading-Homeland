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
    <div className="space-y-3">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={success}
        className="w-full text-sm"
      />
      {preview && (
        <div className="space-y-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded border" 
          />
          <p className="text-xs text-gray-500 text-center">
            Preview gambar alat camping
          </p>
        </div>
      )}
      {!success && (
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
      {success && (
        <div className="text-green-600 font-semibold text-sm text-center">Upload berhasil!</div>
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
    if (!form.gambar) {
      alert('Gambar alat camping wajib di-upload!');
      return;
    }
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
    if (!confirm('Hapus alat camping ini? Gambar juga akan dihapus dari storage.')) return;
    
    try {
      const response = await fetch('/api/admin/alat-camping', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Alat camping berhasil dihapus beserta gambarnya!');
        mutate('/api/admin/alat-camping');
      } else {
        alert('Gagal menghapus alat camping: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting alat camping:', error);
      alert('Terjadi kesalahan saat menghapus alat camping');
    }
  };

  const alatList = data?.data || [];

  const truncate = (text: string, max: number) =>
    text && text.length > max ? text.slice(0, max) + '...' : text;

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
                <td className="py-2 px-3">{truncate(a.nama_alat, 20)}</td>
                <td className="py-2 px-3">Rp {Number(a.harga).toLocaleString()}</td>
                <td className="py-2 px-3">{truncate(a.satuan, 10)}</td>
                <td className="py-2 px-3">{truncate(a.status, 10)}</td>
                <td className="py-2 px-3 max-w-xs">{truncate(a.keterangan, 30)}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button
                    className="admin-action-btn bg-blue-100 text-blue-700 hover:bg-blue-200"
                    title="Detail"
                    onClick={() => handleOpen('detail', a)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Detail
                  </button>
                  <button
                    className="admin-action-btn bg-green-100 text-green-700 hover:bg-green-200"
                    title="Edit"
                    onClick={() => handleOpen('edit', a)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 013.536 3.536L7.5 20.036H4v-3.5L16.732 3.732z" />
                    </svg>
                    Ubah
                  </button>
                  <button
                    className="admin-action-btn bg-red-100 text-red-700 hover:bg-red-200"
                    title="Hapus"
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          {/* Detail Modal (Portrait) */}
          {modalType === 'detail' ? (
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleClose}>✕</button>
              <h4 className="text-lg font-bold mb-4">Detail Alat Camping</h4>
              <img 
                src={form.gambar} 
                alt={form.nama_alat} 
                className="w-full h-32 object-cover rounded mb-4"
              />
              <div className="space-y-2 text-sm">
                <div><b>Nama Alat:</b> {form.nama_alat}</div>
                <div><b>Harga:</b> Rp {Number(form.harga).toLocaleString()}</div>
                <div><b>Satuan:</b> {form.satuan}</div>
                <div><b>Status:</b> {form.status}</div>
                <div><b>Keterangan:</b> {form.keterangan}</div>
              </div>
            </div>
          ) : (
            /* Add/Edit Modal (Landscape) */
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleClose}>✕</button>
              
              <form onSubmit={handleSubmit}>
                <h4 className="text-xl font-bold mb-6">{modalType === 'add' ? 'Tambah' : 'Update'} Alat Camping</h4>
                
                {/* Layout 2 Kolom */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Kolom Kiri - Upload Gambar */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-700">Upload Gambar</h5>
                    <AdminAlatCampingUpload onUpload={url => setForm((f: any) => ({ ...f, gambar: url }))} />
                  </div>
                  
                  {/* Kolom Kanan - Form Fields */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-700">Informasi Alat Camping</h5>
                    
                    {/* Row 1: Nama Alat & Harga */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        className="input-field w-full" 
                        placeholder="Nama Alat" 
                        name="nama_alat" 
                        value={form.nama_alat} 
                        onChange={e => setForm({ ...form, nama_alat: e.target.value })} 
                        required 
                      />
                      <input 
                        className="input-field w-full" 
                        placeholder="Harga" 
                        name="harga" 
                        type="number" 
                        value={form.harga} 
                        onChange={e => setForm({ ...form, harga: e.target.value })} 
                        required 
                      />
                    </div>
                    
                    {/* Row 2: Satuan & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        className="input-field w-full" 
                        placeholder="Satuan" 
                        name="satuan" 
                        value={form.satuan} 
                        onChange={e => setForm({ ...form, satuan: e.target.value })} 
                        required 
                      />
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
                    </div>
                    
                    {/* Row 3: Keterangan */}
                    <textarea 
                      className="input-field w-full" 
                      placeholder="Keterangan" 
                      name="keterangan" 
                      value={form.keterangan} 
                      onChange={e => setForm({ ...form, keterangan: e.target.value })} 
                      required 
                      rows={4}
                    />
                  </div>
                </div>
                
                {/* Button Simpan - Full Width di bawah */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:opacity-50"
                    disabled={loading || !form.gambar}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Menyimpan...
                      </div>
                    ) : (
                      'Simpan Alat Camping'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}