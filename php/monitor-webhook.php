<?php
// File: monitor-webhook.php
echo "<h2>Real-Time Webhook Monitor</h2>";
echo "<p>Refresh halaman ini setelah melakukan transaksi untuk melihat log terbaru.</p>";

$logFile = dirname(__FILE__) . '/webhook.log';

if (file_exists($logFile)) {
    echo "<h3>Webhook Activity Log:</h3>";
    echo "<div style='background:#f5f5f5; padding:10px; border:1px solid #ddd; max-height:500px; overflow-y:auto;'>";
    echo "<pre>";
    echo htmlspecialchars(file_get_contents($logFile));
    echo "</pre>";
    echo "</div>";
    
    echo "<br><p><strong>File size:</strong> " . filesize($logFile) . " bytes</p>";
    echo "<p><strong>Last modified:</strong> " . date('Y-m-d H:i:s', filemtime($logFile)) . "</p>";
} else {
    echo "<p style='color:red;'>❌ No webhook.log file found yet.</p>";
    echo "<p>File akan dibuat otomatis saat webhook pertama diterima.</p>";
}

echo "<br><h3>Test Links:</h3>";
echo "<p><a href='notification.php' target='_blank'>→ Open Notification Handler</a></p>";
echo "<p><a href='test-manual-webhook.php' target='_blank'>→ Manual Webhook Test</a></p>";

// Auto refresh every 10 seconds
echo "<script>setTimeout(function(){ location.reload(); }, 10000);</script>";
?>