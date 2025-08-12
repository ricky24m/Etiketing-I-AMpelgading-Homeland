<?php
// filepath: c:\xampp\htdocs\etiket-coba\php\notification.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

// Add ngrok bypass header
header('ngrok-skip-browser-warning: true');

// Enhanced logging function
function logWebhook($message)
{
    $logFile = dirname(__FILE__) . '/webhook.log';
    $timestamp = date('Y-m-d H:i:s');
    $detailedLog = "[{$timestamp}] {$message}";
    file_put_contents($logFile, $detailedLog . "\n", FILE_APPEND | LOCK_EX);
    error_log($detailedLog);
}

try {
    logWebhook("=== NEW WEBHOOK REQUEST ===");
    logWebhook("Timestamp: " . date('Y-m-d H:i:s'));
    logWebhook("Request Method: " . $_SERVER['REQUEST_METHOD']);
    logWebhook("Request URI: " . $_SERVER['REQUEST_URI']);
    logWebhook("User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'not set'));
    logWebhook("Content Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
    logWebhook("Content Length: " . ($_SERVER['CONTENT_LENGTH'] ?? 'not set'));

    // Log semua headers
    $headers = getallheaders();
    logWebhook("=== HEADERS ===");
    foreach ($headers as $key => $value) {
        logWebhook("Header {$key}: {$value}");
    }

    // Log raw input
    $rawInput = file_get_contents('php://input');
    logWebhook("=== RAW POST DATA ===");
    logWebhook("Raw Input Length: " . strlen($rawInput));
    logWebhook("Raw Input: " . $rawInput);

    // Check if this is GET request (browser access)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        logWebhook("Browser access detected - showing status page");
        ob_clean();
        echo "<h2>Midtrans Notification Handler</h2>";
        echo "<p><strong>Status:</strong> ✅ Ready to receive notifications</p>";
        echo "<p><strong>Current Webhook URL:</strong><br>";
        echo "<code>https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . "</code></p>";

        // Show recent logs
        $logFile = dirname(__FILE__) . '/webhook.log';
        if (file_exists($logFile)) {
            echo "<h3>Recent Webhook Activity:</h3>";
            echo "<div style='background:#f5f5f5; padding:10px; border:1px solid #ddd; max-height:400px; overflow-y:auto;'>";
            echo "<pre>";
            $logs = file($logFile);
            echo htmlspecialchars(implode('', array_slice($logs, -50))); // Last 50 lines
            echo "</pre>";
            echo "</div>";

            echo "<p><strong>Total log entries:</strong> " . count($logs) . "</p>";
            echo "<p><strong>Log file size:</strong> " . filesize($logFile) . " bytes</p>";
        } else {
            echo "<p>No webhook activity yet.</p>";
        }

        echo "<h3>Test & Monitor:</h3>";
        echo "<p><a href='monitor-webhook.php' target='_blank'>→ Real-Time Webhook Monitor</a></p>";
        echo "<p><a href='test-manual-webhook.php' target='_blank'>→ Manual Status Update Test</a></p>";
        exit;
    }

    // POST request - process webhook
    logWebhook("=== PROCESSING WEBHOOK ===");

    if (empty($rawInput)) {
        logWebhook("ERROR: Empty POST data received");
        throw new Exception("No POST data received");
    }

    // Check Midtrans library
    $midtransPath = dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
    if (!file_exists($midtransPath)) {
        logWebhook("ERROR: Midtrans library not found at: " . $midtransPath);
        throw new Exception('Midtrans library not found');
    }

    require_once $midtransPath;
    require_once 'sendTicketEmail.php';

    // Load environment variables
    require_once __DIR__ . '/../vendor/autoload.php';
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    \Midtrans\Config::$serverKey = $_ENV['MIDTRANS_SERVER_KEY'];
    \Midtrans\Config::$isProduction = false;

    logWebhook("Creating Midtrans Notification object...");
    $notif = new \Midtrans\Notification();
    logWebhook("Notification object created successfully");

    $transaction_status = $notif->transaction_status;
    $fraud_status = $notif->fraud_status;
    $order_id = $notif->order_id;
    $payment_type = $notif->payment_type;

    logWebhook("=== NOTIFICATION DATA ===");
    logWebhook("Order ID: {$order_id}");
    logWebhook("Transaction Status: {$transaction_status}");
    logWebhook("Fraud Status: {$fraud_status}");
    logWebhook("Payment Type: {$payment_type}");
    logWebhook("Merchant ID: " . ($notif->merchant_id ?? 'not set'));
    logWebhook("Gross Amount: " . ($notif->gross_amount ?? 'not set'));

    // Process notification berdasarkan status
    logWebhook("=== PROCESSING TRANSACTION STATUS ===");
    if ($transaction_status == 'capture' || $transaction_status == 'settlement') {
        if ($transaction_status == 'capture') {
            if ($fraud_status == 'accept') {
                logWebhook("Processing: CAPTURE with ACCEPT fraud status");
                updateBookingStatus($order_id, 'berhasil');
                sendTicketToCustomer($order_id);
            } else {
                logWebhook("Skipping: CAPTURE with fraud status: {$fraud_status}");
            }
        } else if ($transaction_status == 'settlement') {
            logWebhook("Processing: SETTLEMENT - Payment successful");
            updateBookingStatus($order_id, 'berhasil');
            sendTicketToCustomer($order_id);
        }
    } else if ($transaction_status == 'pending') {
        logWebhook("Processing: PENDING - Transaction waiting");
        updateBookingStatus($order_id, 'pending');
    } else if ($transaction_status == 'deny' || $transaction_status == 'expire' || $transaction_status == 'cancel') {
        logWebhook("Processing: FAILED - Transaction failed with status: {$transaction_status}");
        updateBookingStatus($order_id, 'gagal');
    } else {
        logWebhook("Unknown transaction status: {$transaction_status}");
    }

    logWebhook("=== WEBHOOK PROCESSING COMPLETED ===");

    // Return success response to Midtrans
    ob_clean();
    http_response_code(200);
    echo "OK";

} catch (Exception $e) {
    logWebhook("CRITICAL ERROR: " . $e->getMessage());
    logWebhook("Error file: " . $e->getFile());
    logWebhook("Error line: " . $e->getLine());
    logWebhook("Stack trace: " . $e->getTraceAsString());

    ob_clean();
    http_response_code(200); // Still return 200 to prevent Midtrans retries
    echo "Error: " . $e->getMessage();
}

function updateBookingStatus($order_id, $status)
{
    logWebhook("=== UPDATING DATABASE STATUS ===");
    logWebhook("Order ID: {$order_id}, New Status: {$status}");

    try {
        require_once 'koneksi.php';

        $stmt = $conn->prepare("UPDATE booking SET status = ? WHERE order_id = ?");
        $stmt->bind_param("ss", $status, $order_id);
        $stmt->execute();

        $rowsAffected = $stmt->affected_rows;
        logWebhook("Database update successful - Rows affected: {$rowsAffected}");
        if ($rowsAffected == 0) {
            logWebhook("WARNING: No rows updated - Order ID might not exist");
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        logWebhook("Database error: " . $e->getMessage());
    }
}

function sendTicketToCustomer($order_id) {
    logWebhook("=== SENDING EMAIL TICKET ===");
    logWebhook("Processing email for order: {$order_id}");
    
    try {
        $bookingData = getBookingData($order_id);
        
        if ($bookingData) {
            logWebhook("Booking data found for order: {$order_id}");
            logWebhook("Customer email: " . $bookingData['email']);
            logWebhook("Customer name: " . $bookingData['nama']);
            
            // Check if files exist
            $generatorPath = dirname(__FILE__) . '/generatorPDF.php';
            $emailPath = dirname(__FILE__) . '/sendTicketEmail.php';
            
            logWebhook("Checking required files...");
            logWebhook("generatorPDF.php exists: " . (file_exists($generatorPath) ? 'YES' : 'NO'));
            logWebhook("sendTicketEmail.php exists: " . (file_exists($emailPath) ? 'YES' : 'NO'));
            
            if (!file_exists($generatorPath)) {
                logWebhook("ERROR: generatorPDF.php not found");
                return;
            }
            
            if (!file_exists($emailPath)) {
                logWebhook("ERROR: sendTicketEmail.php not found");
                return;
            }
            
            require_once $generatorPath;
            logWebhook("generatorPDF.php loaded successfully");
            
            logWebhook("Generating PDF ticket...");
            $pdfPath = generateTicketPDF($bookingData);
            logWebhook("PDF generation completed");
            
            if (file_exists($pdfPath)) {
                logWebhook("PDF generated successfully: " . basename($pdfPath));
                logWebhook("PDF file size: " . filesize($pdfPath) . " bytes");
                logWebhook("PDF full path: " . $pdfPath);
                
                logWebhook("Sending email...");
                $emailSent = sendTicketEmail($bookingData, $pdfPath);
                logWebhook("Email function returned: " . ($emailSent ? 'TRUE' : 'FALSE'));
                
                if ($emailSent) {
                    logWebhook("✅ Email sent successfully to: " . $bookingData['email']);
                    
                    // Clean up PDF file
                    if (file_exists($pdfPath)) {
                        unlink($pdfPath);
                        logWebhook("PDF file cleaned up");
                    }
                } else {
                    logWebhook("❌ Email failed to send");
                }
            } else {
                logWebhook("❌ PDF generation failed - File not found");
                logWebhook("Expected PDF path: " . $pdfPath);
                
                // Check temp directory
                $tempDir = dirname(__FILE__) . '/temp/';
                logWebhook("Temp directory exists: " . (file_exists($tempDir) ? 'YES' : 'NO'));
                logWebhook("Temp directory writable: " . (is_writable($tempDir) ? 'YES' : 'NO'));
            }
        } else {
            logWebhook("❌ No booking data found for order: {$order_id}");
        }
    } catch (Exception $e) {
        logWebhook("CRITICAL ERROR in sendTicketToCustomer: " . $e->getMessage());
        logWebhook("Error file: " . $e->getFile());
        logWebhook("Error line: " . $e->getLine());
        logWebhook("Stack trace: " . $e->getTraceAsString());
    }
}

function getBookingData($order_id)
{
    logWebhook("=== GETTING BOOKING DATA ===");
    logWebhook("Searching for order: {$order_id}");

    try {
        require_once 'koneksi.php';
        global $conn;

        logWebhook("Database connection established");

        $stmt = $conn->prepare("SELECT * FROM booking WHERE order_id = ?");
        if (!$stmt) {
            logWebhook("ERROR: Prepare statement failed: " . (isset($conn) && is_object($conn) ? $conn->error : 'No connection object'));
            return null;
        }

        $stmt->bind_param("s", $order_id);
        if (!$stmt->execute()) {
            logWebhook("ERROR: Execute failed: " . $stmt->error);
            return null;
        }

        $result = $stmt->get_result();
        $data = $result->fetch_assoc();

        if ($data) {
            logWebhook("✅ Booking data found for order: {$order_id}");
            logWebhook("Customer: " . $data['nama']);
            logWebhook("Email: " . $data['email']);
            logWebhook("Status: " . $data['status']);
        } else {
            logWebhook("❌ No booking data found for order: {$order_id}");
        }

        $stmt->close();
        $conn->close();

        return $data;
    } catch (Exception $e) {
        logWebhook("CRITICAL ERROR in getBookingData: " . $e->getMessage());
        logWebhook("Stack trace: " . $e->getTraceAsString());
        return null;
    }
}
?>