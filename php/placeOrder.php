<?php
// filepath: c:\xampp\htdocs\etiket-coba\php\placeOrder.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

try {
    // Debug: Log semua data yang diterima
    error_log("=== DEBUG PLACEORDER ===");
    error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
    error_log("POST data: " . print_r($_POST, true));
    error_log("Raw input: " . file_get_contents('php://input'));
    error_log("========================");

    // Path ke Midtrans library
    require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
    
    // Config Midtrans
    \Midtrans\Config::$serverKey = 'Mid-server-lusC-k_patB1Qk6xiWSIWPbY';
    \Midtrans\Config::$isProduction = false;
    \Midtrans\Config::$isSanitized = true;
    \Midtrans\Config::$is3ds = true;

    // Get data dari form POST
    $nama = $_POST['nama'] ?? '';
    $email = $_POST['email'] ?? '';
    $nik = $_POST['nik'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $emergency = $_POST['emergency'] ?? '';
    $tanggal = $_POST['tanggal'] ?? '';
    $items = $_POST['items'] ?? '';
    $total = (int)($_POST['total'] ?? 0);
    
    // Enhanced debug logging
    error_log("Received data:");
    error_log("- Nama: '" . $nama . "' (length: " . strlen($nama) . ")");
    error_log("- Email: '" . $email . "' (length: " . strlen($email) . ")");
    error_log("- NIK: '" . $nik . "' (length: " . strlen($nik) . ")");
    error_log("- Phone: '" . $phone . "' (length: " . strlen($phone) . ")");
    error_log("- Emergency: '" . $emergency . "' (length: " . strlen($emergency) . ")");
    error_log("- Tanggal: '" . $tanggal . "' (length: " . strlen($tanggal) . ")");
    error_log("- Items: '" . $items . "' (length: " . strlen($items) . ")");
    error_log("- Total: " . $total . " (type: " . gettype($total) . ")");
    
    // Validasi data dengan detail error
    $errors = [];
    
    if (empty(trim($nama))) {
        $errors[] = 'Nama kosong';
    }
    if (empty(trim($email))) {
        $errors[] = 'Email kosong';
    }
    if (empty(trim($items))) {
        $errors[] = 'Items kosong';
    }
    if ($total <= 0) {
        $errors[] = 'Total tidak valid: ' . $total;
    }
    
    if (!empty($errors)) {
        throw new Exception('Data tidak valid: ' . implode(', ', $errors));
    }
    
    // Generate order ID
    $order_id = 'ORDER_' . time() . '_' . rand(1000, 9999);

    // Koneksi database
    $conn = new mysqli("localhost", "root", "", "etiket_coba");
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Format tanggal dengan validasi yang lebih baik
    $tanggalBooking = null;
    if (!empty($tanggal)) {
        try {
            $dateTime = new DateTime($tanggal);
            $tanggalBooking = $dateTime->format('Y-m-d');
            error_log("Date formatted successfully: " . $tanggalBooking);
        } catch (Exception $e) {
            error_log("Date parsing failed: " . $e->getMessage());
            $tanggalBooking = date('Y-m-d'); // Fallback to today
        }
    } else {
        $tanggalBooking = date('Y-m-d'); // Fallback to today
        error_log("No date provided, using today: " . $tanggalBooking);
    }

    // Simpan ke database
    $stmt = $conn->prepare("INSERT INTO booking 
        (order_id, nama, nik, phone, emergency, email, tanggal_booking, order_date, items, total, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, 'pending')");
    
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param(
        "ssssssssi",
        $order_id,
        $nama,
        $nik,
        $phone,
        $emergency,
        $email,
        $tanggalBooking,
        $items,
        $total
    );

    if (!$stmt->execute()) {
        throw new Exception('Insert booking failed: ' . $stmt->error);
    }

    error_log("Booking inserted successfully: " . $order_id);
    $stmt->close();

    // Parse items untuk Midtrans
    $itemDetails = [];
    if (!empty($items)) {
        $itemsArray = explode(', ', $items);
        
        foreach ($itemsArray as $index => $item) {
            if (preg_match('/(.*) x (\d+)/', $item, $matches)) {
                $itemName = trim($matches[1]);
                $itemQty = (int)$matches[2];
                $itemPrice = intval($total / count($itemsArray));
                
                $itemDetails[] = [
                    'id' => 'item_' . ($index + 1),
                    'price' => $itemPrice,
                    'quantity' => $itemQty,
                    'name' => $itemName
                ];
            }
        }
    }

    // Fallback jika parsing gagal
    if (empty($itemDetails)) {
        $itemDetails[] = [
            'id' => 'item_1',
            'price' => $total,
            'quantity' => 1,
            'name' => !empty($items) ? $items : 'Paket Wisata'
        ];
    }

    // Buat transaksi Midtrans
    $params = [
        'transaction_details' => [
            'order_id' => $order_id,
            'gross_amount' => $total,
        ],
        'item_details' => $itemDetails,
        'customer_details' => [
            'first_name' => $nama,
            'email' => $email,
            'phone' => $phone,
        ]
    ];

    error_log("Midtrans params: " . print_r($params, true));

    $snapToken = \Midtrans\Snap::getSnapToken($params);
    error_log("Snap token generated successfully");

    $conn->close();

    // Return success response
    ob_clean();
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'snap_token' => $snapToken,
        'order_id' => $order_id
    ]);

} catch (Exception $e) {
    error_log('PlaceOrder error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug_info' => [
            'received_post' => $_POST,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
}
?>