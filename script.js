// Smooth scrolling for navigation links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(168, 200, 236, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(168, 200, 236, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Vervang met je EmailJS public key
})();

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const templateParams = {
            from_name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
            from_email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
            phone: formData.get('phone') || contactForm.querySelector('input[type="tel"]').value,
            message: formData.get('message') || contactForm.querySelector('textarea').value,
            to_email: 'jouw-email@domein.nl' // HIER KUN JE HET EMAIL ADRES INSTELLEN
        };
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        loadingMessage.textContent = 'Bericht wordt verstuurd...';
        document.body.appendChild(loadingMessage);
        
        // Send email to business using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                // Remove loading message
                loadingMessage.remove();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                `;
                successMessage.textContent = 'Bedankt voor uw bericht! We nemen spoedig contact met u op.';
                document.body.appendChild(successMessage);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    successMessage.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => successMessage.remove(), 300);
                }, 5000);
                
                contactForm.reset();
            }, function(error) {
                // Remove loading message
                loadingMessage.remove();
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #f44336;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                `;
                errorMessage.textContent = 'Er is een fout opgetreden. Probeer het later opnieuw.';
                document.body.appendChild(errorMessage);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    errorMessage.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => errorMessage.remove(), 300);
                }, 5000);
            });
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .package-card, .about-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Button interactions
document.querySelectorAll('.btn, .package-button').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.closest('form')) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    });
});

// CTA Button functionality - allow navigation to webshop
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Don't prevent default for CTA buttons - let them navigate
        // Just add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const circles = document.querySelectorAll('.circle');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    circles.forEach((circle, index) => {
        const speed = 0.1 + (index * 0.05);
        circle.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Counter animation for stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target === 99.9 ? '.9%' : target > 100 ? 'K+' : '/7');
    }, 30);
};

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('K+')) {
                    animateCounter(stat, 10);
                } else if (text.includes('%')) {
                    stat.textContent = '99.9%';
                } else {
                    stat.textContent = '24/7';
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

console.log('Website succesvol geladen! 🚀');

// Postcode Checker Functionality
const postcodeInput = document.getElementById('postcodeInput');
const checkBtn = document.getElementById('checkBtn');
const result = document.getElementById('result');

// List of valid postcodes (you can customize this list)
const validPostcodes = [
    '1011', '1012', '1013', '1014', '1015', '1016', '1017', '1018', '1019',
    '2000', '2001', '2002', '2003', '2004', '2005',
    '3000', '3001', '3002', '3003', '3004', '3005'
];

// Function to validate Dutch postcode format
function validatePostcodeFormat(postcode) {
    const regex = /^[1-9][0-9]{3}[A-Za-z]{2}$/;
    return regex.test(postcode);
}

// Function to check postcode
function checkPostcode() {
    const postcode = postcodeInput.value.trim().toUpperCase();
    
    if (!postcode) {
        result.textContent = 'Vul een postcode in';
        result.className = 'error';
        return;
    }
    
    if (!validatePostcodeFormat(postcode)) {
        result.textContent = 'Ongeldige postcode format. Gebruik bijv. 1011AB';
        result.className = 'error';
        return;
    }
    
    const postcodeNumber = postcode.substring(0, 4);
    
    if (validPostcodes.includes(postcodeNumber)) {
        result.textContent = '✓ Wij bezorgen bij jou in de buurt!';
        result.className = 'success';
    } else {
        result.textContent = '✗ Helaas, wij bezorgen nog niet in jouw gebied';
        result.className = 'error';
    }
}

// Event listeners
checkBtn.addEventListener('click', checkPostcode);

postcodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPostcode();
    }
});

postcodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    if (result.textContent) {
        result.textContent = '';
        result.className = '';
    }
});

