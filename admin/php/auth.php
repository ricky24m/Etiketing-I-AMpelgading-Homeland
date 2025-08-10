<?php
session_start();
header('Content-Type: application/json');

require_once '../../php/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Login
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username dan password harus diisi']);
        exit;
    }
    
    try {
        // ✅ Query tanpa enkripsi password - langsung compare plain text
        $stmt = $conn->prepare("SELECT id, username, email, nama_lengkap, password, is_active FROM admin_users WHERE username = ? AND password = ? AND is_active = 1");
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
            exit;
        }
        
        $admin = $result->fetch_assoc();
        
        // Update last login
        $updateStmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
        $updateStmt->bind_param("i", $admin['id']);
        $updateStmt->execute();
        
        // Set session
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_name'] = $admin['nama_lengkap'];
        $_SESSION['admin_email'] = $admin['email'];
        
        // Hapus password dari response
        unset($admin['password']);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Login berhasil',
            'admin' => $admin
        ]);
        
    } catch (Exception $e) {
        error_log("Admin login error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan sistem']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Logout
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logout berhasil']);
    
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak valid']);
}
?>