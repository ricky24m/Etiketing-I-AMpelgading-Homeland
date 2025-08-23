import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('katalog_menu_fix')
    .select('id, nama_menu, harga, kategori, satuan, status, keterangan, gambar')
    .eq('status', 'aktif')
    .order('nama_menu', { ascending: true });

  if (error) return res.status(500).json({ success: false, message: error.message });

  const processedMenus = (data || []).map(menu => ({
    ...menu,
    gambar_url: menu.gambar
      ? menu.gambar.startsWith('http')
        ? menu.gambar
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${menu.gambar}`
      : '/images/placeholder.svg'
  }));

  res.status(200).json({
    success: true,
    data: processedMenus,
    count: processedMenus.length
  });
}