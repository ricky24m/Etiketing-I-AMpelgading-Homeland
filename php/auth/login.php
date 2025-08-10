<?php
// filepath: c:\xampp\htdocs\etiket-coba\php\auth\login.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../koneksi.php';

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $rememberMe = $input['rememberMe'] ?? false;
    
    // Validate input
    if (empty($email) || empty($password)) {
        throw new Exception('Email dan password harus diisi');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Format email tidak valid');
    }
    
    // Check user in database
    $stmt = $conn->prepare("SELECT id, nama_lengkap, nik, nomor_telepon, email, password, is_active FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Email tidak terdaftar');
    }
    
    $user = $result->fetch_assoc();
    
    // Check if account is active
    if (!$user['is_active']) {
        throw new Exception('Akun Anda tidak aktif. Hubungi admin.');
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        throw new Exception('Password salah');
    }
    
    // Update last login
    $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateStmt->bind_param("i", $user['id']);
    $updateStmt->execute();
    
    // Remove password from response
    unset($user['password']);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login berhasil',
        'user' => $user
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>