<?php
require_once 'sendTicketEmail.php';
require_once 'generatorPDF.php';

// Test data booking (ganti dengan data real dari database)
$testBookingData = array(
    'order_id' => 'TEST_ORDER_123',
    'nama' => 'Test User',
    'nik' => '1234567890',
    'phone' => '08123456789',
    'email' => 'test@example.com', // Ganti dengan email Anda untuk test
    'tanggal_booking' => '2024-01-15',
    'order_date' => '2024-01-10 10:30:00',
    'items' => 'Paket Wisata Alam x 1',
    'total' => 100000,
    'status' => 'berhasil'
);

echo "<h2>Email Test</h2>";

try {
    // Generate PDF
    echo "Generating PDF...<br>";
    $pdfPath = generateTicketPDF($testBookingData);
    echo "PDF generated: " . $pdfPath . "<br>";
    
    if (file_exists($pdfPath)) {
        echo "✅ PDF file exists<br>";
        
        // Send email
        echo "Sending email...<br>";
        $emailSent = sendTicketEmail($testBookingData, $pdfPath);
        
        if ($emailSent) {
            echo "✅ Email sent successfully!<br>";
        } else {
            echo "❌ Email failed to send<br>";
        }
        
        // Clean up
        unlink($pdfPath);
        echo "PDF file cleaned up<br>";
        
    } else {
        echo "❌ PDF file not found<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}
?>