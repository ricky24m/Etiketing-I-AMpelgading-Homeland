<?php
require_once '../php/koneksi.php';

// Test koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Test query
$result = $conn->query("SHOW TABLES LIKE 'katalog_menu'");
if ($result->num_rows > 0) {
    echo "✅ Tabel katalog_menu exists<br>";
} else {
    echo "❌ Tabel katalog_menu NOT exists<br>";
}

$result = $conn->query("SHOW TABLES LIKE 'detail_menu'");
if ($result->num_rows > 0) {
    echo "✅ Tabel detail_menu exists<br>";
} else {
    echo "❌ Tabel detail_menu NOT exists<br>";
}

// Test data
$result = $conn->query("SELECT COUNT(*) as count FROM katalog_menu");
$row = $result->fetch_assoc();
echo "📊 Total data katalog_menu: " . $row['count'] . "<br>";

$conn->close();
?>