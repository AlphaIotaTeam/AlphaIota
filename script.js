// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            // Clear error on input
            const errorSpan = input.parentElement.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.classList.add('hidden');
                input.classList.remove('border-red-400', 'border-red-500');
            }
        });
    });

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(field) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMsg = '';

        // Remove previous error styling
        field.classList.remove('border-red-400', 'border-red-500');
        if (errorSpan) {
            errorSpan.classList.add('hidden');
        }

        // Check if required field is empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMsg = 'This field is required';
        }
        // Email validation
        else if (field.type === 'email' && field.value && !emailRegex.test(field.value)) {
            isValid = false;
            errorMsg = 'Please enter a valid email address';
        }
        // Name validation (at least 2 characters)
        else if (field.id === 'name' && field.value && field.value.trim().length < 2) {
            isValid = false;
            errorMsg = 'Name must be at least 2 characters';
        }
        // Message validation (at least 10 characters)
        else if (field.id === 'message' && field.value && field.value.trim().length < 10) {
            isValid = false;
            errorMsg = 'Message must be at least 10 characters';
        }

        if (!isValid) {
            field.classList.add('border-red-400');
            if (errorSpan) {
                errorSpan.textContent = errorMsg;
                errorSpan.classList.remove('hidden');
            }
        }

        return isValid;
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') || input.value.trim()) {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            }
        });

        // Validate checkbox
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            isFormValid = false;
            alert('Please agree to the Terms and Conditions');
        }

        if (!isFormValid) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        submitLoader.classList.remove('hidden');

        // Prepare form data for submission
        try {
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || null,
                service: document.getElementById('service').value || null,
                message: document.getElementById('message').value
            };

            // API endpoint - Update this with your actual endpoint URL
            const apiEndpoint = 'https://hook.eu2.make.com/e4a5hex4s6h4emvc1jnk5b5dhhfazy0q'; // Replace with your actual API endpoint

            // Make POST request with CORS mode
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                mode: 'cors', // Explicitly set CORS mode
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Check if request was successful
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            // Try to parse JSON response, but handle non-JSON responses
            let result;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = { success: true, message: await response.text() };
            }
            console.log('Form submitted successfully:', result);

            // Show success message
            successMessage.classList.remove('hidden');
            form.reset();

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Show more detailed error message
            const errorText = errorMessage.querySelector('span');
            if (errorText) {
                if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                    errorText.textContent = 'Network error: Unable to connect to server. This may be a CORS issue. Please contact support.';
                } else {
                    errorText.textContent = `Error: ${error.message}`;
                }
            }
            
            errorMessage.classList.remove('hidden');
            
            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide error message after 8 seconds (longer for debugging)
            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 8000);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitLoader.classList.add('hidden');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Observe team cards
    document.querySelectorAll('#team > div > div').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Case studies are now in an infinite scroll carousel, no need for scroll animations

    // Add hover effects to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const hero = document.querySelector('main > div:first-child');
        if (hero) {
            const scrolled = currentScroll * 0.5;
            hero.style.transform = `translateY(${scrolled}px)`;
        }
        lastScroll = currentScroll;
    });

    // Add counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (target) {
                    animateCounter(entry.target, target);
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all elements with data-target attribute
    document.querySelectorAll('[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    // Add typing effect to hero text (optional enhancement)
    const heroText = document.querySelector('h1');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        // Uncomment to enable typing effect
        // typeWriter();
    }

    // Flip card functionality for team members
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });

    // Book a Call button functionality
    const bookCallBtn = document.getElementById('bookCallBtn');
    if (bookCallBtn) {
        bookCallBtn.addEventListener('click', function() {
            // You can replace this with your actual booking system URL
            // For example: Calendly, Cal.com, or your custom booking page
            const bookingUrl = 'https://calendly.com/alphaiotascraper/30min'; // Replace with your actual booking link
            
            // Option 1: Open in new tab
            window.open(bookingUrl, '_blank');
            
            // Option 2: Or redirect to booking page
            // window.location.href = bookingUrl;
            
            // Option 3: Or show a modal/alert
            // alert('Redirecting to booking page...');
            // window.location.href = bookingUrl;
        });
    }
});
