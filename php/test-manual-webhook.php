<?php
// File: test-manual-webhook.php
// Test update status manual

require_once 'koneksi.php';
require_once 'generatorPDF.php';
require_once 'sendTicketEmail.php';

// Ambil order_id dari URL parameter
$order_id = $_GET['order_id'] ?? '';

if (empty($order_id)) {
    echo "<h2>Manual Webhook Test</h2>";
    echo "<p>Masukkan Order ID untuk test manual update status:</p>";
    echo "<form method='GET'>";
    echo "<input type='text' name='order_id' placeholder='ORDER_1234567890_1234' required>";
    echo "<button type='submit'>Test Update Status</button>";
    echo "</form>";
    
    // Tampilkan semua order dengan status pending
    echo "<h3>Order dengan Status Pending:</h3>";
    $result = $conn->query("SELECT order_id, nama, email, total, tanggal_booking, status FROM booking WHERE status = 'pending' ORDER BY order_date DESC LIMIT 10");
    
    if ($result->num_rows > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Order ID</th><th>Nama</th><th>Email</th><th>Total</th><th>Tanggal</th><th>Status</th><th>Action</th></tr>";
        
        while($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['order_id'] . "</td>";
            echo "<td>" . $row['nama'] . "</td>";
            echo "<td>" . $row['email'] . "</td>";
            echo "<td>Rp " . number_format($row['total']) . "</td>";
            echo "<td>" . $row['tanggal_booking'] . "</td>";
            echo "<td>" . $row['status'] . "</td>";
            echo "<td><a href='?order_id=" . $row['order_id'] . "'>Update ke Berhasil</a></td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>Tidak ada order dengan status pending.</p>";
    }
    
    exit;
}

echo "<h2>Manual Webhook Simulation</h2>";
echo "<p>Processing order: <strong>{$order_id}</strong></p>";

try {
    // 1. Update status ke berhasil
    $stmt = $conn->prepare("UPDATE booking SET status = 'berhasil' WHERE order_id = ?");
    $stmt->bind_param("s", $order_id);
    
    if ($stmt->execute()) {
        echo "✅ Status updated to 'berhasil'<br>";
        
        // 2. Ambil data booking
        $stmt2 = $conn->prepare("SELECT * FROM booking WHERE order_id = ?");
        $stmt2->bind_param("s", $order_id);
        $stmt2->execute();
        $result = $stmt2->get_result();
        $bookingData = $result->fetch_assoc();
        
        if ($bookingData) {
            echo "✅ Booking data retrieved<br>";
            
            // 3. Generate PDF
            echo "📄 Generating PDF ticket...<br>";
            $pdfPath = generateTicketPDF($bookingData);
            
            if (file_exists($pdfPath)) {
                echo "✅ PDF generated: " . basename($pdfPath) . "<br>";
                
                // 4. Send email
                echo "📧 Sending email...<br>";
                $emailSent = sendTicketEmail($bookingData, $pdfPath);
                
                if ($emailSent) {
                    echo "✅ <strong>Email sent successfully!</strong><br>";
                    echo "📧 Ticket sent to: " . $bookingData['email'] . "<br>";
                    
                    // Clean up PDF
                    unlink($pdfPath);
                    echo "🗑️ Temporary PDF file cleaned up<br>";
                } else {
                    echo "❌ Email failed to send<br>";
                }
            } else {
                echo "❌ PDF generation failed<br>";
            }
        } else {
            echo "❌ Booking data not found<br>";
        }
        
        $stmt2->close();
    } else {
        echo "❌ Failed to update status: " . $stmt->error . "<br>";
    }
    
    $stmt->close();
    $conn->close();
    
    echo "<br><h3>🎉 Manual webhook simulation completed!</h3>";
    echo "<p><a href='?'>← Back to order list</a></p>";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}
?>