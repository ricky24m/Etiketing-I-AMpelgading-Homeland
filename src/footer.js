document.addEventListener('DOMContentLoaded', function() {
    // Deteksi path untuk gambar jika di subfolder
    const currentPath = window.location.pathname;
    const isSubfolder = currentPath.includes('/jeep/') || currentPath.includes('/admin/');
    const pathPrefix = isSubfolder ? '../' : '';

    const footerHTML = `
    <footer class="custom-footer-v2">
      <div class="footer-bg"></div>
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-title">I'AMpel GADING Homeland</div>
          <div class="footer-desc">
            Destinasi wisata alam terbaik di ketinggian 1350 mdpl yang menawarkan pengalaman camping, jeep adventure, dan outbound tak terlupakan. Nikmati keindahan alam pegunungan dengan fasilitas lengkap dan pelayanan terbaik untuk liburan yang berkesan.
          </div>
        </div>
        <div class="footer-columns">
          <div class="footer-col">
            <div class="footer-col-title">Informasi</div>
            <div class="footer-col-underline"></div>
            <a href="${pathPrefix}index.html" class="footer-link">Beranda</a>
            <a href="${pathPrefix}index.html#galeri" class="footer-link">Galeri</a>
            <a href="${pathPrefix}index.html#testimonials" class="footer-link">Testimoni</a>
            <a href="${pathPrefix}index.html#contact" class="footer-link">Hubungi Kami</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Fitur</div>
            <div class="footer-col-underline"></div>
            <a href="${pathPrefix}katalog.html" class="footer-link">Booking Online</a>
            <a href="${pathPrefix}Panduan.html" class="footer-link">Panduan Booking</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Kontak</div>
            <div class="footer-col-underline"></div>
            <div class="footer-link">Desa Gading, Kec. Bringin<br>Kabupaten Semarang, Jawa Tengah</div>
            <a href="#" class="footer-link">Tiktok</a>
            <a href="https://wa.me/6281234567890" class="footer-link" target="_blank">Whatsapp</a>
            <a href="https://instagram.com/iampelgading" class="footer-link" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom-v2">
        <div>C 2025 I'AMpel GADING Homeland. All rights reserved</div>
        <div>Created by GIAT 12 KKNPMM UNNES</div>
      </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Tambahkan background image dan gradient via JS agar path dinamis
    const footerBg = document.querySelector('.footer-bg');
    if (footerBg) {
        footerBg.style.background = `url('${pathPrefix}images/footer.jpg') center/cover no-repeat`;
        footerBg.style.position = 'absolute';
        footerBg.style.inset = '0';
        footerBg.style.width = '100%';
        footerBg.style.height = '100%';
        footerBg.style.zIndex = '0';
    }
    // Gradient overlay via pseudo-element sudah di CSS

    // Feather icons (jika ada di footer)
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});