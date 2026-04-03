/* ============================================
   CONNECTION THINK - SISTEMA INTERACTIVO
   IA Líder: SOFÍA | Gestión del Conocimiento
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. PRELOADER
       -------------------------------------------- */
    const preloader = document.getElementById('preloaderThink');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 1500);
    }
    
    /* --------------------------------------------
       2. DYNAMIC ISLAND NAVIGATION
       -------------------------------------------- */
    const menuToggle = document.querySelector('.menu-toggle-think');
    const navLinks = document.querySelector('.island-links');
    const navbar = document.getElementById('dynamicIsland');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    /* --------------------------------------------
       3. SMOOTH SCROLL
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
       4. SCROLL ANIMATIONS
       -------------------------------------------- */
    const animatedElements = document.querySelectorAll('.education-card, .ml-card, .npl-card, .research-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    /* --------------------------------------------
       5. COUNTER ANIMATION
       -------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const text = stat.innerText;
                    const target = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    if (isNaN(target)) return;
                    
                    let current = 0;
                    const increment = target / 50;
                    const originalText = text;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.innerText = originalText;
                            clearInterval(timer);
                        } else {
                            stat.innerText = Math.floor(current) + (originalText.includes('+') ? '+' : '');
                        }
                    }, 30);
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);
    
    /* --------------------------------------------
       6. SYSTEM DIAGNOSTIC
       -------------------------------------------- */
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6b5bff');
    console.log('%c   CONNECTION THINK - SOFÍA ACTIVADA   ', 'color: #6b5bff; font-size: 14px; font-weight: bold');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6b5bff');
    console.log('%c✓ IA Líder: SOFÍA [v.1.0]', 'color: #0f0');
    console.log('%c✓ Especialidad: Gestión del Conocimiento | Educación | NLP', 'color: #0f0');
    console.log('%c✓ Modo: Análisis Predictivo Activo', 'color: #0f0');
    console.log('%c✓ Tutoría Adaptativa: Disponible 24/7', 'color: #0f0');
});