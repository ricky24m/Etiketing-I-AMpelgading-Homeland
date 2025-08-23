import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Get paginated data
    const { data: rows, error } = await supabase
      .from('booking')
      .select('order_id, nama, tanggal_booking, order_date, email, items, total, status')
      .order('order_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return res.status(500).json({ success: false, message: error.message });

    // Format tanggal pesan (order_date) dengan jam
    const data = (rows as any[]).map(row => ({
      ...row,
      order_date_formatted: row.order_date
        ? new Date(row.order_date).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : row.order_date,
    }));

    res.status(200).json({
      success: true,
      data,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: totalRecords,
        per_page: limit,
      }
    });
  } catch (error) {
    console.error('Bookings API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}