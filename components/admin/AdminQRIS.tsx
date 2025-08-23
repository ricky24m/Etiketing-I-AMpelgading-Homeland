import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function AdminQRISUpload({ onUpload }: { onUpload: (url: string) => void }) {
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

    const res = await fetch('/api/admin/upload-qris', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.success) {
      onUpload(data.url);
      setSuccess(true);
    } else {
      alert('Upload gagal: ' + data.message);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={success} />
      {preview && (
        <img src={preview} alt="Preview" className="w-64 h-64 object-contain rounded border bg-gray-50" />
      )}
      {!success && (
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
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

export default function AdminQRIS() {
  const { data } = useSWR('/api/admin/qris', fetcher);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState({ gambar: '' });
  const [loading, setLoading] = useState(false);

  const qris = data?.data;
  const hasQRIS = !!qris;

  const handleOpen = (type: 'add' | 'edit') => {
    setModalType(type);
    setShowModal(true);
    if (type === 'edit' && qris) {
      setForm({ gambar: qris.gambar });
    } else {
      setForm({ gambar: '' });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setForm({ gambar: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gambar) {
      alert('Gambar QRIS wajib di-upload!');
      return;
    }
    
    setLoading(true);
    
    const method = modalType === 'add' ? 'POST' : 'PUT';
    
    const response = await fetch('/api/admin/qris', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    setLoading(false);

    if (result.success) {
      alert(`QRIS berhasil ${modalType === 'add' ? 'ditambahkan' : 'diupdate'}!`);
      handleClose();
      mutate('/api/admin/qris');
    } else {
      alert(`Gagal ${modalType === 'add' ? 'menambahkan' : 'mengupdate'} QRIS: ` + result.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus QRIS ini? Gambar akan dihapus dari storage.')) return;
    
    const response = await fetch('/api/admin/qris', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    
    if (result.success) {
      alert('QRIS berhasil dihapus!');
      mutate('/api/admin/qris');
    } else {
      alert('Gagal menghapus QRIS: ' + result.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Kelola QRIS</h3>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded text-white font-medium ${
              hasQRIS 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={() => handleOpen('add')}
            disabled={hasQRIS}
          >
            Tambah QRIS
          </button>
          {hasQRIS && (
            <>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                onClick={() => handleOpen('edit')}
              >
                Edit QRIS
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
                onClick={handleDelete}
              >
                Hapus QRIS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Display Current QRIS */}
      {hasQRIS ? (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h4 className="text-lg font-semibold mb-4">QRIS Aktif</h4>
          <div className="flex justify-center">
            <img 
              src={qris.gambar} 
              alt="QRIS Code" 
              className="w-64 h-64 object-contain border rounded-lg bg-gray-50"
            />
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Ditambahkan: {new Date(qris.created_at).toLocaleDateString('id-ID')}
          </p>
          {qris.updated_at && (
            <p className="text-gray-600 text-sm">
              Diupdate: {new Date(qris.updated_at).toLocaleDateString('id-ID')}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📱</div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada QRIS</h4>
          <p className="text-gray-500 mb-4">
            Tambahkan QRIS untuk mempermudah pembayaran pelanggan
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
            onClick={() => handleOpen('add')}
          >
            Tambah QRIS Sekarang
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
              onClick={handleClose}
            >
              ✕
            </button>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-lg font-bold">
                {modalType === 'add' ? 'Tambah' : 'Edit'} QRIS
              </h4>
              
              <AdminQRISUpload 
                onUpload={url => setForm({ gambar: url })} 
              />
              
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-medium disabled:opacity-50"
                disabled={loading || !form.gambar}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}