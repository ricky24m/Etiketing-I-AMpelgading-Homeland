import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { nama, email, kota_asal, phone, emergency, kendaraan, tanggal, items, total } = req.body;

    // Validasi
    if (!nama || !email || !items || total <= 0) {
      return res.status(400).json({ success: false, message: 'Data tidak valid' });
    }

    if (!kendaraan) {
      return res.status(400).json({ success: false, message: 'Jumlah dan jenis kendaraan wajib diisi' });
    }

    // Generate order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 9000) + 1000}`;
    const bookingDate = new Date(tanggal).toISOString().split('T')[0];

    // Simpan ke database dengan status "Belum terverifikasi"
    const { error } = await supabase.from('booking').insert([{
      order_id: orderId,
      nama,
      kota_asal,
      nomor_telepon: phone,
      nomor_darurat: emergency,
      kendaraan,  // Tambah field kendaraan
      email,
      tanggal_booking: bookingDate,
      waktu_booking: new Date().toISOString(),
      items,
      total,
      status: 'Belum terverifikasi'
    }]);

    if (error) throw error;

    res.status(200).json({ success: true, order_id: orderId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}