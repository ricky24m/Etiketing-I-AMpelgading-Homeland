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

    try {
      // Ambil path gambar sebelum hapus row
      const { data: alatData, error: fetchError } = await supabase
        .from('alat_camping')
        .select('gambar')
        .eq('id', id)
        .single();

      if (fetchError) {
        return res.status(500).json({ success: false, message: 'Gagal mengambil data alat camping' });
      }

      const gambarPath = alatData?.gambar;

      // Hapus dari database
      const { error: deleteError } = await supabase
        .from('alat_camping')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(500).json({ success: false, message: 'Gagal hapus alat camping dari database' });
      }

      // Hapus file gambar dari storage jika ada
      if (gambarPath) {
        let storagePath = gambarPath;

        // Jika path berupa URL, ambil path setelah '/storage/v1/object/public/'
        if (storagePath.startsWith('http')) {
          const idx = storagePath.indexOf('/storage/v1/object/public/');
          if (idx !== -1) {
            storagePath = storagePath.substring(idx + '/storage/v1/object/public/'.length);
          }
        }

        // Hapus prefix bucket name jika ada
        storagePath = storagePath.replace(/^gambar-camping\//, '');

        const { error: storageError } = await supabase.storage
          .from('gambar-camping')
          .remove([storagePath]);

        if (storageError) {
          console.error('Error deleting image from storage:', storageError);
          // Tidak return error, karena data sudah terhapus dari database
        }
      }

      return res.status(200).json({ success: true, message: 'Alat camping dan gambar berhasil dihapus' });
    } catch (error) {
      console.error('Delete alat camping error:', error);
      return res.status(500).json({ success: false, message: 'Gagal hapus alat camping' });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}