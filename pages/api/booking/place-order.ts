import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { nama, email, nik, phone, emergency, tanggal, items, total } = req.body;

    // Validasi
    if (!nama || !email || !items || total <= 0) {
      return res.status(400).json({ success: false, message: 'Data tidak valid' });
    }

    // Generate order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 9000) + 1000}`;
    const bookingDate = new Date(tanggal).toISOString().split('T')[0];

    // Simpan ke database dengan status "Belum terverifikasi"
    const { error } = await supabase.from('booking').insert([{
      order_id: orderId,
      nama,
      nik,
      nomor_telepon: phone,
      nomor_darurat: emergency,
      email,
      tanggal_booking: bookingDate,
      items,
      total,
      status: 'Belum terverifikasi', // Status default
      waktu_booking: new Date().toISOString()
    }]);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({
      success: true,
      order_id: orderId,
      message: 'Booking berhasil disimpan'
    });

  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}