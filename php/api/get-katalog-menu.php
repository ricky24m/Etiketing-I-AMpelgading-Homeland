<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../koneksi.php';

try {
    // Query dari tabel baru - hanya ambil data yang diperlukan untuk katalog
    $sql = "SELECT id, nama_menu, gambar, kategori
            FROM katalog_menu_fix 
            WHERE status = 'aktif' 
            ORDER BY nama_menu ASC";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $menus = [];
        while ($row = $result->fetch_assoc()) {
            // Proses path gambar dengan fallback
            $imagePath = $row['gambar'];
            
            if (!str_starts_with($imagePath, 'images/')) {
                if (file_exists("../../images/menu/" . $imagePath)) {
                    $row['gambar_url'] = 'images/menu/' . $imagePath;
                } 
                elseif (file_exists("../../images/" . $imagePath)) {
                    $row['gambar_url'] = 'images/' . $imagePath;
                } 
                else {
                    $row['gambar_url'] = 'images/placeholder.jpg';
                }
            } else {
                $row['gambar_url'] = $imagePath;
            }
            
            // Cek apakah file gambar benar-benar exist
            if (!file_exists("../../" . $row['gambar_url'])) {
                $row['gambar_url'] = 'images/placeholder.jpg';
            }
            
            $menus[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $menus,
            'count' => count($menus)
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [],
            'count' => 0,
            'message' => 'Tidak ada menu tersedia'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Get katalog menu error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}

$conn->close();
?>