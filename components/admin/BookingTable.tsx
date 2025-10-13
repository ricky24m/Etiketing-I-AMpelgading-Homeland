import useSWR, { mutate } from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BookingTable() {
  const [page, setPage] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error } = useSWR(`/api/admin/bookings?page=${page}&limit=10`, fetcher);

  if (isLoading) return <div>Memuat data booking...</div>;
  if (error) return <div>Gagal memuat data booking</div>;

  const bookings = data?.data || [];
  const pagination = data?.pagination || {};

  // Fungsi format tanggal booking
  const formatTanggal = (tgl: string) => {
    if (!tgl) return '-';
    const d = new Date(tgl);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Fungsi potong pesanan
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  // Handle update status
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/update-booking-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.order_id,
          status: newStatus
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Status booking berhasil diupdate!');
        setShowStatusModal(false);
        setSelectedOrder(null);
        setNewStatus('');
        // Refresh data
        mutate(`/api/admin/bookings?page=${page}&limit=10`);
      } else {
        alert('Gagal update status: ' + result.message);
      }
    } catch (error) {
      console.error('Update status error:', error);
      alert('Terjadi kesalahan saat update status');
    } finally {
      setLoading(false);
    }
  };

  // Open status modal
  const openStatusModal = (booking: any) => {
    setSelectedOrder(booking);
    setNewStatus(booking.status);
    setShowStatusModal(true);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Daftar Booking</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Nama</th>
              <th className="py-2 px-3">Tanggal Booking</th>
              <th className="py-2 px-3">Tanggal Pesan</th>
              <th className="py-2 px-3 w-32">Email</th> {/* Perkecil kolom email */}
              <th className="py-2 px-3">Pesanan</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 w-20">Aksi</th> {/* Perkecil kolom aksi */}
              <th className="py-2 px-3">Kendaraan</th>
              <th className="py-2 px-3">Waktu Kedatangan</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any) => (
              <tr key={b.order_id} className="border-b">
                <td className="py-2 px-3">{b.order_id}</td>
                <td className="py-2 px-3">{b.nama}</td>
                <td className="py-2 px-3">{formatTanggal(b.tanggal_booking)}</td>
                <td className="py-2 px-3">{b.order_date_formatted || b.order_date}</td>
                <td className="py-2 px-3 max-w-32"> {/* Batasi lebar email */}
                  <div className="truncate" title={b.email}>
                    {truncate(b.email, 20)}
                  </div>
                </td>
                <td className="py-2 px-3 max-w-xs">
                  {truncate(b.items, 40)}
                </td>
                <td className="py-2 px-3">Rp {Number(b.total).toLocaleString()}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${b.status === 'Terverifikasi'
                    ? 'bg-green-100 text-green-800'
                    : b.status === 'Dibatalkan'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {b.status}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {/* Tata letak vertikal untuk tombol aksi */}
                  <div className="flex flex-col gap-1">
                    <button
                      className="admin-action-btn bg-blue-100 text-blue-700 hover:bg-blue-200 w-full justify-center text-xs"
                      title="Detail"
                      onClick={() => { setDetailData(b); setShowDetail(true); }}
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                      </svg>
                      Detail
                    </button>
                    <button
                      className="admin-action-btn bg-green-100 text-green-700 hover:bg-green-200 w-full justify-center text-xs"
                      title="Update Status"
                      onClick={() => openStatusModal(b)}
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                      </svg>
                      Status
                    </button>
                  </div>
                </td>
                <td className="py-2 px-3">{truncate(b.kendaraan || '-', 20)}</td>
                <td className="py-2 px-3">
                  {b.waktu_kedatangan ? `${b.waktu_kedatangan} WIB` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:bg-gray-300 text-sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >Prev</button>
        <span className="px-3 py-1">{pagination.current_page} / {pagination.total_pages}</span>
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:bg-gray-300 text-sm"
          disabled={page >= pagination.total_pages}
          onClick={() => setPage(page + 1)}
        >Next</button>
      </div>

      {/* Modal Detail */}
      {showDetail && detailData && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400" onClick={() => setShowDetail(false)}>✕</button>
            <h4 className="text-lg font-bold mb-2">Detail Booking</h4>
            <div className="mb-2"><b>Order ID:</b> {detailData.order_id}</div>
            <div className="mb-2"><b>Nama:</b> {detailData.nama}</div>
            <div className="mb-2"><b>Kota Asal:</b> {detailData.kota_asal}</div>
            <div className="mb-2"><b>Nomor Telepon:</b> {detailData.nomor_telepon}</div>
            <div className="mb-2"><b>Nomor Darurat:</b> {detailData.nomor_darurat}</div>
            <div className="mb-2"><b>Email:</b> {detailData.email}</div>
            <div className="mb-2"><b>Tanggal Booking:</b> {formatTanggal(detailData.tanggal_booking)}</div>
            <div className="mb-2"><b>Tanggal Pesan:</b> {detailData.order_date_formatted || detailData.order_date}</div>
            <div className="mb-2"><b>Pesanan:</b> {detailData.items}</div>
            <div className="mb-2"><b>Total:</b> Rp {Number(detailData.total).toLocaleString()}</div>
            <div className="mb-2"><b>Status:</b> {detailData.status}</div>
            <div className="mb-2"><b>Kendaraan:</b> {detailData.kendaraan || '-'}</div>
            <div className="mb-2">
              <b>Waktu Kedatangan:</b> {detailData.waktu_kedatangan ? `${detailData.waktu_kedatangan} WIB` : '-'}
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Status */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400" onClick={() => setShowStatusModal(false)}>✕</button>
            <h4 className="text-lg font-bold mb-4">Update Status Booking</h4>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Order ID: {selectedOrder.order_id}</p>
              <p className="text-sm text-gray-600 mb-2">Nama: {selectedOrder.nama}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Belum terverifikasi">Belum terverifikasi</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={loading || !newStatus}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Memperbarui...' : 'Update Status'}
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}