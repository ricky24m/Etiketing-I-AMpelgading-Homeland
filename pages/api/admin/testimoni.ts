import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Ambil semua testimoni (maksimal 10)
    const { data, error } = await supabase
      .from('testimoni')
      .select('*')
      .order('id', { ascending: false })
      .limit(10);

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const { nama, bintang, komen } = req.body;
    // Cek jumlah testimoni
    const { count } = await supabase
      .from('testimoni')
      .select('id', { count: 'exact', head: true });
    if ((count || 0) >= 10) {
      return res.status(400).json({ success: false, message: 'Maksimal 10 testimoni' });
    }
    const { error } = await supabase
      .from('testimoni')
      .insert([{ nama, bintang, komen }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PUT') {
    const { id, nama, bintang, komen } = req.body;
    const { error } = await supabase
      .from('testimoni')
      .update({ nama, bintang, komen })
      .eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const { error } = await supabase
      .from('testimoni')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}