import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { nama, nik, phone, email, password } = req.body;

    // Validasi input
    if (!nama || !nik || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    if (!/^\d{16}$/.test(nik)) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus 16 digit angka'
      });
    }

    if (!/^08\d{8,11}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Format nomor telepon tidak valid'
      });
    }

    // Cek email sudah ada
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password dan simpan
    const hashedPassword = await bcrypt.hash(password, 12);
    const { error } = await supabase.from('users').insert([{
      nama_lengkap: nama,
      nik,
      nomor_telepon: phone,
      email,
      password: hashedPassword,
      is_active: true
    }]);

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil'
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}