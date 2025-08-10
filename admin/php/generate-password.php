<?php
// Test script untuk generate password hash
$password = 'password123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "<h2>Password Generator</h2>";
echo "<p><strong>Password:</strong> " . $password . "</p>";
echo "<p><strong>Hash:</strong> " . $hash . "</p>";

// Test verification
if (password_verify($password, $hash)) {
    echo "<p style='color: green;'><strong>✅ Verification: SUCCESS</strong></p>";
} else {
    echo "<p style='color: red;'><strong>❌ Verification: FAILED</strong></p>";
}
?>