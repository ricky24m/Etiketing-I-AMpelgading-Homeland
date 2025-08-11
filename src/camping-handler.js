document.addEventListener('DOMContentLoaded', function () {
    console.log('Camping handler loaded'); // Debug log
    
    // Konfigurasi item camping
    const campingItems = {
        'tenda-2': { name: 'Tenda 2 Orang', price: 50000 },
        'tenda-4': { name: 'Tenda 4 Orang', price: 85000 },
        'tenda-6': { name: 'Tenda 6-8 Orang', price: 115000 },
        'kompor': { name: 'Kompor Portable', price: 30000 },
        'teapot': { name: 'Teapot', price: 15000 },
        'sleeping-bag': { name: 'Sleeping Bag', price: 15000 },
        'nesting': { name: 'Nesting', price: 15000 },
        'meja-lipat': { name: 'Meja Lipat', price: 25000 },
        'kursi-lipat': { name: 'Kursi Lipat', price: 20000 },
        'lampu-tenda': { name: 'Lampu Tenda', price: 10000 },
    };

    // State untuk menyimpan quantity setiap item
    let itemQuantities = {};
    
    // Initialize quantities
    Object.keys(campingItems).forEach(itemKey => {
        itemQuantities[itemKey] = 0;
    });

    // Event listeners untuk semua tombol plus/minus
    document.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemKey = this.getAttribute('data-item');
            const isPlus = this.classList.contains('plus');
            const qtyDisplay = document.querySelector(`.qty-display[data-item="${itemKey}"]`);
            
            if (isPlus) {
                itemQuantities[itemKey]++;
            } else if (itemQuantities[itemKey] > 0) {
                itemQuantities[itemKey]--;
            }
            
            if (qtyDisplay) {
                qtyDisplay.textContent = itemQuantities[itemKey];
            }
        });
    });

    // Event listener untuk tombol "Tambahkan ke Keranjang"
    const addToCartBtn = document.getElementById('add-all-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            console.log('Add to cart clicked'); // Debug log
            
            let hasItems = false;
            let addedItems = [];
            
            Object.keys(itemQuantities).forEach(itemKey => {
                const qty = itemQuantities[itemKey];
                if (qty > 0 && window.addToCart) {
                    window.addToCart({
                        name: campingItems[itemKey].name,
                        price: campingItems[itemKey].price,
                        qty: qty
                    });
                    addedItems.push(`${campingItems[itemKey].name} (${qty}x)`);
                    hasItems = true;
                }
            });
            
            if (hasItems) {
                // Reset semua quantity setelah ditambahkan
                Object.keys(itemQuantities).forEach(itemKey => {
                    itemQuantities[itemKey] = 0;
                    const qtyDisplay = document.querySelector(`.qty-display[data-item="${itemKey}"]`);
                    if (qtyDisplay) {
                        qtyDisplay.textContent = '0';
                    }
                });
                
                // SweetAlert2 Success Modal
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Ditambahkan!',
                    html: `Item berhasil ditambahkan ke keranjang:<br><br><strong>${addedItems.join('<br>')}</strong>`,
                    confirmButtonText: 'Tutup',
                    confirmButtonColor: '#16A34A',
                    customClass: {
                        popup: 'swal-popup-custom'
                    }
                });
            } else {
                // SweetAlert2 Warning Modal
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

    fetch('php/api/get-alat-camping.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) renderCampingItems(data.data);
        });

    function renderCampingItems(items) {
        const container = document.querySelector('.camping-items-container');
        itemQuantities = {};
        container.innerHTML = items.map(item => {
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
            btn.addEventListener('click', function() {
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
    }

    // Tombol simpan semua ke keranjang
    document.getElementById('add-all-to-cart').addEventListener('click', function() {
        let hasItems = false;
        let addedItems = [];
        fetch('php/api/get-alat-camping.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
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
                }
            });
    });
});