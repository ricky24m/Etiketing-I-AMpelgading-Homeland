import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketEmail(booking: any) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: booking.email,
    subject: `E-Ticket Booking - ${booking.order_id}`,
    html: `
      <h2>Terima kasih telah melakukan booking!</h2>
      <p><strong>Order ID:</strong> ${booking.order_id}</p>
      <p><strong>Nama:</strong> ${booking.nama}</p>
      <p><strong>Tanggal:</strong> ${booking.tanggal_booking}</p>
      <p><strong>Total:</strong> Rp ${booking.total.toLocaleString()}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}