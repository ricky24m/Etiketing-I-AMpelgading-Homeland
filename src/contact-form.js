document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("1lOHmAchgLZKLMxwk"); // Ganti dengan User ID dari EmailJS
    
    const contactForm = document.getElementById('contact-form');
    const btnText = document.getElementById('btn-text');
    const submitBtn = contactForm.querySelector('.btn-submit');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const templateParams = {
            nama: formData.get('nama'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            pesan: formData.get('pesan'),
            to_email: 'mangihutricky@gmail.com'
        };
        
        // Send email using EmailJS
        emailjs.send("service_ugi7pam","template_t7q02cr", templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                btnText.textContent = 'Terkirim!';
                submitBtn.style.background = '#16A34A';
                
                // Reset form
                contactForm.reset();
                
                // Show alert
                alert('Pesan berhasil dikirim! Terima kasih.');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    btnText.textContent = 'Kirim Pesan';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '#16A34A';
                }, 3000);
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                btnText.textContent = 'Gagal Kirim';
                submitBtn.style.background = '#dc2626';
                
                alert('Gagal mengirim pesan. Silakan coba lagi.');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    btnText.textContent = 'Kirim Pesan';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '#16A34A';
                }, 3000);
            });
    });
});