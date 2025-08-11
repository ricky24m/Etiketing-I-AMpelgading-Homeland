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
    
    if (!$menuId) {
        throw new Exception('ID menu tidak valid');
    }
    
    // Get gambar name untuk dihapus
    $stmt = $conn->prepare("SELECT gambar FROM katalog_menu_fix WHERE id = ?");
    $stmt->bind_param("i", $menuId);
    $stmt->execute();
    $result = $stmt->get_result();
    $menu = $result->fetch_assoc();
    
    if (!$menu) {
        throw new Exception('Menu tidak ditemukan');
    }
    
    // Delete from katalog_menu_fix (tabel tunggal)
    $deleteStmt = $conn->prepare("DELETE FROM katalog_menu_fix WHERE id = ?");
    $deleteStmt->bind_param("i", $menuId);
    $deleteStmt->execute();
    
    // Hapus file gambar
    if ($menu['gambar']) {
        $imagePath = '../../../images/menu/' . $menu['gambar'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Menu berhasil dihapus'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>