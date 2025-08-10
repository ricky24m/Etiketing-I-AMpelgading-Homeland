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
    // Get parameters
    $startDate = $_GET['start_date'] ?? '';
    $endDate = $_GET['end_date'] ?? '';
    
    if (empty($startDate) || empty($endDate)) {
        throw new Exception('Tanggal mulai dan selesai harus diisi');
    }
    
    // Validate date format
    if (!strtotime($startDate) || !strtotime($endDate)) {
        throw new Exception('Format tanggal tidak valid');
    }
    
    // Get revenue data - only successful transactions
    $sql = "SELECT 
                order_id, 
                nama, 
                items, 
                total, 
                order_date,
                tanggal_booking
            FROM booking 
            WHERE status = 'berhasil' 
            AND DATE(order_date) BETWEEN ? AND ?
            ORDER BY order_date DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $startDate, $endDate);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $transactions = [];
    $totalRevenue = 0;
    $totalTransactions = 0;
    
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
        $totalRevenue += $row['total'];
        $totalTransactions++;
    }
    
    // Calculate summary
    $summary = [
        'total_revenue' => $totalRevenue,
        'total_transactions' => $totalTransactions,
        'average_per_transaction' => $totalTransactions > 0 ? ($totalRevenue / $totalTransactions) : 0,
        'period_start' => $startDate,
        'period_end' => $endDate
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $transactions,
        'summary' => $summary
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>