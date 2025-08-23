import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Tambahkan opsi auth agar tidak error di serverless/Node.js
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});