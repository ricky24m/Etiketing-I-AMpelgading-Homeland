import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password, kota_asal } = req.body;
    if (!email || !password || !kota_asal) {
      return res.status(400).json({ success: false, message: 'Semua field harus diisi' });
    }

    // Cek apakah kombinasi email dan kota_asal ada di baris yang sama
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .eq('kota_asal', kota_asal)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email atau kota asal tidak terdaftar' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email)
      .eq('kota_asal', kota_asal);

    if (updateError) throw updateError;

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}