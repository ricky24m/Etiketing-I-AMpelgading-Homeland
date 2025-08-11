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
    // Query dari tabel tunggal
    $stmt = $conn->prepare("SELECT * FROM katalog_menu_fix WHERE id = ? AND status = 'aktif'");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $menu = $result->fetch_assoc();

    if ($menu) {
        // Proses gambar
        $imagePath = $menu['gambar'];
        
        if (!str_starts_with($imagePath, 'images/')) {
            if (file_exists("../images/menu/" . $imagePath)) {
                $menu['gambar_url'] = 'images/menu/' . $imagePath;
            } 
            elseif (file_exists("../images/" . $imagePath)) {
                $menu['gambar_url'] = 'images/' . $imagePath;
            } 
            else {
                $menu['gambar_url'] = 'images/placeholder.svg';
            }
        } else {
            $menu['gambar_url'] = $imagePath;
        }
        
        // Validasi file exists
        if (!file_exists("../" . $menu['gambar_url'])) {
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