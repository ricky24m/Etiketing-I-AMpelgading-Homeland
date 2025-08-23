import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('katalog_menu_fix')
    .select('id, nama_menu, harga, kategori, satuan, status, keterangan, gambar')
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.status(200).json({
    success: true,
    data,
    count: data?.length || 0
  });
}