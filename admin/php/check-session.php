<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Session tidak valid']);
    exit;
}

echo json_encode([
    'success' => true,
    'admin' => [
        'id' => $_SESSION['admin_id'],
        'username' => $_SESSION['admin_username'],
        'nama_lengkap' => $_SESSION['admin_name'],
        'email' => $_SESSION['admin_email']
    ]
]);
?>