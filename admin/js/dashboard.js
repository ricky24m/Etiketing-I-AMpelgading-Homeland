document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');

    // Menu navigation (tidak ada pembatasan role)
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const menu = this.dataset.menu;

            // Update active menu
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // Load content
            loadContent(menu);
        });
    });

    function loadContent(menu) {
        // Hide all content
        const allContent = contentArea.querySelectorAll('[id$="-content"]');
        allContent.forEach(content => content.style.display = 'none');

        switch (menu) {
            case 'dashboard':
                pageTitle.textContent = 'Dashboard';
                document.getElementById('dashboard-content').style.display = 'block';
                break;

            case 'bookings':
                pageTitle.textContent = 'Daftar Booking';
                document.getElementById('bookings-content').style.display = 'block';
                loadBookingsData();
                break;

            case 'finance':
                pageTitle.textContent = 'Keuangan';
                document.getElementById('finance-content').style.display = 'block';
                loadFinanceData();
                break;

            case 'menu-management':
                pageTitle.textContent = 'Kelola Menu';
                document.getElementById('menu-content').style.display = 'block';
                loadMenuManagement();
                break;

            case 'alat-camping-management':
                pageTitle.textContent = 'Kelola Alat Camping';
                document.getElementById('alat-camping-content').style.display = 'block';
                loadAlatCampingManagement(); // Buat fungsi ini di JS
                break;
        }
    }

    function loadBookingsData() {
        const bookingsContent = document.getElementById('bookings-content');
        bookingsContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Memuat data booking...</p>
            </div>
        `;

        // Load real data
        loadBookingsTable();
    }

    // Sisanya tetap sama...
});

// 🎯 PINDAHKAN FUNGSI KE LUAR DOMContentLoaded
function loadBookingsTable(page = 1, search = '', status = '') {
    const bookingsContent = document.getElementById('bookings-content');
    const limit = 10;

    // Build API URL dengan path yang benar
    const params = new URLSearchParams({
        page: page,
        limit: limit,
        search: search,
        status: status
    });

    // 🎯 FIX: Path API yang benar (keluar satu tingkat dari admin folder)
    fetch(`php/api/get-bookings.php?${params}`)
        .then(response => {
            console.log('Response status:', response.status); // Debug
            console.log('Response URL:', response.url); // Debug

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Debug
            if (data.success) {
                renderBookingsTable(data.data, data.pagination);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            bookingsContent.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
                    <h3 style="color: #dc2626;">❌ Error</h3>
                    <p>Gagal memuat data booking: ${error.message}</p>
                    <details style="margin-top: 10px; text-align: left;">
                        <summary>Detail Error</summary>
                        <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 0.8rem;">${error.stack || error.message}</pre>
                    </details>
                    <button onclick="loadBookingsData()" style="background: #16A34A; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                        Coba Lagi
                    </button>
                </div>
            `;
        });
}

