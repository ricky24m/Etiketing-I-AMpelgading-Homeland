import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // API untuk user - hanya tampilkan alat camping yang statusnya 'aktif'
  const { data, error } = await supabase
    .from('alat_camping')
    .select('id, gambar, nama_alat, harga, satuan, keterangan, status')
    .eq('status', 'aktif') // Filter hanya status aktif
    .order('id', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(200).json({ 
    success: true, 
    data: data || [],
    count: data?.length || 0
  });
}