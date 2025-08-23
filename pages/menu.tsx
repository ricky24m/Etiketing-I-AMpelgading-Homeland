import AdminAddMenu from '../components/AdminAddMenu';

export default function AdminMenuPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-2xl font-bold text-center mb-8">Tambah Menu Baru</h1>
      <AdminAddMenu />
    </div>
  );
}