import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    console.log('Admin login attempt:', { username, password }); // Debug log

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username dan password harus diisi' 
      });
    }

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, username, password, nama_lengkap, email')
      .eq('username', username)
      .maybeSingle();

    console.log('Database result:', { admin, error }); // Debug log

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username tidak ditemukan' 
      });
    }

    // Compare password plain text
    const isPasswordValid = admin.password === password;
    console.log('Password comparison:', { 
      inputPassword: password, 
      dbPassword: admin.password, 
      isValid: isPasswordValid 
    }); // Debug log

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password salah' 
      });
    }

    // Update last_login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Remove password from response
    delete admin.password;

    console.log('Admin login successful for:', admin.username); // Debug log

    res.status(200).json({
      success: true,
      admin: admin,
      message: 'Login berhasil'
    });

  } catch (error: any) {
    console.error('Admin login API error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}