import { supabase } from '../../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
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
      try {
        const fileBuffer = Buffer.concat(uploadFile);
        const filePath = `galeri/${Date.now()}_${fileName}`;

        const { data, error } = await supabase.storage
          .from('gambar-galeri')
          .upload(filePath, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (error) {
          return res.status(500).json({ success: false, message: error.message });
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gambar-galeri/${filePath}`;
        return res.status(200).json({ success: true, url: publicUrl, path: `gambar-galeri/${filePath}` });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message || 'Upload error' });
      }
    });

    req.pipe(bb);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}