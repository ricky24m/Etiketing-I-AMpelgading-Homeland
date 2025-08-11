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
        <div class="hero">
            <img src="${menu.gambar_url}" alt="${menu.nama_menu}" class="hero-img">
            <h1>${menu.nama_menu}</h1>
        </div>
        <table>
            <tr>
                <th>Waktu</th>
                <th>Harga Tiket</th>
                <th>Jumlah</th>
            </tr>
            <tr>
                <td>${menu.waktu}</td>
                <td>Rp ${Number(menu.harga).toLocaleString()}</td>
                <td>
                    <div class="quantity-control">
                        <button id="minus-btn" class="btn-qty">-</button>
                        <span id="qty-display" class="qty-display">0</span>
                        <button id="plus-btn" class="btn-qty">+</button>
                    </div>
                </td>
            </tr>
        </table>
        <div class="keterangan">
            <p>${menu.keterangan}</p>
        </div>
        <div>
            <button id="simpan-btn" class="btn-qty" style="margin-top:12px;width:100px;">Simpan</button>
        </div>
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