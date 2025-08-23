import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { order_id, status } = req.body;

    if (!order_id || !status) {
      return res.status(400).json({ success: false, message: 'Order ID dan status wajib diisi' });
    }

    // Update status booking
    const { error } = await supabase
      .from('booking')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', order_id);

    if (error) {
      console.error('Update order status error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Status pesanan berhasil diupdate' 
    });

  } catch (error: any) {
    console.error('Update order status catch error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}