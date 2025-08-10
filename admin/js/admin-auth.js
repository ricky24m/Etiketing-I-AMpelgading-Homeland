document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = document.querySelector('.login-page');
    const isDashboardPage = document.querySelector('.dashboard-page');
    
    if (isLoginPage) {
        initLoginPage();
    } else if (isDashboardPage) {
        initDashboardPage();
    }
    
    function initLoginPage() {
        const loginForm = document.getElementById('admin-login-form');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            fetch('php/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Berhasil!',
                        text: `Selamat datang, ${data.admin.nama_lengkap}`,
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'dashboard.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: data.message
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Tidak dapat terhubung ke server'
                });
            })
            .finally(() => {
                // Reset button
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            });
        });
    }
    
    function initDashboardPage() {
        checkSession();
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    function checkSession() {
        fetch('php/check-session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                window.location.href = 'index.html';
                return;
            }
            
            // Update user info in sidebar
            updateUserInfo(data.admin);
            
            // Store user data globally
            window.currentAdmin = data.admin;
        })
        .catch(error => {
            console.error('Session check error:', error);
            window.location.href = 'index.html';
        });
    }
    
    function updateUserInfo(admin) {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (userAvatar) userAvatar.textContent = admin.nama_lengkap.charAt(0).toUpperCase();
        if (userName) userName.textContent = admin.nama_lengkap;
    }
    
    function handleLogout() {
        Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('php/auth.php', {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    window.location.href = 'index.html';
                });
            }
        });
    }
});