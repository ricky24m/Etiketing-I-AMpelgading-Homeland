document.addEventListener('DOMContentLoaded', function () {
    // Auto-fill form jika user sudah login
    autoFillCheckoutForm();
    
    // Calendar functionality
    let currentDate = new Date();
    let selectedDate = null;
    
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        document.getElementById('current-month').textContent = 
            `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Previous month days
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            const dayEl = createDayElement(day, true, false);
            calendarDays.appendChild(dayEl);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = createDayElement(day, false, true);
            calendarDays.appendChild(dayEl);
        }
        
        // Next month days
        const remainingCells = 42 - (startingDay + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = createDayElement(day, true, false);
            calendarDays.appendChild(dayEl);
        }
    }
    
    function createDayElement(day, otherMonth, currentMonth) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        if (otherMonth) {
            dayEl.classList.add('other-month');
        }
        
        const today = new Date();
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        if (currentMonth && dayDate < today) {
            dayEl.classList.add('disabled');
        }
        
        // Hapus keterangan kuota orang
        dayEl.innerHTML = `
            <span class="day-number">${day}</span>
        `;
        
        if (currentMonth && dayDate >= today) {
            dayEl.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                dayEl.classList.add('selected');
                selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                updateSelectedDate();
            });
        }
        
        return dayEl;
    }
    
    function updateSelectedDate() {
        const display = document.getElementById('selected-date-display');
        if (selectedDate) {
            const formatted = selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            display.textContent = formatted;
        } else {
            display.textContent = 'Belum dipilih';
        }
    }
    
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Cart functionality
    function getCartItems() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }
    
    function renderCartSummary() {
        const cartItems = getCartItems();
        const summaryDiv = document.getElementById('cart-items-summary');
        const totalDiv = document.getElementById('total-amount');
        
        if (cartItems.length === 0) {
            summaryDiv.innerHTML = '<p>Keranjang Anda kosong.</p>';
            totalDiv.textContent = '';
            return;
        }
        
        let total = 0;
        let summaryHTML = '';
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            summaryHTML += `<p>${item.name} × ${item.qty} = Rp ${itemTotal.toLocaleString()}</p>`;
        });
        
        summaryDiv.innerHTML = summaryHTML;
        totalDiv.textContent = `Total: Rp ${total.toLocaleString()}`;
    }
    
    // Form submission dengan validasi tanggal yang lebih baik
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validasi cart
        const cartItems = getCartItems();
        if (cartItems.length === 0) {
            alert('Keranjang Anda kosong. Silakan pilih pesanan terlebih dahulu.');
            return;
        }
        
        // Validasi tanggal
        if (!selectedDate) {
            alert('Silakan pilih tanggal booking terlebih dahulu.');
            return;
        }
        
        console.log('Selected date:', selectedDate); // Debug log
        
        // Ambil data form
        const formData = {
            nama: document.getElementById('checkout-nama').value.trim(),
            nik: document.getElementById('checkout-nik').value.trim(),
            phone: document.getElementById('checkout-phone').value.trim(),
            emergency: document.getElementById('checkout-emergency').value.trim(),
            email: document.getElementById('checkout-email').value.trim()
        };
        
        // Validasi form
        for (let key in formData) {
            if (!formData[key]) {
                alert('Mohon lengkapi semua data.');
                return;
            }
        }
        
        // Disable button untuk mencegah double submit
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';
        
        // Hitung total
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.price * item.qty;
        });
        
        console.log('Cart items:', cartItems); // Debug log
        console.log('Total amount:', totalAmount); // Debug log
        
        // Prepare data untuk dikirim
        const postData = {
            nama: formData.nama,
            email: formData.email,
            nik: formData.nik,
            phone: formData.phone,
            emergency: formData.emergency,
            tanggal: selectedDate.toISOString(), // Format ISO untuk konsistensi
            items: cartItems.map(item => `${item.name} x ${item.qty}`).join(', '),
            total: totalAmount
        };
        
        console.log('Sending data:', postData); // Debug log
        
        // Send request ke placeOrder.php
        fetch('php/placeOrder.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(postData)
        })
        .then(response => {
            console.log('Response status:', response.status); // Debug log
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data); // Debug log
            
            if (data.success && data.snap_token) {
                window.snap.pay(data.snap_token, {
                    onSuccess: function(result) {
                        console.log('Payment success:', result);
                        alert('Pembayaran berhasil!');
                        
                        // Clear cart and redirect
                        localStorage.removeItem('cartItems');
                        window.location.href = 'index.html';
                    },
                    onPending: function(result) {
                        console.log('Payment pending:', result);
                        alert('Pembayaran tertunda. Silakan selesaikan pembayaran.');
                    },
                    onError: function(result) {
                        console.log('Payment error:', result);
                        alert('Pembayaran gagal. Silakan coba lagi.');
                    }
                });
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        })
        .finally(() => {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
    
    function autoFillCheckoutForm() {
        const userData = JSON.parse(localStorage.getItem('userData') || 'null');
        
        if (userData && userData.email) {
            const namaField = document.getElementById('checkout-nama');
            const nikField = document.getElementById('checkout-nik');
            const phoneField = document.getElementById('checkout-phone');
            const emailField = document.getElementById('checkout-email');
            
            if (namaField) {
                namaField.value = userData.nama_lengkap;
                namaField.style.backgroundColor = '#f0f9ff';
                namaField.style.borderColor = '#16A34A';
            }
            
            if (nikField) {
                nikField.value = userData.nik;
                nikField.style.backgroundColor = '#f0f9ff';
                nikField.style.borderColor = '#16A34A';
            }
            
            if (phoneField) {
                phoneField.value = userData.nomor_telepon;
                phoneField.style.backgroundColor = '#f0f9ff';
                phoneField.style.borderColor = '#16A34A';
            }
            
            if (emailField) {
                emailField.value = userData.email;
                emailField.style.backgroundColor = '#f0f9ff';
                emailField.style.borderColor = '#16A34A';
            }
            
            // Tampilkan notifikasi bahwa data diambil dari profil
            const notification = document.createElement('div');
            notification.style.cssText = `
                background: #e0f7e9;
                border: 1px solid #16A34A;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 20px;
                color: #065F46;
                font-size: 0.9rem;
                text-align: center;
            `;
            notification.innerHTML = `
                <i data-feather="check-circle" style="width: 16px; height: 16px; margin-right: 8px;"></i>
                Data diambil dari profil Anda. Jika ada perubahan, silakan edit di menu profil.
            `;
            
            const form = document.querySelector('.booking-form');
            if (form) {
                form.insertBefore(notification, form.firstChild);
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }
    }
    
    // Initialize
    renderCalendar();
    renderCartSummary();
    updateSelectedDate();
});