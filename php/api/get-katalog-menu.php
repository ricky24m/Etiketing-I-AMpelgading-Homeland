<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// 🎯 FIX: Correct path to koneksi.php
require_once '../koneksi.php';

try {
    // Query hanya mengambil data yang diperlukan untuk katalog (tanpa deskripsi dan harga)
    $sql = "SELECT id, nama_menu, gambar, link_halaman, kategori 
            FROM katalog_menu 
            WHERE status = 'aktif' 
            ORDER BY urutan ASC, nama_menu ASC";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $menus = [];
        while ($row = $result->fetch_assoc()) {
            // Proses path gambar dengan fallback
            $imagePath = $row['gambar'];
            
            // Jika tidak dimulai dengan 'images/', tambahkan prefix
            if (!str_starts_with($imagePath, 'images/')) {
                // 🎯 FIX: Correct path to images folder
                if (file_exists("../../images/menu/" . $imagePath)) {
                    $row['gambar_url'] = 'images/menu/' . $imagePath;
                } 
                // Fallback ke images/ langsung
                elseif (file_exists("../../images/" . $imagePath)) {
                    $row['gambar_url'] = 'images/' . $imagePath;
                } 
                // Default fallback image
                else {
                    $row['gambar_url'] = 'images/placeholder.jpg';
                }
            } else {
                // Path sudah lengkap
                $row['gambar_url'] = $imagePath;
            }
            
            // Cek apakah file gambar benar-benar exist
            if (!file_exists("../../" . $row['gambar_url'])) {
                $row['gambar_url'] = 'images/placeholder.jpg';
                error_log("Image not found: " . $row['gambar_url'] . " for menu: " . $row['nama_menu']);
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