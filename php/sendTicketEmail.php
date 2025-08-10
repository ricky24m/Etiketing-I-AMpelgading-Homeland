<?php
// filepath: c:\xampp\htdocs\etiket-coba\php\sendTicketEmail.php
require_once 'vendor/autoload.php'; // Jika menggunakan PHPMailer via Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendTicketEmail($bookingData, $pdfPath) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Gmail SMTP
        $mail->SMTPAuth   = true;
        $mail->Username   = 'mangihutricky@gmail.com'; // Ganti dengan email Anda
        $mail->Password   = 'gljx bsmh loyt cnre';    // App Password Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('mangihutricky@gmail.com', 'I\'AMpel GADING Homeland');
        $mail->addAddress($bookingData['email'], $bookingData['nama']);

        // Attachments
        if (file_exists($pdfPath)) {
            $mail->addAttachment($pdfPath, 'E-Ticket_' . $bookingData['order_id'] . '.pdf');
        }

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'E-Ticket Anda - I\'AMpel GADING Homeland [' . $bookingData['order_id'] . ']';
        
        // Generate email content
        $emailContent = generateTicketEmailTemplate($bookingData);
        $mail->Body = $emailContent;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email gagal dikirim: {$mail->ErrorInfo}");
        return false;
    }
}

function generateTicketEmailTemplate($data) {
    $orderDate = date('d F Y, H:i', strtotime($data['order_date']));
    $bookingDate = date('d F Y', strtotime($data['tanggal_booking']));
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16A34A, #044F3A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16A34A; }
            .download-section { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .success-badge { background: #16A34A; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <div class='logo'>🏞️ I'AMpel GADING Homeland</div>
                <h2>E-Ticket Anda Sudah Siap!</h2>
                <div class='success-badge'>✅ PEMBAYARAN BERHASIL</div>
            </div>
            
            <div class='content'>
                <p>Halo <strong>{$data['nama']}</strong>,</p>
                <p>Selamat! Pembayaran Anda telah berhasil diproses dan e-ticket sudah siap digunakan.</p>

                <div class='ticket-info'>
                    <h3 style='color: #16A34A; margin-top: 0;'>📋 Informasi E-Ticket</h3>
                    <table style='width: 100%;'>
                        <tr><td style='padding: 5px 0;'><strong>Nomor Tiket:</strong></td><td style='color: #16A34A; font-weight: bold;'>{$data['order_id']}</td></tr>
                        <tr><td style='padding: 5px 0;'><strong>Nama Pemesan:</strong></td><td>{$data['nama']}</td></tr>
                        <tr><td style='padding: 5px 0;'><strong>Tanggal Kunjungan:</strong></td><td style='color: #16A34A; font-weight: bold;'>{$bookingDate}</td></tr>
                        <tr><td style='padding: 5px 0;'><strong>Pesanan:</strong></td><td>{$data['items']}</td></tr>
                        <tr><td style='padding: 5px 0;'><strong>Total Pembayaran:</strong></td><td style='color: #16A34A; font-weight: bold;'>Rp " . number_format($data['total'], 0, ',', '.') . "</td></tr>
                    </table>
                </div>

                <div class='download-section'>
                    <h3 style='color: #16A34A; margin-top: 0;'>📎 E-Ticket Attachment</h3>
                    <p>E-ticket Anda sudah terlampir dalam email ini dalam format PDF.</p>
                    <p><strong>Silakan download dan simpan e-ticket untuk ditunjukkan saat check-in.</strong></p>
                </div>

                <div style='background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;'>
                    <h4 style='color: #856404; margin-top: 0;'>📌 Petunjuk Penting:</h4>
                    <ul style='margin-bottom: 0; color: #856404;'>
                        <li><strong>Cetak atau simpan e-ticket</strong> di handphone Anda</li>
                        <li><strong>Datang 30 menit sebelum</strong> waktu kunjungan</li>
                        <li><strong>Bawa identitas diri</strong> (KTP/SIM) yang sesuai dengan data booking</li>
                        <li><strong>E-ticket tidak dapat dipindahtangankan</strong></li>
                        <li>Untuk pertanyaan, hubungi kami di <strong>WhatsApp: +62-xxx-xxxx-xxxx</strong></li>
                    </ul>
                </div>

                <div style='background: #e0f7e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;'>
                    <h4 style='color: #16A34A; margin-top: 0;'>🎉 Terima Kasih!</h4>
                    <p style='margin-bottom: 0;'>Kami tunggu kedatangan Anda di I'AMpel GADING Homeland!<br>Nikmati pengalaman wisata yang tak terlupakan bersama kami.</p>
                </div>
            </div>

            <div class='footer'>
                <p>Email ini dikirim otomatis setelah pembayaran berhasil diverifikasi.</p>
                <p><strong>I'AMpel GADING Homeland</strong><br>
                Alamat Lengkap Lokasi<br>
                Telepon: +62-xxx-xxxx-xxxx | Email: info@iampelgading.com</p>
            </div>
        </div>
    </body>
    </html>
    ";
}
?>