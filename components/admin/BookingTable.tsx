import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BookingTable() {
  const [page, setPage] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

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
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Pesanan</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any) => (
              <tr key={b.order_id} className="border-b">
                <td className="py-2 px-3">{b.order_id}</td>
                <td className="py-2 px-3">{b.nama}</td>
                <td className="py-2 px-3">{formatTanggal(b.tanggal_booking)}</td>
                <td className="py-2 px-3">{b.order_date_formatted || b.order_date}</td>
                <td className="py-2 px-3">{b.email}</td>
                <td className="py-2 px-3 max-w-xs">
                  {truncate(b.items, 40)}
                </td>
                <td className="py-2 px-3">Rp {Number(b.total).toLocaleString()}</td>
                <td className="py-2 px-3">{b.status}</td>
                <td className="py-2 px-3">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => { setDetailData(b); setShowDetail(true); }}
                  >
                    Detail
                  </button>
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
            <div className="mb-2"><b>Tanggal Booking:</b> {formatTanggal(detailData.tanggal_booking)}</div>
            <div className="mb-2"><b>Tanggal Pesan:</b> {detailData.order_date_formatted || detailData.order_date}</div>
            <div className="mb-2"><b>Email:</b> {detailData.email}</div>
            <div className="mb-2"><b>Pesanan:</b> {detailData.items}</div>
            <div className="mb-2"><b>Total:</b> Rp {Number(detailData.total).toLocaleString()}</div>
            <div className="mb-2"><b>Status:</b> {detailData.status}</div>
          </div>
        </div>
      )}
    </div>
  );
}