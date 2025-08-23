import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('katalog_menu_fix')
      .select('id, nama_menu, harga, satuan, kategori, status, keterangan, gambar')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
    }

    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'PUT') {
    const { nama_menu, harga, kategori, satuan, status, keterangan, gambar } = req.body;
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
    try {
      // Ambil gambar lama
      const { data: oldData, error: fetchError } = await supabase
        .from('katalog_menu_fix')
        .select('gambar')
        .eq('id', id)
        .single();

      if (fetchError) {
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      const gambarLama = oldData?.gambar;

      // Jika gambar diganti, hapus gambar lama di Supabase
      if (gambarLama && gambarLama !== gambar) {
        let storagePath = gambarLama;
        // Jika path berupa URL, ambil path setelah '/storage/v1/object/public/'
        if (storagePath.startsWith('http')) {
          const idx = storagePath.indexOf('/storage/v1/object/public/');
          if (idx !== -1) {
            storagePath = storagePath.substring(idx + '/storage/v1/object/public/'.length);
          }
        }
        // Hapus file di bucket gambar-menu
        await supabase.storage.from('gambar-menu').remove([storagePath.replace(/^gambar-menu\//, '')]);
      }

      // Update data menu
      const { error: updateError } = await supabase
        .from('katalog_menu_fix')
        .update({ nama_menu, harga, kategori, satuan, status, keterangan, gambar })
        .eq('id', id);

      if (updateError) {
        return res.status(500).json({ success: false, message: 'Gagal update menu' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Gagal update menu' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error: deleteError } = await supabase
        .from('katalog_menu_fix')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(500).json({ success: false, message: 'Gagal hapus menu' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Gagal hapus menu' });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}