document.addEventListener('DOMContentLoaded', function () {
    loadKatalogMenu();
    setupSearch();
});

let allMenuData = []; // Store all menu data for search

async function loadKatalogMenu() {
    const loadingState = document.getElementById('loading-state');
    const menuContainer = document.getElementById('menu-container');
    const errorState = document.getElementById('error-state');

    // Show loading
    loadingState.style.display = 'block';
    menuContainer.style.display = 'none';
    errorState.style.display = 'none';

    try {
        // 🎯 FIX: Correct API path
        const response = await fetch('php/api/get-katalog-menu.php');

        console.log('Response status:', response.status); // Debug
        console.log('Response URL:', response.url); // Debug

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug

        if (data.success && data.data.length > 0) {
            allMenuData = data.data; // Store for search
            renderMenuItems(data.data);

            // Hide loading, show menu
            loadingState.style.display = 'none';
            menuContainer.style.display = 'flex';

        } else {
            // No data available
            showEmptyState();
        }

    } catch (error) {
        console.error('Error loading menu:', error);
        showErrorState();
    }
}

function renderMenuItems(menuData) {
    const menuContainer = document.getElementById('menu-container');
    let menuHTML = '';

    menuData.forEach(menu => {
        const imageUrl = menu.gambar_url || 'images/placeholder.jpg';
        menuHTML += `
            <div class="menu-item" data-kategori="${menu.kategori}" data-id="${menu.id}">
                <img class="img" 
                     src="${imageUrl}" 
                     alt="${menu.nama_menu}" 
                     width="300" 
                     height="200"
                     loading="lazy"
                     onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
                <h3>${menu.nama_menu}</h3>
                <p><a href="detail-menu.html?id=${menu.id}" class="button">Selengkapnya</a> untuk melihat lebih detail</p>
            </div>
        `;
    });

    menuContainer.innerHTML = menuHTML;
}

function showEmptyState() {
    const loadingState = document.getElementById('loading-state');
    const menuContainer = document.getElementById('menu-container');

    loadingState.style.display = 'none';
    menuContainer.style.display = 'block';
    menuContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; width: 100%;">
            <h3 style="color: #666;">Belum ada menu tersedia</h3>
            <p>Silakan hubungi admin untuk informasi lebih lanjut.</p>
        </div>
    `;
}

function showErrorState() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const menuContainer = document.getElementById('menu-container');
    const notFound = document.getElementById('not-found');

    if (!searchInput) return; // Guard clause

    searchInput.addEventListener('input', function () {
        const keyword = this.value.trim().toLowerCase();

        if (keyword === '') {
            // Show all items
            renderMenuItems(allMenuData);
            notFound.style.display = 'none';
        } else {
            // 🎯 Filter berdasarkan nama menu dan kategori saja (tanpa deskripsi)
            const filteredData = allMenuData.filter(menu =>
                menu.nama_menu.toLowerCase().includes(keyword) ||
                menu.kategori.toLowerCase().includes(keyword)
            );

            if (filteredData.length > 0) {
                renderMenuItems(filteredData);
                notFound.style.display = 'none';
            } else {
                menuContainer.innerHTML = '';
                notFound.style.display = 'block';
            }
        }
    });
}

// Global function untuk refresh data (bisa dipanggil dari luar)
window.refreshKatalogMenu = loadKatalogMenu;