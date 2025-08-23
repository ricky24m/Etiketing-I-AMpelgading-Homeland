import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('qris')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, data: data || null });
  }

  if (req.method === 'POST') {
    const { gambar } = req.body;

    if (!gambar) {
      return res.status(400).json({ success: false, message: 'Gambar QRIS wajib diisi' });
    }

    // Cek apakah sudah ada QRIS
    const { data: existing } = await supabase
      .from('qris')
      .select('*')
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: 'QRIS sudah ada. Hapus yang lama terlebih dahulu.' });
    }

    const { error } = await supabase
      .from('qris')
      .insert([{ gambar, created_at: new Date().toISOString() }]);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === 'PUT') {
    const { gambar } = req.body;

    if (!gambar) {
      return res.status(400).json({ success: false, message: 'Gambar QRIS wajib diisi' });
    }

    // Ambil gambar lama
    const { data: oldData } = await supabase
      .from('qris')
      .select('gambar')
      .single();

    const gambarLama = oldData?.gambar;

    // Update QRIS
    const { error } = await supabase
      .from('qris')
      .update({ gambar, updated_at: new Date().toISOString() });

    // Hapus gambar lama dari storage jika berbeda
    if (gambarLama && gambarLama !== gambar) {
      let storagePath = gambarLama;
      if (storagePath.startsWith('http')) {
        const idx = storagePath.indexOf('/storage/v1/object/public/');
        if (idx !== -1) {
          storagePath = storagePath.substring(idx + '/storage/v1/object/public/'.length);
        }
      }
      await supabase.storage.from('gambar-qris').remove([storagePath.replace(/^gambar-qris\//, '')]);
    }

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    // Ambil path gambar sebelum hapus
    const { data: qrisData } = await supabase
      .from('qris')
      .select('gambar')
      .single();

    const gambarPath = qrisData?.gambar;

    // Hapus dari database
    const { error } = await supabase
      .from('qris')
      .delete()
      .eq('id', 1); // Assuming single row

    // Hapus file dari storage
    if (gambarPath) {
      let storagePath = gambarPath;
      if (storagePath.startsWith('http')) {
        const idx = storagePath.indexOf('/storage/v1/object/public/');
        if (idx !== -1) {
          storagePath = storagePath.substring(idx + '/storage/v1/object/public/'.length);
        }
      }
      await supabase.storage.from('gambar-qris').remove([storagePath.replace(/^gambar-qris\//, '')]);
    }

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}