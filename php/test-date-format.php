<?php
// File: test-date-format.php
$testDate = '2024-01-15T10:30:00.000Z';
echo "Original: " . $testDate . "\n";

$dateTime = new DateTime($testDate);
echo "Parsed: " . $dateTime->format('Y-m-d H:i:s') . "\n";
echo "Date only: " . $dateTime->format('Y-m-d') . "\n";
?>
