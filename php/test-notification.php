<?php
// File khusus untuk testing via browser
echo "<h2>Notification Handler Test</h2>";

// Check if files exist
$midtransPath = dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
$sendEmailPath = dirname(__FILE__) . '/sendTicketEmail.php';
$generatePdfPath = dirname(__FILE__) . '/generatorPDF.php';

echo "<h3>File Check:</h3>";
echo "Midtrans.php: " . (file_exists($midtransPath) ? "✅ Found" : "❌ Not Found") . "<br>";
echo "sendTicketEmail.php: " . (file_exists($sendEmailPath) ? "✅ Found" : "❌ Not Found") . "<br>";
echo "generatorPDF.php: " . (file_exists($generatePdfPath) ? "✅ Found" : "❌ Not Found") . "<br>";

echo "<h3>Database Connection Test:</h3>";
try {
    require_once 'koneksi.php';
    echo "✅ Database connection successful<br>";
    
    // Test query
    $result = $conn->query("SELECT COUNT(*) as count FROM booking");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Booking table accessible - Total records: " . $row['count'] . "<br>";
    }
    $conn->close();
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
}

echo "<h3>Test Notification Simulation:</h3>";
echo "<p>To test webhook notification, use <code>/notification.php</code> with POST data from Midtrans.</p>";
echo "<p><strong>Current URL for Midtrans webhook:</strong></p>";
echo "<code>https://3c9d8b6c02ec.ngrok-free.app/etiket-coba/php/notification.php</code>";

?>