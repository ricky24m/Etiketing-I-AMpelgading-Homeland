import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { nama_menu, harga, kategori, satuan, status, keterangan, gambar } = req.body;

  // Validasi semua field wajib
  if (
    !nama_menu ||
    !harga ||
    !kategori ||
    !satuan ||
    !status ||
    !keterangan ||
    !gambar
  ) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
  }

  const { error } = await supabase
    .from('katalog_menu_fix')
    .insert([{ nama_menu, harga, kategori, satuan, status, keterangan, gambar }]);

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  res.status(200).json({ success: true });
}