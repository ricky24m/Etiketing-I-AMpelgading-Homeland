import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password harus diisi' 
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, nama_lengkap, kota_asal, nomor_telepon, email, password, is_active')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email tidak terdaftar' 
      });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Akun tidak aktif' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password salah' 
      });
    }

    // Remove password from response
    delete user.password;

    res.status(200).json({
      success: true,
      user: user,
      message: 'Login berhasil'
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}