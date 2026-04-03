/* ============================================
   CONNECTION PÍXEL - SISTEMA INTERACTIVO v3.0
   IA Líder: VINSHI | Experiencia Visual Dinámica
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. CONFIGURACIÓN GLOBAL
       -------------------------------------------- */
    const CONFIG = {
        carouselInterval: 7000,
        scrollThreshold: 50,
        particleCount: 40  // Reducido para mejor rendimiento
    };
    
    /* --------------------------------------------
       2. PRELOADER
       -------------------------------------------- */
    const preloader = document.getElementById('preloaderPixel');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hide');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 500); // Reducido de 800 a 500ms
            document.body.classList.add('loaded');
        });
    }
    
    /* --------------------------------------------
       3. DYNAMIC ISLAND NAVIGATION
       -------------------------------------------- */
    const navbar = document.getElementById('dynamicIsland');
    const menuToggle = document.querySelector('.menu-toggle-pixel');
    const navLinks = document.querySelector('.island-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > CONFIG.scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    /* --------------------------------------------
       4. SMOOTH SCROLL
       -------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (navLinks) navLinks.classList.remove('open');
                }
            }
        });
    });
    
    /* --------------------------------------------
       5. CARRUSEL AVANZADO
       -------------------------------------------- */
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot-btn');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressBar = document.getElementById('carousel-progress');
    const currentNum = document.querySelector('.current-slide-num');
    let autoInterval, progressInterval;
    
    function showSlide(index) {
        if (!slides.length) return;
        index = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        if (currentNum) currentNum.textContent = String(index + 1).padStart(2, '0');
        currentSlide = index;
        resetAutoPlay();
    }
    
    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }
    
    function startAutoPlay() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => nextSlide(), CONFIG.carouselInterval);
        startProgress();
    }
    
    function stopAutoPlay() {
        clearInterval(autoInterval);
        clearInterval(progressInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    function startProgress() {
        if (!progressBar) return;
        progressBar.style.width = '0%';
        const start = Date.now();
        progressInterval = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min((elapsed / CONFIG.carouselInterval) * 100, 100);
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(progressInterval);
        }, 30);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    
    const hero = document.querySelector('.pixel-carousel-hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopAutoPlay);
        hero.addEventListener('mouseleave', startAutoPlay);
    }
    startAutoPlay();
    
    /* --------------------------------------------
       6. PARTICLE SYSTEM (Optimizado)
       -------------------------------------------- */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        let particles = [];
        let animationId;
        
        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');
            
            for (let i = 0; i < CONFIG.particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.3,
                    speedX: (Math.random() - 0.5) * 0.15,
                    speedY: (Math.random() - 0.5) * 0.15
                });
            }
            
            function animateParticles() {
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(p => {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    
                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 100, 150, ${p.alpha * 0.3})`;
                    ctx.fill();
                });
                
                animationId = requestAnimationFrame(animateParticles);
            }
            
            animateParticles();
        }
        
        initParticles();
        
        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationId);
            particles = [];
            initParticles();
        });
    }
    
    /* --------------------------------------------
       7. PORTFOLIO FILTERS
       -------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    /* --------------------------------------------
       8. CONTACT FORM
       -------------------------------------------- */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('✅ Mensaje enviado. VINSHI se pondrá en contacto contigo pronto.');
            form.reset();
        });
    }
    
    /* --------------------------------------------
       9. NEWSLETTER
       -------------------------------------------- */
    const newsletterBtn = document.querySelector('.footer-newsletter button');
    const newsletterInput = document.querySelector('.footer-newsletter input');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            if (newsletterInput && newsletterInput.value.trim()) {
                alert('✅ ¡Gracias por suscribirte! Recibirás novedades de CONNECTION PÍXEL.');
                newsletterInput.value = '';
            } else {
                alert('📧 Por favor ingresa tu email');
            }
        });
    }
    
    /* --------------------------------------------
       10. SYSTEM DIAGNOSTIC
       -------------------------------------------- */
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ff0055');
    console.log('%c   CONNECTION PÍXEL - VINSHI ACTIVADA   ', 'color: #ff0055; font-size: 14px; font-weight: bold');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ff0055');
    console.log('%c✓ IA Líder: VINSHI [v.3.2]', 'color: #0f0');
    console.log('%c✓ Modo: Creativo | Estética Digital Avanzada', 'color: #0f0');
    console.log('%c✓ Liquid Hover Effect: ACTIVADO (Canvas 2D)', 'color: #0f0');
    console.log('%c✓ Optimizado para rendimiento', 'color: #0f0');
    console.log('%c✓ Misión y Visión: Activas', 'color: #0f0');
    console.log('%c✓ 6 Servicios | 6 Proyectos Destacados', 'color: #0f0');
});