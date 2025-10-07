import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const { count: totalRecords } = await supabase
      .from('booking')
      .select('id', { count: 'exact', head: true });
    const totalPages = Math.ceil((totalRecords ?? 0) / limit);

    // Get paginated data dengan semua field yang dibutuhkan - Include kendaraan
    const { data: rows, error } = await supabase
      .from('booking')
      .select('order_id, nama, kota_asal, nomor_telepon, nomor_darurat, kendaraan, email, tanggal_booking, waktu_booking, items, total, status')
      .order('waktu_booking', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Format tanggal untuk tampilan
    const bookings = (rows || []).map((row: any) => ({
      ...row,
      order_date: row.waktu_booking,
      order_date_formatted: row.waktu_booking
        ? new Date(row.waktu_booking).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : row.waktu_booking,
    }));

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: totalRecords,
        per_page: limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}