// 🎯 PINDAHKAN FUNGSI RENDER KE LUAR JUGA
function renderBookingsTable(bookings, pagination) {
    const bookingsContent = document.getElementById('bookings-content');

    const tableHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #16A34A; margin: 0;">📋 Data Booking Pelanggan</h2>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="font-size: 0.9rem; color: #666;">
                        Total: ${pagination.total_records} booking
                    </span>
                </div>
            </div>
            
            <!-- Search and Filter -->
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <input type="text" id="search-booking" placeholder="Cari nama, email, order ID, atau telepon..." 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem;">
                </div>
                <select id="status-filter" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem;">
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="berhasil">Berhasil</option>
                    <option value="gagal">Gagal</option>
                </select>
                <button onclick="searchBookings()" style="background: #16A34A; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    🔍 Cari
                </button>
                <button onclick="resetSearch()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    ↻ Reset
                </button>
            </div>
            
            <!-- Table -->
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; min-width: 1000px;">
                    <thead>
<tr style="background: #f8f9fa;">
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Order ID</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Nama</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Email</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Telepon</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Pesanan</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Tanggal Booking</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Waktu Booking</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Status</th>
    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Aksi</th>
</tr>
</thead>
                    <tbody>
                        ${renderBookingRows(bookings)}
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            ${renderPagination(pagination)}
        </div>
    `;

    bookingsContent.innerHTML = tableHTML;
}

function renderBookingRows(bookings) {
    if (bookings.length === 0) {
        return `
            <tr>
                <td colspan="9" style="padding: 40px; text-align: center; color: #666;">
                    <h3>📭 Tidak ada data booking</h3>
                    <p>Belum ada booking yang masuk atau tidak ada hasil yang sesuai dengan pencarian.</p>
                </td>
            </tr>
        `;
    }

    return bookings.map(booking => {
        const statusColor = getStatusColor(booking.status);
        const statusText = getStatusText(booking.status);

        return `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                        ${booking.order_id}
                    </code>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.nama}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <a href="mailto:${booking.email}" style="color: #2563eb;">${booking.email}</a>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <a href="tel:${booking.phone}" style="color: #2563eb;">${booking.phone}</a>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd; max-width: 200px;">
                    <span title="${booking.items}">${booking.items_display}</span>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.tanggal_booking_formatted}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.order_date_formatted}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                        ${statusText}
                    </span>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <button onclick="showBookingDetail(${booking.id})" 
                            style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        📋 Detail
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderPagination(pagination) {
    if (pagination.total_pages <= 1) {
        return '';
    }

    const currentPage = pagination.current_page;
    const totalPages = pagination.total_pages;

    let paginationHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <div style="color: #666; font-size: 0.9rem;">
                Halaman ${currentPage} dari ${totalPages} 
                (${pagination.total_records} total booking)
            </div>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
    `;

    // Tombol Prev
    if (currentPage > 1) {
        paginationHTML += `
            <button onclick="loadBookingsTable(${currentPage - 1})" 
                style="background: #6b7280; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                ‹ Prev
            </button>
        `;
    }

    // Hitung range halaman
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Ellipsis sebelum
    if (startPage > 1) {
        paginationHTML += `
            <button onclick="loadBookingsTable(1)" 
                style="background: #f3f4f6; color: #333; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                1
            </button>
        `;
        if (startPage > 2) {
            paginationHTML += `<span style="padding: 8px 4px; color: #666;">...</span>`;
        }
    }

    // Nomor halaman
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        paginationHTML += `
            <button onclick="loadBookingsTable(${i})" 
                style="background: ${isActive ? '#16A34A' : '#f3f4f6'}; 
                       color: ${isActive ? 'white' : '#333'}; 
                       border: none; 
                       padding: 8px 12px; 
                       border-radius: 4px; 
                       cursor: ${isActive ? 'default' : 'pointer'};
                       ${isActive ? 'pointer-events: none;' : ''}">
                ${i}
            </button>
        `;
    }

    // Ellipsis setelah
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span style="padding: 8px 4px; color: #666;">...</span>`;
        }
        paginationHTML += `
            <button onclick="loadBookingsTable(${totalPages})" 
                style="background: #f3f4f6; color: #333; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                ${totalPages}
            </button>
        `;
    }

    // Tombol Next
    if (currentPage < totalPages) {
        paginationHTML += `
            <button onclick="loadBookingsTable(${currentPage + 1})" 
                style="background: #6b7280; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                Next ›
            </button>
        `;
    }

    paginationHTML += `
            </div>
        </div>
    `;

    return paginationHTML;
}

