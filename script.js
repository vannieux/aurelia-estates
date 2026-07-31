document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-aurelia-dark/95', 'backdrop-blur-md', 'py-4');
            navbar.classList.remove('bg-transparent', 'py-6');
        } else {
            navbar.classList.add('bg-transparent', 'py-6');
            navbar.classList.remove('bg-aurelia-dark/95', 'backdrop-blur-md', 'py-4');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => mobileMenu.classList.remove('opacity-0'), 10);
            document.body.style.overflow = 'hidden';
            menuBtn.innerHTML = '<svg class="w-8 h-8 text-aurelia-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>';
        } else {
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => mobileMenu.classList.add('hidden'), 500);
            document.body.style.overflow = '';
            menuBtn.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
    }));

    /* --- Scroll Reveal Animations --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => revealObserver.observe(reveal));

    /* --- Counter Animation --- */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);
                let frame = 0;
                
                const count = setInterval(() => {
                    frame++;
                    const progress = frame / totalFrames;
                    const currentCount = Math.floor(target * progress);

                    counter.innerText = currentCount;

                    if (frame === totalFrames) {
                        clearInterval(count);
                        counter.innerText = target;
                    }
                }, frameDuration);
            });
        }
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].parentElement.parentElement);
    }

    /* --- Mortgage Calculator Logic --- */
    const propValueInput = document.getElementById('prop-value');
    const downPaymentInput = document.getElementById('down-payment');
    const interestRateInput = document.getElementById('interest-rate');
    const loanTermSelect = document.getElementById('loan-term');
    const monthlyPaymentDisplay = document.getElementById('monthly-payment');

    function calculateMortgage() {
        const propValue = parseFloat(propValueInput.value) || 0;
        const downPaymentPct = parseFloat(downPaymentInput.value) || 0;
        const interestRateAnn = parseFloat(interestRateInput.value) || 0;
        const loanTermYrs = parseInt(loanTermSelect.value) || 30;

        const downPayment = propValue * (downPaymentPct / 100);
        const principal = propValue - downPayment;
        
        if (principal <= 0 || interestRateAnn <= 0) {
            monthlyPaymentDisplay.innerText = "$0";
            return;
        }

        const monthlyRate = (interestRateAnn / 100) / 12;
        const totalPayments = loanTermYrs * 12;

        const mathPower = Math.pow(1 + monthlyRate, totalPayments);
        const monthlyPayment = (principal * monthlyRate * mathPower) / (mathPower - 1);

        // Format to currency
        monthlyPaymentDisplay.innerText = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(monthlyPayment);
    }

    // Attach listeners
    [propValueInput, downPaymentInput, interestRateInput, loanTermSelect].forEach(el => {
        el.addEventListener('input', calculateMortgage);
        el.addEventListener('change', calculateMortgage);
    });
    
    // Initial calculation
    calculateMortgage();

    /* --- FAQ Accordion --- */
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('span:last-child');
            
            if (content.classList.contains('hidden')) {
                // Close others
                document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
                document.querySelectorAll('.faq-btn span:last-child').forEach(i => i.style.transform = 'rotate(0deg)');
                
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(45deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
});