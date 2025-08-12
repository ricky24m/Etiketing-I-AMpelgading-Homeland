<?php
// filepath: php/api/get-detail-menu.php
header('Content-Type: application/json');
require_once '../koneksi.php';

$id = $_GET['id'] ?? 0;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM katalog_menu_fix WHERE id = ? AND status = 'aktif'");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $menu = $result->fetch_assoc();

    if ($menu) {
        $gambarDb = $menu['gambar'];
        
        // ✅ PERBAIKAN: Set gambar_url berdasarkan path yang benar-benar ada
        if (!empty($gambarDb)) {
            // Cek file di folder menu dulu
            if (file_exists("../../images/menu/" . $gambarDb)) {
                $menu['gambar_url'] = 'images/menu/' . $gambarDb;
            }
            // Jika tidak ada, cek di folder images
            elseif (file_exists("../../images/" . $gambarDb)) {
                $menu['gambar_url'] = 'images/' . $gambarDb;
            }
            // Jika tetap tidak ada, gunakan placeholder
            else {
                $menu['gambar_url'] = 'images/placeholder.svg';
            }
        } else {
            $menu['gambar_url'] = 'images/placeholder.svg';
        }
        
        echo json_encode(['success' => true, 'data' => $menu]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Menu tidak ditemukan']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>