<?php
// Debug headers
error_log("=== GET BOOKINGS API CALLED ===");
error_log("REQUEST_URI: " . $_SERVER['REQUEST_URI']);

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Check admin session
if (!isset($_SESSION['admin_id'])) {
    error_log("Unauthorized access - no admin session");
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Please login first']);
    exit;
}

// 🎯 FIX: Path yang benar ke koneksi.php
require_once '../../../php/koneksi.php';

try {
    // Get parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = max(1, min(100, (int)($_GET['limit'] ?? 10))); // Max 100 items per page
    $search = trim($_GET['search'] ?? '');
    $status = trim($_GET['status'] ?? '');
    
    $offset = ($page - 1) * $limit;
    
    error_log("Query params - Page: $page, Limit: $limit, Search: '$search', Status: '$status'");
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    $types = '';
    
    if (!empty($search)) {
        $whereConditions[] = "(nama LIKE ? OR email LIKE ? OR order_id LIKE ? OR phone LIKE ?)";
        $searchParam = "%{$search}%";
        $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam]);
        $types .= 'ssss';
    }
    
    if (!empty($status)) {
        $whereConditions[] = "status = ?";
        $params[] = $status;
        $types .= 's';
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Count total records
    $countSql = "SELECT COUNT(*) as total FROM booking {$whereClause}";
    if (!empty($params)) {
        $countStmt = $conn->prepare($countSql);
        $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $totalRecords = $countStmt->get_result()->fetch_assoc()['total'];
    } else {
        $totalRecords = $conn->query($countSql)->fetch_assoc()['total'];
    }
    
    error_log("Total records found: $totalRecords");
    
    // Get paginated data
    $sql = "SELECT id, order_id, nama, email, phone, tanggal_booking, order_date, items, total, status 
            FROM booking 
            {$whereClause} 
            ORDER BY order_date DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        // Truncate items if too long
        $items = $row['items'];
        if (strlen($items) > 30) {
            $items = substr($items, 0, 30) . '...';
        }
        $row['items_display'] = $items;
        
        // Format dates
        $row['tanggal_booking_formatted'] = date('d/m/Y', strtotime($row['tanggal_booking']));
        $row['order_date_formatted'] = date('d/m/Y H:i', strtotime($row['order_date']));
        
        // Format total
        $row['total_formatted'] = 'Rp ' . number_format($row['total'], 0, ',', '.');
        
        $bookings[] = $row;
    }
    
    // Calculate pagination info
    $totalPages = ceil($totalRecords / $limit);
    
    error_log("Returning " . count($bookings) . " bookings");
    
    echo json_encode([
        'success' => true,
        'data' => $bookings,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_records' => (int)$totalRecords,
            'per_page' => $limit,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error in get-bookings API: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>