import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Panduan() {
  return (
    <>
      <Head>
        <title>Panduan Booking Online - I&apos;AMpel GADING</title>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/galeri.css" />
      </Head>
      
      <Navbar variant="booking" />
      
      <main style={{
        maxWidth: 700, 
        margin: '40px auto 60px auto', 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)', 
        padding: '36px 28px'
      }}>
        <h1 style={{ 
          color: '#16A34A', 
          textAlign: 'center', 
          marginBottom: 32 
        }}>
          Panduan Booking Online
        </h1>
        
        <ol style={{ 
          fontSize: '1.1rem', 
          color: '#222', 
          lineHeight: 1.7 
        }}>
          <li style={{ marginBottom: 24 }}>
            <strong>Registrasi &amp; Login</strong>
            <ul style={{ marginTop: 10, marginBottom: 0 }}>
              <li>Buka halaman utama, klik tombol <b>Daftar</b> di pojok kanan atas.</li>
              <li>Isi data diri Anda dengan lengkap (Nama, Kota Asal, Nomor Telepon, Email, Password).</li>
              <li>Setelah berhasil registrasi, lakukan <b>Login</b> menggunakan email dan password yang telah didaftarkan.</li>
            </ul>
          </li>
          
          <li>
            <strong>Booking Online</strong>
            <ul style={{ marginTop: 10 }}>
              <li>Pilih menu <b>Booking</b> pada navigasi atau klik tombol <b>Booking Sekarang</b> di halaman utama.</li>
              <li>Pilih paket wisata atau alat camping yang ingin dipesan, lalu klik <b>Selengkapnya</b>.</li>
              <li>Atur jumlah peserta atau alat, lalu klik <b>Simpan</b> untuk memasukkan ke keranjang.</li>
              <li>Setelah semua pesanan masuk ke keranjang, klik ikon <b>Keranjang</b> dan lanjutkan ke <b>Checkout</b>.</li>
              <li>Pilih tanggal booking, isi data yang diperlukan, lalu klik <b>Lanjut ke Pembayaran</b>.</li>
              <li>Lakukan pembayaran sesuai instruksi. E-ticket akan dikirim ke email Anda setelah pembayaran berhasil.</li>
            </ul>
          </li>
        </ol>
      </main>
    </>
  );
}