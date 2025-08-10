document.addEventListener('DOMContentLoaded', function () {
    // Cart logic functions (unchanged)
    function getCartCount() {
        return parseInt(localStorage.getItem('cartCount')) || 0;
    }
    function setCartCount(count) {
        localStorage.setItem('cartCount', count);
        updateCartIcon();
    }
    function updateCartIcon() {
        const cartIcons = document.querySelectorAll('.navbar-icon[data-cart]');
        cartIcons.forEach(icon => {
            icon.setAttribute('data-count', getCartCount());
            icon.title = 'Cart (' + getCartCount() + ')';
            let badge = icon.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                icon.style.position = 'relative';
                icon.appendChild(badge);
            }
            badge.textContent = getCartCount();
        });
    }

    // Cart detail logic (unchanged)
    function getCartItems() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }
    function addToCart(item) {
        let items = getCartItems();
        const existingIndex = items.findIndex(cartItem => cartItem.name === item.name);
        
        if (existingIndex >= 0) {
            items[existingIndex].qty = item.qty;
        } else {
            items.push(item);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(items));
        
        const totalCount = items.reduce((sum, cartItem) => sum + cartItem.qty, 0);
        setCartCount(totalCount);
    }
    function removeFromCart(itemName) {
        let items = getCartItems();
        items = items.filter(item => item.name !== itemName);
        localStorage.setItem('cartItems', JSON.stringify(items));
        
        const totalCount = items.reduce((sum, cartItem) => sum + cartItem.qty, 0);
        setCartCount(totalCount);
    }
    function clearCart() {
        localStorage.removeItem('cartItems');
        localStorage.setItem('cartCount', 0);
        updateCartIcon();
        refreshCartDisplay();
    }

    // Cart panel logic
    const cartBtn = document.getElementById('cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    const cartContent = document.getElementById('cart-content');

    function openCart() {
        cartPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        refreshCartDisplay();
    }

    function closeCart() {
        cartPopup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ✅ FIXED: Check login status function
    function checkUserLoginStatus() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            return !!(userData && userData.email);
        } catch (e) {
            console.error('Error checking login status:', e);
            return false;
        }
    }

    function refreshCartDisplay() {
        const items = getCartItems();
        // ✅ FIXED: Move isLoggedIn check to top level
        const isLoggedIn = checkUserLoginStatus();
        
        if (items.length > 0) {
            let cartHTML = `
                <div class="cart-header">
                    <h3>
                        Keranjang Belanja
                        <button class="cart-close-btn" id="cart-close">×</button>
                    </h3>
                </div>
                <div class="cart-content-wrapper">
            `;
            
            let totalPrice = 0;
            
            items.forEach((item, index) => {
                const itemTotal = item.price * item.qty;
                totalPrice += itemTotal;
                
                cartHTML += `
                    <div class="cart-item">
                        <p class="cart-item-name">${item.name}</p>
                        <div class="cart-item-details">
                            <span class="cart-item-price">
                                Rp ${item.price.toLocaleString()} × ${item.qty}<br>
                                <span class="cart-item-total">Rp ${itemTotal.toLocaleString()}</span>
                            </span>
                            <button class="cart-delete-btn hapus-cart-item" data-item-name="${item.name}">
                                <i data-feather="trash-2"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            cartHTML += `
                <div class="cart-total-section">
                    <span class="cart-total-label">Total Belanja:</span><br>
                    <span class="cart-total-amount">Rp ${totalPrice.toLocaleString()}</span>
                </div>
            </div>
            <div class="cart-actions">
                <button 
                    class="cart-checkout-btn${!isLoggedIn ? ' disabled-checkout' : ''}" 
                    id="cart-checkout-btn"
                    ${!isLoggedIn ? 'disabled' : ''}
                    type="button"
                >
                    Checkout Sekarang
                </button>
                <button class="cart-clear-btn" id="cart-clear">Kosongkan Keranjang</button>
            </div>
            `;
            
            cartContent.innerHTML = cartHTML;
            
            // ✅ FIXED: Add event listeners immediately after innerHTML
            setupCartEventListeners(isLoggedIn);
            
        } else {
            cartContent.innerHTML = `
                <div class="cart-header">
                    <h3>
                        Keranjang Belanja
                        <button class="cart-close-btn" id="cart-close">×</button>
                    </h3>
                </div>
                <div class="cart-content-wrapper">
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <p class="cart-empty-text">Keranjang Anda masih kosong</p>
                    </div>
                </div>
            `;
            
            // Add close button listener for empty cart
            const closeBtn = document.getElementById('cart-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeCart);
            }
        }
        
        // Render feather icons
        if (window.feather) feather.replace();
    }

    // ✅ FIXED: Separate function untuk setup event listeners
    function setupCartEventListeners(isLoggedIn) {
        // Close button
        const closeBtn = document.getElementById('cart-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCart);
        }

        // Clear cart button
        const clearBtn = document.getElementById('cart-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCart);
        }

        // Delete item buttons
        const deleteButtons = document.querySelectorAll('.hapus-cart-item');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.getAttribute('data-item-name');
                removeFromCart(itemName);
                refreshCartDisplay();
            });
        });

        // ✅ FIXED: Checkout button logic
        const checkoutBtn = document.getElementById('cart-checkout-btn');
        if (checkoutBtn) {
            console.log('Setting up checkout button, isLoggedIn:', isLoggedIn); // Debug

            if (!isLoggedIn) {
                // User belum login - disable dan tampilkan tooltip
                checkoutBtn.addEventListener('mouseenter', function () {
                    this.setAttribute('data-tooltip', 'Harap login dahulu');
                });
                checkoutBtn.addEventListener('mouseleave', function () {
                    this.removeAttribute('data-tooltip');
                });
                checkoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Checkout blocked - user not logged in'); // Debug
                    return false;
                });
            } else {
                // User sudah login - enable checkout
                checkoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    console.log('Checkout clicked - redirecting to checkout.html'); // Debug
                    window.location.href = 'checkout.html';
                });
            }
        } else {
            console.error('Checkout button not found!'); // Debug
        }
    }

    if (cartBtn && cartPopup && cartContent) {
        cartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });

        // Close cart with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && cartPopup.classList.contains('active')) {
                closeCart();
            }
        });
    }

    // Expose for other scripts
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;
    window.getCartItems = getCartItems;
    window.updateCartIcon = updateCartIcon;
    window.getCartCount = getCartCount;

    updateCartIcon();
});