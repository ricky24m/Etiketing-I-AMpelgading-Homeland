<?php
session_start();
header('Content-Type: application/json');

// Check admin session
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../../../php/koneksi.php';

try {
    $menuId = $_POST['menu_id'] ?? null;
    $namaMenu = $_POST['nama_menu'] ?? '';
    $kategori = $_POST['kategori'] ?? '';
    $status = $_POST['status'] ?? 'aktif';
    $waktu = $_POST['waktu'] ?? '';
    $harga = (int)($_POST['harga'] ?? 0);
    $satuan = $_POST['satuan'] ?? '';
    $keterangan = $_POST['keterangan'] ?? '';
    
    // Handle file upload
    $gambarName = null;
    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../../images/menu/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileExt = strtolower(pathinfo($_FILES['gambar']['name'], PATHINFO_EXTENSION));
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (in_array($fileExt, $allowedExts)) {
            $gambarName = time() . '_' . uniqid() . '.' . $fileExt;
            $uploadPath = $uploadDir . $gambarName;
            
            if (!move_uploaded_file($_FILES['gambar']['tmp_name'], $uploadPath)) {
                throw new Exception('Gagal upload gambar');
            }
        } else {
            throw new Exception('Format gambar tidak valid. Gunakan: jpg, jpeg, png, gif');
        }
    }
    
    if ($menuId) {
        // UPDATE existing menu - TABEL TUNGGAL
        $sql = "UPDATE katalog_menu_fix SET 
                nama_menu = ?, kategori = ?, status = ?, 
                waktu = ?, harga = ?, satuan = ?, keterangan = ?";
        $params = [$namaMenu, $kategori, $status, $waktu, $harga, $satuan, $keterangan];
        $types = "ssssiss";
        
        if ($gambarName) {
            $sql .= ", gambar = ?";
            $params[] = $gambarName;
            $types .= "s";
        }
        
        $sql .= " WHERE id = ?";
        $params[] = $menuId;
        $types .= "i";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        
    } else {
        // INSERT new menu - TABEL TUNGGAL
        if (!$gambarName) {
            throw new Exception('Gambar harus diupload untuk menu baru');
        }
        
        $stmt = $conn->prepare("INSERT INTO katalog_menu_fix (nama_menu, gambar, kategori, status, waktu, harga, satuan, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssisis", $namaMenu, $gambarName, $kategori, $status, $waktu, $harga, $satuan, $keterangan);
        $stmt->execute();
    }
    
    echo json_encode([
        'success' => true,
        'message' => $menuId ? 'Menu berhasil diupdate' : 'Menu berhasil ditambahkan'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>