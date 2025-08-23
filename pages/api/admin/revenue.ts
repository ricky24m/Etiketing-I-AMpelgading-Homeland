import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const start = req.query.start as string;
    const end = req.query.end as string;

    const offset = (page - 1) * limit;

    // Build filter
    let query = supabase
      .from('booking')
      .select('order_id, waktu_booking, nama, items, total', { count: 'exact' })
      .eq('status', 'berhasil');

    if (start) query = query.gte('waktu_booking', start);
    if (end) query = query.lte('waktu_booking', end);

    query = query.order('waktu_booking', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Summary
    let summaryQuery = supabase
      .from('booking')
      .select('total', { count: 'exact' })
      .eq('status', 'berhasil');
    if (start) summaryQuery = summaryQuery.gte('waktu_booking', start);
    if (end) summaryQuery = summaryQuery.lte('waktu_booking', end);

    const { data: summaryData, error: summaryError } = await summaryQuery;

    if (summaryError) throw summaryError;

    const total_income = summaryData?.reduce((sum, row) => sum + (row.total || 0), 0) || 0;
    const total_transactions = summaryData?.length || 0;
    const avg_transaction = total_transactions > 0 ? Math.round(total_income / total_transactions) : 0;

    // Format tanggal
    const rows = (data || []).map((row: any) => ({
      ...row,
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
      data: rows,
      summary: {
        total_income,
        total_transactions,
        avg_transaction,
      },
      pagination: {
        current_page: page,
        total_pages: Math.ceil((count || 0) / limit),
        total_records: count || 0,
        per_page: limit,
      }
    });
  } catch (error) {
    console.error('Finance API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}