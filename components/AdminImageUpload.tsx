import { useState } from 'react';

export default function AdminImageUpload({ onUpload }: { onUpload?: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.success) {
      alert('Upload berhasil!');
      onUpload?.(data.url);
    } else {
      alert('Upload gagal: ' + data.message);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border" />
      )}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}