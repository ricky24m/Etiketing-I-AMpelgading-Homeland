import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FinanceReport() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [page, setPage] = useState(1);

  const params = [];
  if (start) params.push(`start=${start}`);
  if (end) params.push(`end=${end}`);
  params.push(`page=${page}&limit=10`);
  const query = params.length ? '?' + params.join('&') : '';

  const { data, isLoading, error } = useSWR(`/api/admin/revenue${query}`, fetcher);

  if (isLoading) return <div>Memuat data keuangan...</div>;
  if (error) return <div>Gagal memuat data keuangan</div>;

  const bookings = data?.data || [];
  const summary = data?.summary || {};
  const pagination = data?.pagination || {};

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Laporan Keuangan</h3>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Tanggal Awal</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal Akhir</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="input-field" />
        </div>
      </div>
      <div className="bg-green-50 rounded p-4 mb-4 flex flex-wrap gap-8">
        <div><b>Total Penghasilan:</b> Rp {Number(summary.total_income || 0).toLocaleString()}</div>
        <div><b>Total Transaksi:</b> {summary.total_transactions || 0}</div>
        <div><b>Rata-rata Transaksi:</b> Rp {Number(summary.avg_transaction || 0).toLocaleString()}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Tanggal</th>
              <th className="py-2 px-3">Nama</th>
              <th className="py-2 px-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any) => (
              <tr key={b.order_id} className="border-b">
                <td className="py-2 px-3">{b.order_id}</td>
                <td className="py-2 px-3">{b.order_date_formatted || b.order_date}</td>
                <td className="py-2 px-3">{b.nama}</td>
                <td className="py-2 px-3">Rp {Number(b.total).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:bg-gray-300"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >Prev</button>
        <span className="px-3 py-1">{pagination.current_page} / {pagination.total_pages}</span>
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:bg-gray-300"
          disabled={page >= pagination.total_pages}
          onClick={() => setPage(page + 1)}
        >Next</button>
      </div>
    </div>
  );
}