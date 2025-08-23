import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let uploadFile: Buffer[] = [];
  let fileName = '';
  let mimeType = '';

  bb.on('file', (name: string, file: any, info: any) => {
    fileName = info.filename;
    mimeType = info.mimeType;
    file.on('data', (data: Buffer) => {
      uploadFile.push(data);
    });
  });

  bb.on('finish', async () => {
    const fileBuffer = Buffer.concat(uploadFile);
    const filePath = `qris/${Date.now()}_${fileName}`;

    const { error } = await supabase.storage
      .from('gambar-qris')
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gambar-qris/${filePath}`;
    return res.status(200).json({ success: true, url: publicUrl, path: `gambar-qris/${filePath}` });
  });

  req.pipe(bb);
}