import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Ambil semua galeri (maksimal 6)
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('id', { ascending: false })
      .limit(6);

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const { gambar, judul, deskripsi } = req.body;
    // Cek jumlah galeri
    const { count } = await supabase
      .from('galeri')
      .select('id', { count: 'exact', head: true });
    if ((count || 0) >= 6) {
      return res.status(400).json({ success: false, message: 'Maksimal 6 galeri' });
    }
    const { error } = await supabase
      .from('galeri')
      .insert([{ gambar, judul, deskripsi }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PUT') {
    const { id, gambar, judul, deskripsi } = req.body;
    // Ambil gambar lama
    const { data: oldData } = await supabase
      .from('galeri')
      .select('gambar')
      .eq('id', id)
      .single();
    const gambarLama = oldData?.gambar;
    const { error } = await supabase
      .from('galeri')
      .update({ gambar, judul, deskripsi })
      .eq('id', id);
    // Jika gambar diganti, hapus gambar lama di Supabase Storage
    if (gambarLama && gambarLama !== gambar) {
      let storagePath = gambarLama;
      if (storagePath.startsWith('http')) {
        const idx = storagePath.indexOf('/storage/v1/object/public/');
        if (idx !== -1) {
          storagePath = storagePath.substring(idx + '/storage/v1/object/public/'.length);
        }
      }
      await supabase.storage.from('gambar-galeri').remove([storagePath.replace(/^gambar-galeri\//, '')]);
    }
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    // Ambil path gambar sebelum hapus row
    const { data: oldData } = await supabase
      .from('galeri')
      .select('gambar')
      .eq('id', id)
      .single();
    const gambarPath = oldData?.gambar;
    const { error } = await supabase
      .from('galeri')
      .delete()
      .eq('id', id);
    // Hapus file di Supabase jika ada
    if (gambarPath) {
      let storagePath = gambarPath;
      if (storagePath.startsWith('http')) {
        const idx = storagePath.indexOf('/storage/v1/object/public/');
        if (idx !== -1) {
          storagePath = storagePath.substring(idx + '/storage/v1/object/public/'.length);
        }
      }
      await supabase.storage.from('gambar-galeri').remove([storagePath.replace(/^gambar-galeri\//, '')]);
    }
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}