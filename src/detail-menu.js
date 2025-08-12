document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    fetch(`php/api/get-detail-menu.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // ✅ PERBAIKAN: Kondisi yang lebih spesifik
                // Hanya menu dengan nama yang mengandung "sewa alat camping" yang akan render khusus
                if (data.data.nama_menu.toLowerCase().includes('sewa alat camping')) {
                    renderSewaAlatCamping(data.data);
                } else {
                    // Semua menu lainnya (termasuk "Camping" biasa) akan render sebagai detail menu normal
                    renderDetailMenu(data.data);
                }
            } else {    
                document.getElementById('detail-container').innerHTML = '<p>Menu tidak ditemukan.</p>';
            }
        });
});

// ✅ PERBAIKAN: Gunakan gambar dari database untuk hero
function renderSewaAlatCamping(menu) {
    // Gunakan fallback yang sama seperti katalog
    const heroImageUrl = menu.gambar_url || 'images/placeholder.svg';
    
    document.getElementById('detail-container').innerHTML = `
        <div class="wisata-hero">
            <img src="${heroImageUrl}" 
                 alt="${menu.nama_menu}" 
                 class="wisata-hero-img"
                 onerror="this.src='images/placeholder.svg'; this.onerror=null;">
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
        
        <div class="keterangan1">
            <h1 style="font-size: 24px; text-align: center; margin-bottom: 20px;">Pilih Alat Camping yang Anda Butuhkan</h1>
            <p style="text-align: center; margin-bottom: 30px;">Semua alat berkualitas dan terawat dengan baik</p>
        </div>

        <!-- Container untuk daftar alat camping -->
        <div class="camping-items-container">
            <!-- Item akan diisi oleh JavaScript -->
        </div>

        <div class="cart-summary">
            <button id="add-all-to-cart" class="btn-cart-summary">Tambahkan ke Keranjang</button>
        </div>
    `;
    
    // Load alat camping dinamis
    loadAlatCampingItems();
}

// ✅ TIDAK ADA PERUBAHAN pada fungsi loadAlatCampingItems
function loadAlatCampingItems() {
    let itemQuantities = {};

    fetch('php/api/get-alat-camping.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const container = document.querySelector('.camping-items-container');
                itemQuantities = {};

                container.innerHTML = data.data.map(item => {
                    itemQuantities[item.id] = 0;
                    return `
                        <div class="camping-item">
                            <img src="${item.gambar_url}" alt="${item.nama_alat}">
                            <h3>${item.nama_alat}</h3>
                            <p class="price">Rp ${item.harga.toLocaleString()}/${item.satuan}</p>
                            <div class="quantity-control">
                                <button class="btn-qty minus" data-item="${item.id}">-</button>
                                <span class="qty-display" data-item="${item.id}">0</span>
                                <button class="btn-qty plus" data-item="${item.id}">+</button>
                            </div>
                        </div>
                    `;
                }).join('');

                // Event listeners untuk tombol plus/minus
                container.querySelectorAll('.btn-qty').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const itemId = this.getAttribute('data-item');
                        const isPlus = this.classList.contains('plus');
                        if (isPlus) {
                            itemQuantities[itemId]++;
                        } else if (itemQuantities[itemId] > 0) {
                            itemQuantities[itemId]--;
                        }
                        container.querySelector(`.qty-display[data-item="${itemId}"]`).textContent = itemQuantities[itemId];
                    });
                });

                // Tombol simpan semua ke keranjang
                document.getElementById('add-all-to-cart').addEventListener('click', function () {
                    let hasItems = false;
                    let addedItems = [];

                    data.data.forEach(item => {
                        const qty = itemQuantities[item.id] || 0;
                        if (qty > 0 && window.addToCart) {
                            window.addToCart({
                                name: item.nama_alat,
                                price: item.harga,
                                qty: qty
                            });
                            addedItems.push(`${item.nama_alat} (${qty}x)`);
                            hasItems = true;
                        }
                    });

                    if (hasItems) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil Ditambahkan!',
                            html: `Item berhasil ditambahkan ke keranjang:<br><br><strong>${addedItems.join('<br>')}</strong>`,
                            confirmButtonText: 'Tutup',
                            confirmButtonColor: '#16A34A'
                        });
                        // Reset qty
                        Object.keys(itemQuantities).forEach(id => itemQuantities[id] = 0);
                        document.querySelectorAll('.qty-display').forEach(span => span.textContent = '0');
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Perhatian!',
                            text: 'Pilih minimal satu item untuk ditambahkan ke keranjang!',
                            confirmButtonText: 'Mengerti',
                            confirmButtonColor: '#D97706'
                        });
                    }
                });
            }
        });
}

// ✅ PERBAIKAN: Gunakan gambar dari database untuk hero
function renderDetailMenu(menu) {
    // Ubah \n atau \r\n menjadi <br>
    const keteranganHTML = (menu.keterangan || '').replace(/(?:\r\n|\r|\n)/g, '<br>');
    
    // Gunakan fallback yang sama seperti katalog
    const heroImageUrl = menu.gambar_url || 'images/placeholder.svg';

    document.getElementById('detail-container').innerHTML = `
        <div class="wisata-hero">
            <img src="${heroImageUrl}" 
                 alt="${menu.nama_menu}" 
                 class="wisata-hero-img"
                 onerror="this.src='images/placeholder.svg'; this.onerror=null;">
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
                <p>${keteranganHTML}</p>
            </div>
        </main>
    `;
    setupQtyEvent(menu);
}

// ✅ TIDAK ADA PERUBAHAN pada setupQtyEvent
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