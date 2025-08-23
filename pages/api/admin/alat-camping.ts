import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('alat_camping')
      .select('id, gambar, nama_alat, harga, satuan, keterangan, status')
      .order('id', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const { gambar, nama_alat, harga, satuan, keterangan, status } = req.body;
    if (!gambar || !nama_alat || !harga || !satuan || !keterangan || !status) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }
    const { error } = await supabase
      .from('alat_camping')
      .insert([{ gambar, nama_alat, harga, satuan, keterangan, status }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PUT') {
    const { id, gambar, nama_alat, harga, satuan, keterangan, status } = req.body;
    if (!id || !gambar || !nama_alat || !harga || !satuan || !keterangan || !status) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }
    const { error } = await supabase
      .from('alat_camping')
      .update({ gambar, nama_alat, harga, satuan, keterangan, status })
      .eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'ID tidak ditemukan' });
    const { error } = await supabase
      .from('alat_camping')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}