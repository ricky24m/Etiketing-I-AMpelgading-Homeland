<?php
// File: debug-order.php
require_once 'koneksi.php';
require_once 'generatorPDF.php';
require_once 'sendTicketEmail.php';

$order_id = 'ORDER_1754620596_1917';

echo "<h2>Debug Order: {$order_id}</h2>";

// 1. Cek data di database
echo "<h3>1. Database Check</h3>";
$stmt = $conn->prepare("SELECT * FROM booking WHERE order_id = ?");
$stmt->bind_param("s", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$bookingData = $result->fetch_assoc();

if ($bookingData) {
    echo "✅ Order found in database<br>";
    echo "Customer: " . $bookingData['nama'] . "<br>";
    echo "Email: " . $bookingData['email'] . "<br>";
    echo "Status: " . $bookingData['status'] . "<br>";
    echo "Total: " . $bookingData['total'] . "<br>";
    
    // 2. Test PDF generation
    echo "<h3>2. PDF Generation Test</h3>";
    try {
        $pdfPath = generateTicketPDF($bookingData);
        if (file_exists($pdfPath)) {
            echo "✅ PDF generated: " . basename($pdfPath) . "<br>";
            echo "File size: " . filesize($pdfPath) . " bytes<br>";
            
            // 3. Test email sending
            echo "<h3>3. Email Test</h3>";
            $emailSent = sendTicketEmail($bookingData, $pdfPath);
            if ($emailSent) {
                echo "✅ Email sent successfully!<br>";
            } else {
                echo "❌ Email failed to send<br>";
            }
            
            // Clean up
            unlink($pdfPath);
            echo "PDF file cleaned up<br>";
        } else {
            echo "❌ PDF generation failed<br>";
        }
    } catch (Exception $e) {
        echo "❌ Error: " . $e->getMessage() . "<br>";
    }
} else {
    echo "❌ Order not found in database<br>";
}

$stmt->close();
$conn->close();
?>