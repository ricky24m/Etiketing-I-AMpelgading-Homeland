document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    fetch(`php/api/get-detail-menu.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderDetailMenu(data.data);
            } else {
                document.getElementById('detail-container').innerHTML = '<p>Menu tidak ditemukan.</p>';
            }
        });
});

function renderDetailMenu(menu) {
    document.getElementById('detail-container').innerHTML = `
        <div class="wisata-hero">
            <img src="${menu.gambar_url}" alt="${menu.nama_menu}" class="wisata-hero-img">
            <div class="wisata-hero-overlay">
                <div class="header-center">
                    <h1>${menu.nama_menu}</h1>
                    <nav class="breadcrumb">
                        <a href="index.html">Beranda</a>
                        <span>&gt;</span>
                        <a href="katalog.html">Booking</a>
                        <span>&gt;</span>
                        <span>${menu.nama_menu}</span>
                    </nav>
                </div>
            </div>
        </div>
        <main>
            <div style="display: flex; align-items: flex-start; justify-content: left; gap: 24px; margin-top: 32px;">
                <table id="wisata-table">
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            <th>Harga Tiket</th>
                            <th>Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${menu.waktu || '-'}</td>
                            <td>Rp ${Number(menu.harga).toLocaleString()}</td>
                            <td>${menu.satuan || '-'}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <p>Jumlah Peserta</p>
                    <div class="quantity-control">
                        <button id="minus-btn" class="btn-qty">-</button>
                        <span id="qty-display" class="qty-display">0</span>
                        <button id="plus-btn" class="btn-qty">+</button>
                    </div>
                    <button id="simpan-btn" class="btn-qty" style="margin-top:12px;width:100px;">Simpan</button>
                </div>
            </div>
            <div class="keterangan">
                <h1 style="font-size: 17px;">${menu.nama_menu}</h1>
                <p>${menu.keterangan || ''}</p>
            </div>
        </main>
    `;
    setupQtyEvent(menu);
}

function setupQtyEvent(menu) {
    let qty = 0;
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');
    const qtyDisplay = document.getElementById('qty-display');
    const simpanBtn = document.getElementById('simpan-btn');

    if (!minusBtn || !plusBtn || !qtyDisplay || !simpanBtn) return;

    qtyDisplay.textContent = qty;

    minusBtn.addEventListener('click', () => {
        if (qty > 0) qty--;
        qtyDisplay.textContent = qty;
    });

    plusBtn.addEventListener('click', () => {
        qty++;
        qtyDisplay.textContent = qty;
    });

    simpanBtn.addEventListener('click', () => {
        if (qty > 0 && window.addToCart) {
            window.addToCart({
                name: menu.nama_menu,
                price: Number(menu.harga),
                qty: qty
            });

            Swal.fire({
                icon: 'success',
                title: 'Berhasil Ditambahkan!',
                text: `${menu.nama_menu} (${qty}x) berhasil ditambahkan ke keranjang.`,
                confirmButtonText: 'Tutup',
                confirmButtonColor: '#16A34A'
            });

            qty = 0;
            qtyDisplay.textContent = qty;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian!',
                text: 'Pilih minimal 1 paket untuk disimpan ke keranjang!',
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#D97706'
            });
        }
    });
}