<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../../../php/koneksi.php';

try {
    // Query dari tabel tunggal
    $sql = "SELECT * FROM katalog_menu_fix ORDER BY nama_menu ASC";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $menus = [];
        while ($row = $result->fetch_assoc()) {
            // Proses path gambar
            $imagePath = $row['gambar'];
            
            if (!empty($imagePath)) {
                if (strpos($imagePath, 'images/') === 0) {
                    $row['gambar_url'] = '../' . $imagePath;
                } else {
                    $row['gambar_url'] = '../images/menu/' . $imagePath;
                }
            } else {
                $row['gambar_url'] = '../images/placeholder.jpg';
            }
            
            $menus[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $menus
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Tidak ada menu tersedia'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}

$conn->close();
?>