function getStatusColor(status) {
    switch (status) {
        case 'berhasil': return '#16A34A';
        case 'pending': return '#f59e0b';
        case 'gagal': return '#dc2626';
        default: return '#6b7280';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'berhasil': return 'Berhasil';
        case 'pending': return 'Pending';
        case 'gagal': return 'Gagal';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
}

// 🎯 PINDAHKAN FUNGSI SEARCH KE LUAR JUGA
function searchBookings() {
    const search = document.getElementById('search-booking').value;
    const status = document.getElementById('status-filter').value;
    loadBookingsTable(1, search, status);
}

function resetSearch() {
    document.getElementById('search-booking').value = '';
    document.getElementById('status-filter').value = '';
    loadBookingsTable(1);
}

function showBookingDetail(bookingId) {
    // Show loading in modal
    Swal.fire({
        title: 'Memuat detail...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // 🎯 FIX: Path API yang benar
    fetch(`php/api/get-booking-detail.php?id=${bookingId}`)
        .then(response => {
            console.log('Detail response status:', response.status); // Debug

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Detail API Response:', data); // Debug
            if (data.success) {
                showBookingDetailModal(data.data);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error loading booking detail:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal memuat detail booking: ' + error.message
            });
        });
}

function showBookingDetailModal(booking) {
    const statusColor = getStatusColor(booking.status);
    const statusText = getStatusText(booking.status);

    Swal.fire({
        title: 'Detail Booking',
        html: `
            <div style="text-align: left; max-width: 600px; margin: 0 auto;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #16A34A;">🎫 Informasi Booking</h4>
                    <table style="width: 100%; border-spacing: 0;">
                        <tr><td style="padding: 5px 0; font-weight: bold;">Order ID:</td><td style="padding: 5px 0;"><code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${booking.order_id}</code></td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">Status:</td><td style="padding: 5px 0;"><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem;">${statusText}</span></td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">Tanggal Order:</td><td style="padding: 5px 0;">${booking.order_date_formatted}</td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">Tanggal Booking:</td><td style="padding: 5px 0;">${booking.tanggal_booking_formatted}</td></tr>
                    </table>
                </div>
                
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #2563eb;">👤 Data Pelanggan</h4>
                    <table style="width: 100%; border-spacing: 0;">
                        <tr><td style="padding: 5px 0; font-weight: bold;">Nama:</td><td style="padding: 5px 0;">${booking.nama}</td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">NIK:</td><td style="padding: 5px 0;">${booking.nik}</td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;"><a href="mailto:${booking.email}" style="color: #2563eb;">${booking.email}</a></td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">Telepon:</td><td style="padding: 5px 0;"><a href="tel:${booking.phone}" style="color: #2563eb;">${booking.phone}</a></td></tr>
                        <tr><td style="padding: 5px 0; font-weight: bold;">Kontak Darurat:</td><td style="padding: 5px 0;"><a href="tel:${booking.emergency}" style="color: #2563eb;">${booking.emergency}</a></td></tr>
                    </table>
                </div>
                
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #16A34A;">🛒 Detail Pesanan</h4>
                    <div style="background: white; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <strong>Items:</strong><br>
                        <span style="color: #666;">${booking.items}</span>
                    </div>
                    <div style="text-align: right; font-size: 1.2rem; font-weight: bold; color: #16A34A;">
                        Total: ${booking.total_formatted}
                    </div>
                </div>
            </div>
        `,
        width: '700px',
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#16A34A',
        customClass: {
            popup: 'booking-detail-modal'
        }
    });
}

// Tambahkan fungsi untuk load menu management
function loadMenuManagement() {
    console.log('🔧 loadMenuManagement() called');

    const menuContent = document.getElementById('menu-content');
    if (!menuContent) {
        console.error('❌ Element #menu-content not found!');
        return;
    }

    console.log('✅ Found menu-content element:', menuContent);

    menuContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Memuat data menu...</p>
        </div>
    `;

    console.log('🔄 Fetching menu data...');

    // Clear previous data
    window.menuData = null;

    // Load data menu dengan timeout
    const timeoutId = setTimeout(() => {
        console.error('⏰ Request timeout');
        showAdminMenuError('Request timeout - coba lagi');
    }, 10000); // 10 detik timeout

    fetch('php/api/get-admin-menu.php')
        .then(response => {
            clearTimeout(timeoutId);
            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('📦 API Response:', data);

            if (data.success) {
                console.log('✅ Menu data loaded successfully:', data.data);

                // Set global variable
                window.menuData = data.data;

                // Check if render function exists
                if (typeof renderAdminMenuTable === 'function') {
                    renderAdminMenuTable(data.data);
                } else {
                    console.error('❌ renderAdminMenuTable function not found!');
                    showAdminMenuError('Rendering function tidak ditemukan');
                }
            } else {
                console.error('❌ API returned error:', data.message);
                throw new Error(data.message);
            }
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.error('💥 Error loading admin menu:', error);
            showAdminMenuError('Error: ' + error.message);
        });
}

function renderAdminMenuTable(menuData) {
    const menuContent = document.getElementById('menu-content');

    let tableHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #16A34A; margin: 0;">🍽️ Kelola Menu Katalog</h2>
                <button onclick="showAddMenuForm()" style="background: #16A34A; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    + Tambah Menu
                </button>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                <p><strong>📝 Informasi:</strong></p>
                <p>• Kelola menu yang akan ditampilkan di halaman katalog</p>
                <p>• Data disimpan di 2 tabel: <code>katalog_menu</code> dan <code>detail_menu</code></p>
                <p>• Upload gambar dengan format JPG, PNG, atau GIF (max 2MB)</p>
            </div>
            
            <div id="menu-table-container" style="margin-top: 20px; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; min-width: 1000px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 12px; border: 1px solid #ddd;">Gambar</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Nama Menu</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Kategori</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Status</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Waktu</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Harga</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    menuData.forEach(menu => {
        const hargaDisplay = menu.harga ? `Rp ${Number(menu.harga).toLocaleString()}` : 'Belum diset';
        const statusColor = menu.status === 'aktif' ? '#16A34A' : '#dc2626';
        const waktuDisplay = menu.waktu || 'Belum diset';

        tableHTML += `
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                    <img src="${menu.gambar_url}" alt="${menu.nama_menu}" 
                         style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 60px; height: 40px; background: #f3f4f6; border: 1px dashed #d1d5db; border-radius: 4px; align-items: center; justify-content: center; font-size: 10px; color: #666;">
                        No Image
                    </div>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <strong>${menu.nama_menu}</strong>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">${menu.kategori}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                        ${menu.status.charAt(0).toUpperCase() + menu.status.slice(1)}
                    </span>
                </td>
                <td style="padding: 12px; border: 1px solid #ddd;">${waktuDisplay}</td>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600;">${hargaDisplay}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <button onclick="showEditMenuForm(${menu.id})" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Edit</button>
                    <button onclick="deleteMenu(${menu.id})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🗑️ Hapus</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    menuContent.innerHTML = tableHTML;
}

function showAdminMenuError() {
    const menuContent = document.getElementById('menu-content');
    menuContent.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #dc2626;">❌ Error</h3>
            <p>Gagal memuat data menu. Silakan refresh halaman.</p>
            <button onclick="loadMenuManagement()" style="background: #16A34A; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                Coba Lagi
            </button>
        </div>
    `;
}

// Form functions
function showAddMenuForm() {
    showMenuForm();
}

function showEditMenuForm(menuId) {
    // Load data menu terlebih dahulu
    fetch(`php/api/get-admin-menu.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const menu = data.data.find(m => m.id == menuId);
                if (menu) {
                    showMenuForm(menu);
                } else {
                    Swal.fire('Error', 'Menu tidak ditemukan', 'error');
                }
            }
        })
        .catch(error => {
            Swal.fire('Error', 'Gagal memuat data menu', 'error');
        });
}

