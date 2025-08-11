<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../../../php/koneksi.php';

try {
    $alatId = $_POST['id'] ?? null;
    
    if (!$alatId) {
        throw new Exception('ID alat tidak valid');
    }
    
    // Get gambar name untuk dihapus
    $stmt = $conn->prepare("SELECT gambar FROM alat_camping WHERE id = ?");
    $stmt->bind_param("i", $alatId);
    $stmt->execute();
    $result = $stmt->get_result();
    $alat = $result->fetch_assoc();
    
    if (!$alat) {
        throw new Exception('Alat tidak ditemukan');
    }
    
    // Delete from alat_camping
    $deleteStmt = $conn->prepare("DELETE FROM alat_camping WHERE id = ?");
    $deleteStmt->bind_param("i", $alatId);
    $deleteStmt->execute();
    
    // Hapus file gambar
    if ($alat['gambar']) {
        $imagePath = '../../../images/alat-camping/' . $alat['gambar'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Alat berhasil dihapus'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>