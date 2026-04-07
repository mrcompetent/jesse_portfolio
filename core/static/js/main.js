document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal functionality
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Trigger on load

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form toggle
    const sayHelloBtn = document.getElementById('say-hello-btn');
    const contactForm = document.getElementById('contact-form');

    if (sayHelloBtn && contactForm) {
        sayHelloBtn.addEventListener('click', () => {
            sayHelloBtn.classList.add('hidden');
            contactForm.classList.remove('hidden');
        });
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('form-status');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            statusDiv.className = '';
            statusDiv.textContent = 'Sending message...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Determine the CSRF token from input dynamically
                const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
                const token = csrfInput ? csrfInput.value : '';

                const response = await fetch('/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': token
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    statusDiv.className = 'success';
                    statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    statusDiv.className = 'error';
                    statusDiv.textContent = result.message || 'Oops! Something went wrong.';
                }
            } catch (error) {
                statusDiv.className = 'error';
                statusDiv.textContent = 'Network error. Please try again or use the email link.';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
});
