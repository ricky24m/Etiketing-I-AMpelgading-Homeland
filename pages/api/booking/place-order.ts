import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nama, email, nik, phone, emergency, tanggal, items, total } = req.body;

    // Validasi
    if (!nama || !email || !items || total <= 0) {
      return res.status(400).json({ error: 'Data tidak valid' });
    }

    // Generate order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 9000) + 1000}`;
    const bookingDate = new Date(tanggal).toISOString().split('T')[0];

    // Simpan ke database (status = 'berhasil' langsung karena tidak ada payment gateway)
    await supabase.from('booking').insert([{
      order_id: orderId,
      nama,
      nik,
      nomor_telepon: phone,
      nomor_darurat: emergency,
      email,
      tanggal_booking: bookingDate,
      items,
      total,
      status: 'berhasil'
    }]);

    res.status(200).json({
      success: true,
      order_id: orderId,
      message: 'Booking berhasil disimpan'
    });

  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}