function showMenuForm(menuData = null) {
    const isEdit = menuData !== null;
    const title = isEdit ? 'Edit Menu' : 'Tambah Menu Baru';

    Swal.fire({
        title: title,
        html: `
            <form id="menu-form" enctype="multipart/form-data" style="text-align: left;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nama Menu:</label>
                    <input type="text" id="nama_menu" name="nama_menu" value="${menuData?.nama_menu || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Gambar:</label>
                    <input type="file" id="gambar" name="gambar" accept="image/*" 
                           ${!isEdit ? 'required' : ''} style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    ${isEdit ? '<small style="color: #666;">Kosongkan jika tidak ingin mengubah gambar</small>' : ''}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Kategori:</label>
                    <input type="text" id="kategori" name="kategori" value="${menuData?.kategori || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                           placeholder="Contoh: jeep, wisata, camping, outbond">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Status:</label>
                    <select id="status" name="status" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="aktif" ${menuData?.status === 'aktif' ? 'selected' : ''}>Aktif</option>
                        <option value="nonaktif" ${menuData?.status === 'nonaktif' ? 'selected' : ''}>Non Aktif</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Waktu:</label>
                    <input type="text" id="waktu" name="waktu" value="${menuData?.waktu || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                           placeholder="Contoh: 06.00 - 18.00">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Harga:</label>
                    <input type="number" id="harga" name="harga" value="${menuData?.harga || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                           placeholder="Contoh: 50000">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Satuan:</label>
                    <input type="text" id="satuan" name="satuan" value="${menuData?.satuan || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                           placeholder="Contoh: per orang, per jeep">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Keterangan:</label>
                    <textarea id="keterangan" name="keterangan" rows="4" required 
                              style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
                              placeholder="Deskripsi detail menu...">${menuData?.keterangan || ''}</textarea>
                </div>
                
                ${isEdit ? `<input type="hidden" id="menu_id" name="menu_id" value="${menuData.id}">` : ''}
            </form>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Update Menu' : 'Simpan Menu',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#16A34A',
        preConfirm: () => {
            return submitMenuForm();
        }
    });
}

function submitMenuForm() {
    const form = document.getElementById('menu-form');
    const formData = new FormData(form);

    // Validasi
    const namaMenu = formData.get('nama_menu');
    const kategori = formData.get('kategori');
    const waktu = formData.get('waktu');
    const harga = formData.get('harga');

    if (!namaMenu || !kategori || !waktu || !harga) {
        Swal.showValidationMessage('Mohon lengkapi semua field yang wajib diisi');
        return false;
    }

    // Show loading
    Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    return fetch('php/api/save-menu.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: data.message,
                    confirmButtonColor: '#16A34A'
                }).then(() => {
                    loadMenuManagement(); // Refresh table
                });
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message,
                confirmButtonColor: '#dc2626'
            });
        });
}

function deleteMenu(menuId) {
    Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus menu ini? Data tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('menu_id', menuId);

            fetch('php/api/delete-menu.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: data.message,
                            confirmButtonColor: '#16A34A'
                        }).then(() => {
                            loadMenuManagement(); // Refresh table
                        });
                    } else {
                        throw new Error(data.message);
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.message,
                        confirmButtonColor: '#dc2626'
                    });
                });
        }
    });
}

// Global functions
window.showAddMenuForm = showAddMenuForm;
window.showEditMenuForm = showEditMenuForm;
window.deleteMenu = deleteMenu;

// Pastikan fungsi ini dideklarasikan di global scope
window.loadBookingsTable = loadBookingsTable;

// Finance Functions
function loadFinanceData() {
    const financeContent = document.getElementById('finance-content');
    if (!financeContent) return;

    // Set default date range (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    document.getElementById('start-date').value = firstDay.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];

    // Load initial data
    loadRevenueData();
}

function loadRevenueData() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Perhatian',
            text: 'Silakan pilih tanggal mulai dan selesai'
        });
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai'
        });
        return;
    }

    // Show loading
    const tbody = document.getElementById('revenue-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="loading">Memuat data...</div></td></tr>';

    // Build URL dengan parameter
    const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
    });

    fetch(`php/api/get-revenue.php?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderRevenueData(data.data);
                updateRevenueSummary(data.summary);
            } else {
                showRevenueError('Gagal memuat data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showRevenueError('Terjadi kesalahan saat memuat data');
        });
}

function renderRevenueData(transactions) {
    const tbody = document.getElementById('revenue-tbody');

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <div class="empty-state">Tidak ada data transaksi pada periode ini</div>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    transactions.forEach(transaction => {
        // Truncate items jika terlalu panjang
        let items = transaction.items;
        if (items.length > 40) {
            items = items.substring(0, 40) + '...';
        }

        html += `
            <tr>
                <td>${formatDate(transaction.order_date)}</td>
                <td>
                    <code style="font-size: 12px; background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">
                        ${transaction.order_id}
                    </code>
                </td>
                <td>${transaction.nama}</td>
                <td title="${transaction.items}">${items}</td>
                <td style="font-weight: 600; color: #16A34A;">
                    Rp ${parseInt(transaction.total).toLocaleString()}
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function updateRevenueSummary(summary) {
    // Update total revenue
    document.getElementById('total-revenue').textContent =
        'Rp ' + parseInt(summary.total_revenue).toLocaleString();

    // Update total transactions
    document.getElementById('total-transactions').textContent = summary.total_transactions;

    // Update average per transaction
    const average = summary.total_transactions > 0 ?
        Math.round(summary.total_revenue / summary.total_transactions) : 0;
    document.getElementById('average-transaction').textContent =
        'Rp ' + average.toLocaleString();

    // Update period
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const periodText = `${formatDateId(startDate)} - ${formatDateId(endDate)}`;
    document.getElementById('revenue-period').textContent = periodText;
}

function resetDateFilter() {
    // Set to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    document.getElementById('start-date').value = firstDay.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];

    // Reset entries per page ke default
    document.getElementById('entries-per-page').value = '10';
    revenueEntriesPerPage = 10;

    // Reload data
    loadRevenueData();
}

function showRevenueError(message) {
    const tbody = document.getElementById('revenue-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 40px;">
                <div style="color: #dc2626;">❌ ${message}</div>
                <button onclick="loadRevenueData()" style="margin-top: 10px; padding: 8px 16px; background: #16A34A; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Coba Lagi
                </button>
            </td>
        </tr>
    `;

    // Hide pagination on error
    document.getElementById('revenue-pagination').style.display = 'none';

    // Reset summary
    document.getElementById('total-revenue').textContent = 'Rp 0';
    document.getElementById('total-transactions').textContent = '0';
    document.getElementById('average-transaction').textContent = 'Rp 0';
    document.getElementById('revenue-period').textContent = 'Error';
}

// Utility function for date formatting

// Utility function for date formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateId(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Global variables untuk revenue pagination
let revenueCurrentPage = 1;
let revenueEntriesPerPage = 10;
let revenueAllTransactions = []; // Menyimpan semua data

// Finance Functions
function loadFinanceData() {
    const financeContent = document.getElementById('finance-content');
    if (!financeContent) return;

    // Set default date range (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    document.getElementById('start-date').value = firstDay.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];

    // Load initial data
    loadRevenueData();
}

function loadRevenueData() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Perhatian',
            text: 'Silakan pilih tanggal mulai dan selesai'
        });
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai'
        });
        return;
    }

    // Show loading
    const tbody = document.getElementById('revenue-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="loading">Memuat data...</div></td></tr>';

    // Reset pagination
    revenueCurrentPage = 1;
    document.getElementById('revenue-pagination').style.display = 'none';

    // Build URL dengan parameter
    const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
    });

    fetch(`php/api/get-revenue.php?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                revenueAllTransactions = data.data; // Simpan semua data
                updateRevenueSummary(data.summary);
                renderRevenueTableWithPagination(); // Render dengan pagination
            } else {
                showRevenueError('Gagal memuat data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showRevenueError('Terjadi kesalahan saat memuat data');
        });
}

function renderRevenueTableWithPagination() {
    const tbody = document.getElementById('revenue-tbody');
    const paginationContainer = document.getElementById('revenue-pagination');

    if (revenueAllTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <div class="empty-state">Tidak ada data transaksi pada periode ini</div>
                </td>
            </tr>
        `;
        paginationContainer.style.display = 'none';
        return;
    }

    // Calculate pagination
    const totalItems = revenueAllTransactions.length;
    const totalPages = Math.ceil(totalItems / revenueEntriesPerPage);
    const startIndex = (revenueCurrentPage - 1) * revenueEntriesPerPage;
    const endIndex = startIndex + revenueEntriesPerPage;
    const currentPageData = revenueAllTransactions.slice(startIndex, endIndex);

    // Render table data
    renderRevenueData(currentPageData);

    // Show/hide pagination
    if (totalPages > 1) {
        renderRevenuePagination(totalPages, totalItems, startIndex, endIndex);
        paginationContainer.style.display = 'flex';
    } else {
        paginationContainer.style.display = 'none';
    }
}

