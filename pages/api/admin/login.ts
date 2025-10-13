import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username dan password harus diisi' 
      });
    }

    // Query ke tabel admin_users
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, username, nama_lengkap, email, password')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username tidak terdaftar' 
      });
    }

    // Cek password SIMPLE - langsung bandingkan plain text
    if (password !== admin.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password salah' 
      });
    }

    // Hapus password dari response
    delete admin.password;

    res.status(200).json({
      success: true,
      admin: admin,
      message: 'Login berhasil'
    });

  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}