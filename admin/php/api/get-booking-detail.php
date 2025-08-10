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
    $booking_id = $_GET['id'] ?? '';
    
    if (empty($booking_id)) {
        throw new Exception('Booking ID required');
    }
    
    $sql = "SELECT * FROM booking WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $booking_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Booking not found');
    }
    
    $booking = $result->fetch_assoc();
    
    // Format data
    $booking['tanggal_booking_formatted'] = date('d F Y', strtotime($booking['tanggal_booking']));
    $booking['order_date_formatted'] = date('d F Y, H:i', strtotime($booking['order_date']));
    $booking['total_formatted'] = 'Rp ' . number_format($booking['total'], 0, ',', '.');
    
    echo json_encode([
        'success' => true,
        'data' => $booking
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>