function renderRevenueData(transactions) {
    const tbody = document.getElementById('revenue-tbody');

    let html = '';
    transactions.forEach(transaction => {
        // Truncate items jika terlalu panjang
        let items = transaction.items;
        if (items.length > 40) {
            items = items.substring(0, 40) + '...';
        }

        html += `
            <tr>
                <td>${formatDate(transaction.order_date)}</td>
                <td>
                    <code style="font-size: 12px; background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">
                        ${transaction.order_id}
                    </code>
                </td>
                <td>${transaction.nama}</td>
                <td title="${transaction.items}">${items}</td>
                <td style="font-weight: 600; color: #16A34A;">
                    Rp ${parseInt(transaction.total).toLocaleString()}
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderRevenuePagination(totalPages, totalItems, startIndex, endIndex) {
    const paginationContainer = document.getElementById('revenue-pagination');

    let paginationHTML = `
        <div class="revenue-pagination-info">
            Menampilkan ${startIndex + 1} - ${Math.min(endIndex, totalItems)} dari ${totalItems} transaksi
        </div>
        <div class="revenue-pagination-buttons">
    `;

    // Previous button
    if (revenueCurrentPage > 1) {
        paginationHTML += `
            <button class="revenue-pagination-btn" onclick="goToRevenuePage(${revenueCurrentPage - 1})">
                ‹ Prev
            </button>
        `;
    }

    // Page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, revenueCurrentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // First page + ellipsis
    if (startPage > 1) {
        paginationHTML += `
            <button class="revenue-pagination-btn" onclick="goToRevenuePage(1)">1</button>
        `;
        if (startPage > 2) {
            paginationHTML += `<span style="padding: 6px 4px; color: #666;">...</span>`;
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === revenueCurrentPage ? 'active' : '';
        paginationHTML += `
            <button class="revenue-pagination-btn ${activeClass}" onclick="goToRevenuePage(${i})">
                ${i}
            </button>
        `;
    }

    // Last page + ellipsis
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span style="padding: 6px 4px; color: #666;">...</span>`;
        }
        paginationHTML += `
            <button class="revenue-pagination-btn" onclick="goToRevenuePage(${totalPages})">${totalPages}</button>
        `;
    }

    // Next button
    if (revenueCurrentPage < totalPages) {
        paginationHTML += `
            <button class="revenue-pagination-btn" onclick="goToRevenuePage(${revenueCurrentPage + 1})">
                Next ›
            </button>
        `;
    }

    paginationHTML += `
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Fungsi untuk pindah halaman revenue
function goToRevenuePage(page) {
    revenueCurrentPage = page;
    renderRevenueTableWithPagination();
}

// Fungsi untuk mengubah jumlah entri per halaman
function changeEntriesPerPage() {
    const select = document.getElementById('entries-per-page');
    revenueEntriesPerPage = parseInt(select.value);
    revenueCurrentPage = 1; // Reset ke halaman pertama
    renderRevenueTableWithPagination();
}

// Pastikan semua functions tersedia sebelum DOMContentLoaded
function ensureFunctionsAvailable() {
    if (typeof renderAdminMenuTable !== 'function') {
        console.error('❌ renderAdminMenuTable function not defined!');
        return false;
    }
    return true;
}

function loadAlatCampingManagement() {
    const content = document.getElementById('alat-camping-content');
    content.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #16A34A; margin: 0;">⛺ Kelola Alat Camping</h2>
                <button onclick="showAddAlatCampingForm()" style="background: #16A34A; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    + Tambah Alat
                </button>
            </div>
            <div id="alat-camping-table-container" style="margin-top: 20px; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; min-width: 800px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 12px; border: 1px solid #ddd;">Gambar</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Nama Alat</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Harga</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Satuan</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="alat-camping-table-body">
                        <!-- Data alat camping akan diisi via JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    fetch('../php/api/get-alat-camping.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) renderAlatCampingTable(data.data);
        });
}

function renderAlatCampingTable(data) {
    const tbody = document.getElementById('alat-camping-table-body');
    tbody.innerHTML = data.map(item => `
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                <img src="../${item.gambar_url}" alt="${item.nama_alat}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;">
            </td>
            <td style="padding: 12px; border: 1px solid #ddd;">${item.nama_alat}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Rp ${Number(item.harga).toLocaleString()}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${item.satuan}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">
                <button onclick="showEditAlatCampingForm(${item.id})" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Edit</button>
                <button onclick="deleteAlatCamping(${item.id})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

// Tambahkan fungsi-fungsi untuk alat camping
function showAddAlatCampingForm() {
    showAlatCampingForm();
}

function showEditAlatCampingForm(alatId) {
    // Load data alat terlebih dahulu
    fetch(`../php/api/get-alat-camping.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const alat = data.data.find(a => a.id == alatId);
                if (alat) {
                    showAlatCampingForm(alat);
                } else {
                    Swal.fire('Error', 'Alat tidak ditemukan', 'error');
                }
            }
        })
        .catch(error => {
            Swal.fire('Error', 'Gagal memuat data alat', 'error');
        });
}

function showAlatCampingForm(alatData = null) {
    const isEdit = alatData !== null;
    const title = isEdit ? 'Edit Alat Camping' : 'Tambah Alat Camping Baru';

    Swal.fire({
        title: title,
        html: `
            <form id="alat-camping-form" enctype="multipart/form-data" style="text-align: left;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nama Alat:</label>
                    <input type="text" id="nama_alat" name="nama_alat" value="${alatData?.nama_alat || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Gambar:</label>
                    <input type="file" id="gambar" name="gambar" accept="image/*" 
                           ${!isEdit ? 'required' : ''} style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    ${isEdit ? '<small style="color: #666;">Kosongkan jika tidak ingin mengubah gambar</small>' : ''}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Harga:</label>
                    <input type="number" id="harga" name="harga" value="${alatData?.harga || ''}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Satuan:</label>
                    <input type="text" id="satuan" name="satuan" value="${alatData?.satuan || 'per hari'}" 
                           required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Keterangan:</label>
                    <textarea id="keterangan" name="keterangan" rows="3" 
                              style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">${alatData?.keterangan || ''}</textarea>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Status:</label>
                    <select id="status" name="status" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="aktif" ${alatData?.status === 'aktif' ? 'selected' : ''}>Aktif</option>
                        <option value="nonaktif" ${alatData?.status === 'nonaktif' ? 'selected' : ''}>Non Aktif</option>
                    </select>
                </div>
                
                ${isEdit ? `<input type="hidden" id="alat_id" name="id" value="${alatData.id}">` : ''}
            </form>
        `,
        width: '500px',
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Update Alat' : 'Simpan Alat',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#16A34A',
        preConfirm: () => {
            return submitAlatCampingForm();
        }
    });
}

function submitAlatCampingForm() {
    const form = document.getElementById('alat-camping-form');
    const formData = new FormData(form);

    return fetch('php/api/save-alat-camping.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data alat camping berhasil disimpan',
                    confirmButtonColor: '#16A34A'
                }).then(() => {
                    loadAlatCampingManagement(); // Refresh table
                });
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            Swal.fire('Error', 'Gagal menyimpan: ' + error.message, 'error');
            return false;
        });
}

function deleteAlatCamping(alatId) {
    Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus alat ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('id', alatId);

            fetch('php/api/delete-alat-camping.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Alat berhasil dihapus',
                            confirmButtonColor: '#16A34A'
                        }).then(() => {
                            loadAlatCampingManagement(); // Refresh table
                        });
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                })
                .catch(error => {
                    Swal.fire('Error', 'Gagal menghapus alat', 'error');
                });
        }
    });
}
