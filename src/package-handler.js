document.addEventListener('DOMContentLoaded', function () {
    // Konfigurasi untuk setiap halaman/paket
    const packageConfig = {
        'wisata-alam.html': {
            name: 'Paket Wisata Alam',
            price: 10000,
            tableSelector: '#wisata-table'
        },
        'short-jeep.html': {
            name: 'Short Trip Jeep',
            price: 150000,
            tableSelector: '#jeep-table'
        },
        'long-jeep.html': {
            name: 'Long Trip Jeep',
            price: 250000,
            tableSelector: '#jeep-table'
        },
        'sunrise-short-jeep.html': {
            name: 'Sunrise Short Trip Jeep',
            price: 175000,
            tableSelector: '#jeep-table'
        },
        'sunrise-long-jeep.html': {
            name: 'Sunrise Long Trip Jeep',
            price: 300000,
            tableSelector: '#jeep-table'
        },
    };

    // Dapatkan nama file halaman saat ini
    const currentPage = window.location.pathname.split('/').pop();
    const config = packageConfig[currentPage];

    // Jika halaman tidak ada dalam konfigurasi, keluar dari fungsi
    if (!config) return;

    // Quantity logic - universal untuk semua paket
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');
    const qtyDisplay = document.getElementById('qty-display');
    const simpanBtn = document.getElementById('simpan-btn');

    // Cek apakah elemen-elemen tersedia
    if (!minusBtn || !plusBtn || !qtyDisplay || !simpanBtn) return;

    let qty = 0;
    qtyDisplay.textContent = qty;

    minusBtn.addEventListener('click', () => {
        if (qty > 0) qty--;
        qtyDisplay.textContent = qty;
    });

    plusBtn.addEventListener('click', () => {
        qty++;
        qtyDisplay.textContent = qty;
    });

    // Simpan ke cart menggunakan fungsi global dari cart.js
    simpanBtn.addEventListener('click', () => {
        if (qty > 0 && window.addToCart) {
            window.addToCart({
                name: config.name,
                price: config.price,
                qty: qty
            });
            
            // SweetAlert2 Success Modal
            Swal.fire({
                icon: 'success',
                title: 'Berhasil Disimpan!',
                text: `${config.name} (${qty}x) berhasil ditambahkan ke keranjang.`,
                confirmButtonText: 'Tutup',
                confirmButtonColor: '#16A34A'
            });
            
            // Reset quantity setelah disimpan
            qty = 0;
            qtyDisplay.textContent = qty;
        } else {
            // SweetAlert2 Warning Modal
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian!',
                text: 'Pilih minimal 1 paket untuk disimpan ke keranjang!',
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#D97706'
            });
        }
    });

    // Table row hover effect - universal untuk semua tabel
    const rows = document.querySelectorAll(`${config.tableSelector} tbody tr`);
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = '#e0f7e9';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = '';
        });
    });
});