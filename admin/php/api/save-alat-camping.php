<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit;
}
require_once '../../../php/koneksi.php';

$id = $_POST['id'] ?? null;
$nama = $_POST['nama_alat'] ?? '';
$harga = (int)($_POST['harga'] ?? 0);
$satuan = $_POST['satuan'] ?? 'per hari';
$keterangan = $_POST['keterangan'] ?? '';
$status = $_POST['status'] ?? 'aktif';

// Handle upload gambar
$gambarName = null;
if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../../images/alat-camping/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    $fileExt = strtolower(pathinfo($_FILES['gambar']['name'], PATHINFO_EXTENSION));
    $gambarName = time() . '_' . uniqid() . '.' . $fileExt;
    move_uploaded_file($_FILES['gambar']['tmp_name'], $uploadDir . $gambarName);
}

if ($id) {
    // Update
    $sql = "UPDATE alat_camping SET nama_alat=?, harga=?, satuan=?, keterangan=?, status=?";
    $params = [$nama, $harga, $satuan, $keterangan, $status];
    $types = "sisss";
    if ($gambarName) {
        $sql .= ", gambar=?";
        $params[] = $gambarName;
        $types .= "s";
    }
    $sql .= " WHERE id=?";
    $params[] = $id;
    $types .= "i";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
} else {
    // Insert
    if (!$gambarName) { echo json_encode(['success'=>false,'message'=>'Gambar wajib diupload']); exit; }
    $stmt = $conn->prepare("INSERT INTO alat_camping (nama_alat, gambar, harga, satuan, keterangan, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssisss", $nama, $gambarName, $harga, $satuan, $keterangan, $status);
    $stmt->execute();
}
echo json_encode(['success'=>true]);
$conn->close();
?>