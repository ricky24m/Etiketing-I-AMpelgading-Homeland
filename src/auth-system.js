document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth system
    initAuthSystem();
    
    function initAuthSystem() {
        // Check if user is logged in first
        checkLoginStatus();
        
        // Then bind events based on current state
        bindAuthEvents();
    }
    
    function bindAuthEvents() {
        const loginBtn = document.getElementById('hero-login-btn');
        const registerBtn = document.getElementById('hero-register-btn');
        
        // Remove any existing event listeners by cloning
        if (loginBtn) {
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            // Check current state and bind appropriate event
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            if (userData && userData.email) {
                newLoginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showUserMenu(userData);
                });
            } else {
                newLoginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showLoginModal();
                });
            }
        }
        
        if (registerBtn) {
            const newRegisterBtn = registerBtn.cloneNode(true);
            registerBtn.parentNode.replaceChild(newRegisterBtn, registerBtn);
            
            // Check current state and bind appropriate event
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            if (userData && userData.email) {
                newRegisterBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleLogout();
                });
            } else {
                newRegisterBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showRegisterModal();
                });
            }
        }
    }
    
    function checkLoginStatus() {
        const userData = JSON.parse(localStorage.getItem('userData') || 'null');
        if (userData && userData.email) {
            updateUIForLoggedInUser(userData);
        } else {
            updateUIForLoggedOutUser();
        }
    }
    
    function updateUIForLoggedInUser(userData) {
        console.log('Updating UI for logged in user:', userData.nama_lengkap); // Debug
        
        const loginBtn = document.getElementById('hero-login-btn');
        const registerBtn = document.getElementById('hero-register-btn');
        
        if (loginBtn) {
            loginBtn.innerHTML = `
                <i data-feather="user"></i>
                <span>${userData.nama_lengkap.split(' ')[0]}</span>
            `;
        }
        
        if (registerBtn) {
            registerBtn.innerHTML = `
                <i data-feather="log-out"></i>
                <span>Logout</span>
            `;
        }
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Re-bind events after UI update
        setTimeout(() => bindAuthEvents(), 100);
    }
    
    function updateUIForLoggedOutUser() {
        console.log('Updating UI for logged out user'); // Debug
        
        const loginBtn = document.getElementById('hero-login-btn');
        const registerBtn = document.getElementById('hero-register-btn');
        
        if (loginBtn) {
            loginBtn.innerHTML = `
                <span>Login</span>
            `;
        }
        
        if (registerBtn) {
            registerBtn.innerHTML = `
                <span>Daftar</span>
            `;
        }
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Re-bind events after UI update
        setTimeout(() => bindAuthEvents(), 100);
    }
    
    function showLoginModal() {
        console.log('Showing login modal'); // Debug
        
        Swal.fire({
            title: 'Masuk ke Akun Anda',
            html: `
                <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <div class="auth-form-group">
                        <label class="auth-form-label">Email:</label>
                        <input type="email" id="login-email" class="auth-form-input" 
                               placeholder="Masukkan email Anda" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Password:</label>
                        <input type="password" id="login-password" class="auth-form-input" 
                               placeholder="Masukkan password Anda" required>
                    </div>
                    <div class="auth-form-checkbox">
                        <input type="checkbox" id="remember-me">
                        <label for="remember-me">Ingat saya selama 30 hari</label>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Masuk',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#16A34A',
            cancelButtonColor: '#6b7280',
            width: '500px',
            customClass: {
                popup: 'auth-modal'
            },
            footer: `
                <a href="#" class="forgot-password-link" onclick="showForgotPasswordModal()">
                    Lupa password?
                </a>
            `,
            preConfirm: () => {
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                const rememberMe = document.getElementById('remember-me').checked;
                
                if (!email || !password) {
                    Swal.showValidationMessage('Mohon lengkapi email dan password');
                    return false;
                }
                
                if (!isValidEmail(email)) {
                    Swal.showValidationMessage('Format email tidak valid');
                    return false;
                }
                
                return { email, password, rememberMe };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogin(result.value);
            }
        });
    }
    
    function showRegisterModal() {
        console.log('Showing register modal'); // Debug
        
        Swal.fire({
            title: 'Buat Akun Baru',
            html: `
                <div style="text-align: left; max-width: 450px; margin: 0 auto;">
                    <div class="auth-form-group">
                        <label class="auth-form-label">Nama Lengkap:</label>
                        <input type="text" id="register-nama" class="auth-form-input" 
                               placeholder="Masukkan nama lengkap" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">NIK:</label>
                        <input type="text" id="register-nik" class="auth-form-input" 
                               placeholder="Masukkan NIK 16 digit" maxlength="16" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Nomor Telepon:</label>
                        <input type="tel" id="register-phone" class="auth-form-input" 
                               placeholder="Contoh: 081234567890" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Email:</label>
                        <input type="email" id="register-email" class="auth-form-input" 
                               placeholder="Masukkan email aktif" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Password:</label>
                        <input type="password" id="register-password" class="auth-form-input" 
                               placeholder="Minimal 6 karakter" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Konfirmasi Password:</label>
                        <input type="password" id="register-confirm-password" class="auth-form-input" 
                               placeholder="Ulangi password" required>
                    </div>
                    <div class="auth-form-checkbox">
                        <input type="checkbox" id="agree-terms" required>
                        <label for="agree-terms">
                            Saya setuju dengan 
                            <a href="#" onclick="showTermsModal()">Syarat & Ketentuan</a> 
                            dan <a href="#" onclick="showPrivacyModal()">Kebijakan Privasi</a>
                        </label>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Daftar',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#16A34A',
            cancelButtonColor: '#6b7280',
            width: '550px',
            customClass: {
                popup: 'auth-modal'
            },
            preConfirm: () => {
                const nama = document.getElementById('register-nama').value.trim();
                const nik = document.getElementById('register-nik').value.trim();
                const phone = document.getElementById('register-phone').value.trim();
                const email = document.getElementById('register-email').value.trim();
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                const agreeTerms = document.getElementById('agree-terms').checked;
                
                // Validations
                if (!nama || !nik || !phone || !email || !password || !confirmPassword) {
                    Swal.showValidationMessage('Mohon lengkapi semua field');
                    return false;
                }
                
                if (nik.length !== 16 || !/^\d+$/.test(nik)) {
                    Swal.showValidationMessage('NIK harus 16 digit angka');
                    return false;
                }
                
                if (!/^08\d{8,11}$/.test(phone)) {
                    Swal.showValidationMessage('Format nomor telepon tidak valid (contoh: 081234567890)');
                    return false;
                }
                
                if (!isValidEmail(email)) {
                    Swal.showValidationMessage('Format email tidak valid');
                    return false;
                }
                
                if (password.length < 6) {
                    Swal.showValidationMessage('Password minimal 6 karakter');
                    return false;
                }
                
                if (password !== confirmPassword) {
                    Swal.showValidationMessage('Konfirmasi password tidak cocok');
                    return false;
                }
                
                if (!agreeTerms) {
                    Swal.showValidationMessage('Mohon setujui syarat dan ketentuan');
                    return false;
                }
                
                return { nama, nik, phone, email, password };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleRegister(result.value);
            }
        });
    }
    
    function handleLogin(loginData) {
        console.log('Handling login...'); // Debug
        
        // Show loading
        Swal.fire({
            title: 'Memproses Login...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Send login request
        fetch('php/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login response:', data); // Debug
            
            if (data.success) {
                // Store user data
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                if (loginData.rememberMe) {
                    localStorage.setItem('rememberLogin', 'true');
                }
                
                // Update UI for logged in state
                updateUIForLoggedInUser(data.user);
                
                // Show success
                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil!',
                    text: `Selamat datang kembali, ${data.user.nama_lengkap}!`,
                    confirmButtonColor: '#16A34A',
                    timer: 2000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: data.message || 'Email atau password salah',
                    confirmButtonColor: '#dc2626'
                });
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Tidak dapat terhubung ke server. Coba lagi nanti.',
                confirmButtonColor: '#dc2626'
            });
        });
    }
    
    function handleRegister(registerData) {
        console.log('Handling register...'); // Debug
        
        // Show loading
        Swal.fire({
            title: 'Membuat Akun...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Send register request
        fetch('php/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registrasi Berhasil!',
                    html: `
                        <p>Akun Anda telah berhasil dibuat.</p>
                        <p><strong>Silakan login untuk melanjutkan.</strong></p>
                    `,
                    confirmButtonColor: '#16A34A',
                    confirmButtonText: 'Login Sekarang'
                }).then(() => {
                    showLoginModal();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registrasi Gagal',
                    text: data.message || 'Terjadi kesalahan saat membuat akun',
                    confirmButtonColor: '#dc2626'
                });
            }
        })
        .catch(error => {
            console.error('Register error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Tidak dapat terhubung ke server. Coba lagi nanti.',
                confirmButtonColor: '#dc2626'
            });
        });
    }
    
    function handleLogout() {
        console.log('Handling logout...'); // Debug
        
        Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('User confirmed logout'); // Debug
                
                // Clear stored data
                localStorage.removeItem('userData');
                localStorage.removeItem('rememberLogin');
                
                // Update UI for logged out state
                updateUIForLoggedOutUser();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Logout Berhasil',
                    text: 'Anda telah berhasil keluar dari akun.',
                    confirmButtonColor: '#16A34A',
                    timer: 1500,
                    timerProgressBar: true
                });
            }
        });
    }
    
    function showUserMenu(userData) {
        console.log('Showing user menu for:', userData.nama_lengkap); // Debug
        
        Swal.fire({
            title: 'Profil Pengguna',
            html: `
                <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="width: 60px; height: 60px; background: #16A34A; border-radius: 50%; 
                                    display: inline-flex; align-items: center; justify-content: center; 
                                    color: white; font-size: 24px; font-weight: bold;">
                            ${userData.nama_lengkap.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <p><strong>Nama:</strong> ${userData.nama_lengkap}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                    <p><strong>NIK:</strong> ${userData.nik}</p>
                    <p><strong>Telepon:</strong> ${userData.nomor_telepon}</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Edit Profil',
            cancelButtonText: 'Tutup',
            confirmButtonColor: '#16A34A',
            cancelButtonColor: '#6b7280'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    title: 'Fitur Dalam Pengembangan',
                    text: 'Fitur edit profil sedang dalam pengembangan.',
                    confirmButtonColor: '#16A34A'
                });
            }
        });
    }
    
    function showForgotPasswordModal() {
        Swal.fire({
            title: 'Reset Password',
            html: `
                <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <p style="text-align: center; color: #666; margin-bottom: 20px;">
                        Masukkan email Anda untuk menerima link reset password
                    </p>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Email:</label>
                        <input type="email" id="forgot-email" class="auth-form-input" 
                               placeholder="Masukkan email terdaftar" required>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Kirim Link Reset',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#16A34A',
            cancelButtonColor: '#6b7280',
            customClass: {
                popup: 'auth-modal'
            },
            preConfirm: () => {
                const email = document.getElementById('forgot-email').value.trim();
                
                if (!email) {
                    Swal.showValidationMessage('Mohon masukkan email');
                    return false;
                }
                
                if (!isValidEmail(email)) {
                    Swal.showValidationMessage('Format email tidak valid');
                    return false;
                }
                
                return { email };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    title: 'Fitur Dalam Pengembangan',
                    text: 'Fitur reset password sedang dalam pengembangan. Silakan hubungi admin untuk bantuan.',
                    confirmButtonColor: '#16A34A'
                });
            }
        });
    }
    
    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Global functions for modal links
    window.showForgotPasswordModal = showForgotPasswordModal;
    window.showTermsModal = () => {
        Swal.fire({
            title: 'Syarat & Ketentuan',
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <h4>1. Ketentuan Umum</h4>
                    <p>Dengan mendaftar, Anda setuju untuk mematuhi semua aturan yang berlaku.</p>
                    
                    <h4>2. Privasi Data</h4>
                    <p>Data pribadi Anda akan dijaga kerahasiaannya sesuai kebijakan privasi.</p>
                    
                    <h4>3. Tanggung Jawab Pengguna</h4>
                    <p>Pengguna bertanggung jawab atas keakuratan data yang diberikan.</p>
                </div>
            `,
            confirmButtonText: 'Saya Mengerti',
            confirmButtonColor: '#16A34A'
        });
    };
    
    window.showPrivacyModal = () => {
        Swal.fire({
            title: 'Kebijakan Privasi',
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <h4>Pengumpulan Data</h4>
                    <p>Kami mengumpulkan data yang diperlukan untuk layanan booking.</p>
                    
                    <h4>Penggunaan Data</h4>
                    <p>Data digunakan untuk memproses booking dan komunikasi dengan pelanggan.</p>
                    
                    <h4>Keamanan Data</h4>
                    <p>Kami menggunakan enkripsi untuk melindungi data pribadi Anda.</p>
                </div>
            `,
            confirmButtonText: 'Saya Mengerti',
            confirmButtonColor: '#16A34A'
        });
    };
    
    // Expose functions for debugging
    window.debugAuth = {
        checkLoginStatus,
        updateUIForLoggedInUser,
        updateUIForLoggedOutUser,
        bindAuthEvents
    };
});