<?php
// filepath: c:\xampp\htdocs\etiket-coba\php\auth\register.php
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
    
    $nama = trim($input['nama'] ?? '');
    $nik = trim($input['nik'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validate input
    if (empty($nama) || empty($nik) || empty($phone) || empty($email) || empty($password)) {
        throw new Exception('Semua field harus diisi');
    }
    
    // Validate NIK (16 digits)
    if (!preg_match('/^\d{16}$/', $nik)) {
        throw new Exception('NIK harus 16 digit angka');
    }
    
    // Validate phone number
    if (!preg_match('/^08\d{8,11}$/', $phone)) {
        throw new Exception('Format nomor telepon tidak valid (contoh: 081234567890)');
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Format email tidak valid');
    }
    
    // Validate password
    if (strlen($password) < 6) {
        throw new Exception('Password minimal 6 karakter');
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception('Email sudah terdaftar. Silakan gunakan email lain.');
    }
    
    // Check if NIK already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE nik = ?");
    $stmt->bind_param("s", $nik);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception('NIK sudah terdaftar. Setiap NIK hanya dapat didaftarkan sekali.');
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user into database
    $stmt = $conn->prepare("INSERT INTO users (nama_lengkap, nik, nomor_telepon, email, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nama, $nik, $phone, $email, $hashedPassword);
    
    if (!$stmt->execute()) {
        throw new Exception('Gagal menyimpan data. Coba lagi nanti.');
    }
    
    $userId = $conn->insert_id;
    
    // Log registration
    error_log("New user registered: ID {$userId}, Email: {$email}, Name: {$nama}");
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Registrasi berhasil',
        'user_id' => $userId
    ]);
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    
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