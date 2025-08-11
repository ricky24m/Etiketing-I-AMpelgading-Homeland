<?php
header('Content-Type: application/json');
require_once '../koneksi.php';

$result = $conn->query("SELECT * FROM alat_camping WHERE status='aktif' ORDER BY nama_alat ASC");
$data = [];
while ($row = $result->fetch_assoc()) {
    $row['gambar_url'] = $row['gambar'] ? 'images/alat-camping/' . $row['gambar'] : 'images/placeholder.jpg';
    $data[] = $row;
}
echo json_encode(['success'=>true, 'data'=>$data]);
$conn->close();
?>