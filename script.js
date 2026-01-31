// Extracted script from index.html

// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (guarded)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when clicking a link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Contact modal: open from hero button
    const contactBtn = document.getElementById('contactBtn');
    const contactModalOverlay = document.getElementById('contactModalOverlay');
    const contactModalClose = document.getElementById('contactModalClose');

    function openContactModal() {
        if (!contactModalOverlay) return;
        contactModalOverlay.style.display = 'flex';
        contactModalOverlay.setAttribute('aria-hidden', 'false');
        const modal = contactModalOverlay.querySelector('.modal');
        setTimeout(() => modal.classList.add('open'), 10);
        // move focus for accessibility
        try { modal.setAttribute('tabindex', '-1'); modal.focus({preventScroll: true}); } catch (e) {}
    }

    function closeContactModal() {
        if (!contactModalOverlay) return;
        const modal = contactModalOverlay.querySelector('.modal');
        modal.classList.remove('open');
        contactModalOverlay.setAttribute('aria-hidden', 'true');
        setTimeout(() => { contactModalOverlay.style.display = 'none'; }, 220);
        try { contactBtn.focus(); } catch (e) {}
    }

    if (contactBtn) contactBtn.addEventListener('click', openContactModal);
    if (contactModalClose) contactModalClose.addEventListener('click', closeContactModal);
    if (contactModalOverlay) contactModalOverlay.addEventListener('click', function(e) { if (e.target === this) closeContactModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && contactModalOverlay && contactModalOverlay.style.display === 'flex') closeContactModal(); });
    
    // Add fade-in animation to cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all section cards and stagger their reveal
    const cards = document.querySelectorAll('.section-card');
    cards.forEach((card, idx) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${idx * 120}ms`;
        observer.observe(card);
    });

    // Hero entrance animations: name, typing title, and image float
    const heroName = document.querySelector('.hero-name');
    const heroTitle = document.querySelector('.hero-title');
    const heroImage = document.querySelector('.hero-image');

    // Reveal hero name
    setTimeout(() => {
        if (heroName) {
            heroName.style.opacity = '1';
            heroName.style.transform = 'translateY(0)';
        }
    }, 250);

    // Typing effect for hero title
    if (heroTitle) {
        const fullText = heroTitle.textContent.trim();
        heroTitle.textContent = '';
        heroTitle.classList.add('typewriter');
        let pos = 0;
        const speed = 30; // ms per character
        function typeChar() {
            if (pos < fullText.length) {
                heroTitle.textContent += fullText.charAt(pos);
                pos += 1;
                setTimeout(typeChar, speed);
            } else {
                heroTitle.classList.remove('typewriter');
            }
        }
        setTimeout(typeChar, 700);
    }

    // Slight pop for hero image
    if (heroImage) {
        heroImage.style.transform = 'translateY(0)';
        heroImage.style.opacity = '1';
    }
    
    // Smooth scrolling for anchor links (works with sticky sidebar)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offset = 100; // keep space from top (matches sticky header/spacing)
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });

                // Accessibility: ensure the target can receive focus
                try {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                } catch (err) {
                    // ignore focus errors in older browsers
                }
            }

            // If a nav link was clicked, close the mobile menu (guarded)
            if (this.closest('.nav-links') && navLinks && mobileMenuBtn) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Add active state to navigation (include links that point to non-.section-card elements like the sidebar contact)
    const navLinksAll = document.querySelectorAll('.nav-links a');
    const sections = Array.from(navLinksAll).map(link => {
        const id = link.getAttribute('href');
        return (id && id.startsWith('#')) ? document.querySelector(id) : null;
    }).filter(Boolean);

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            const sectionHeight = section.clientHeight || section.offsetHeight;

            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    
});
