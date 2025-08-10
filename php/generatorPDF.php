<?php
// filepath: c:\xampp\htdocs\etiket-coba\php\generatorPDF.php
require_once 'vendor/autoload.php'; // Jika menggunakan Composer untuk TCPDF

function generateTicketPDF($bookingData) {
    // Create new PDF document - langsung gunakan TCPDF tanpa use statement
    $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    
    // Set document information
    $pdf->SetCreator('I\'AMpel GADING Homeland');
    $pdf->SetTitle('E-Ticket Booking');
    
    // Set margins and add page
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(TRUE, 15);
    $pdf->AddPage();
    
    // Generate ticket content
    $html = generateTicketHTML($bookingData);
    $pdf->writeHTML($html, true, false, true, false, '');
    
    // Create temp directory if not exists
    $tempDir = dirname(__FILE__) . '/temp/';
    if (!file_exists($tempDir)) {
        mkdir($tempDir, 0777, true);
    }
    
    // Output PDF to file
    $filename = $tempDir . 'ticket_' . $bookingData['order_id'] . '.pdf';
    $pdf->Output($filename, 'F');
    
    return $filename;
}

function generateTicketHTML($bookingData) {
    // Format tanggal
    $bookingDate = date('d F Y', strtotime($bookingData['tanggal_booking']));
    $orderDate = date('d F Y, H:i', strtotime($bookingData['order_date']));
    
    return "
    <style>
        .ticket { font-family: helvetica; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #16A34A; font-size: 24px; margin-bottom: 5px; }
        .header h2 { color: #333; font-size: 18px; margin-top: 0; }
        .info-row { margin: 8px 0; padding: 5px 0; border-bottom: 1px dotted #ccc; }
        .label { font-weight: bold; color: #16A34A; }
    </style>
    
    <div class='ticket'>
        <div class='header'>
            <h1>E-TICKET</h1>
            <h2>I'AMpel GADING Homeland</h2>
        </div>
        
        <div class='info-row'><span class='label'>Nomor Tiket:</span> {$bookingData['order_id']}</div>
        <div class='info-row'><span class='label'>Nama:</span> {$bookingData['nama']}</div>
        <div class='info-row'><span class='label'>NIK:</span> {$bookingData['nik']}</div>
        <div class='info-row'><span class='label'>Telepon:</span> {$bookingData['phone']}</div>
        <div class='info-row'><span class='label'>Email:</span> {$bookingData['email']}</div>
        <div class='info-row'><span class='label'>Tanggal Kunjungan:</span> <strong>{$bookingDate}</strong></div>
        <div class='info-row'><span class='label'>Pesanan:</span> {$bookingData['items']}</div>
        <div class='info-row'><span class='label'>Total:</span> <strong>Rp " . number_format($bookingData['total'], 0, ',', '.') . "</strong></div>
        
        <div style='margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 5px;'>
            <strong>PENTING:</strong><br>
            • Datang 30 menit sebelum waktu booking<br>
            • Bawa tiket ini dan identitas diri<br>
            • Hubungi: +62-xxx-xxxx-xxxx untuk info
        </div>
    </div>";
}
?>