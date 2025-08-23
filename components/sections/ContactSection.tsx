import React, { useState } from 'react';

export default function ContactSection() {
  const [form, setForm] = useState({ nama: '', email: '', phone: '', pesan: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Pesan berhasil dikirim!');
      setForm({ nama: '', email: '', phone: '', pesan: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="min-h-screen flex items-center py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-center mb-2">
          <span className="text-green-600">Hubungi</span> Kami
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Dapatkan informasi lebih lanjut tentang paket wisata dan booking tiket online kami
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <div className="md:w-1/2 w-full rounded-xl overflow-hidden shadow flex">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1fWstsFGZokZz8JR0YQR6tmC2ia5Giys&ehbc=2E312F"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[420px] md:h-[500px]"
            ></iframe>
          </div>
          <form
            className="md:w-1/2 w-full bg-white rounded-xl shadow p-8 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-semibold mb-2">Kirim Pesan</h3>
            <div>
              <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                required
                value={form.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="No. Handphone"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <textarea
                name="pesan"
                placeholder="Pesan Anda..."
                rows={4}
                required
                value={form.pesan}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>{loading ? 'Mengirim...' : 'Kirim Pesan'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}