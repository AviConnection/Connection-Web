/* ============================================
   AVI CONNECTION - SISTEMA CENTRAL v3.0
   Arquitectura JavaScript Modular y Optimizada
   Incluye: Navbar, Carousel, Idioma, Formulario B2B, etc.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. CONFIGURACIÓN GLOBAL
       -------------------------------------------- */
    const CONFIG = {
        carouselInterval: 6000,      // ms entre slides
        navbarScrollThreshold: 50,    // px para activar scroll
        animationDelay: 300           // ms para animaciones
    };

    /* --------------------------------------------
       2. UTILIDADES Y HELPER FUNCTIONS
       -------------------------------------------- */
    const Utils = {
        // Debounce para eventos de scroll/resize
        debounce(func, delay = 100) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },
        
        // Throttle para eventos frecuentes
        throttle(func, limit = 100) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Detectar si es dispositivo móvil
        isMobile() {
            return window.innerWidth <= 768;
        },
        
        // Smooth scroll mejorado
        smoothScrollTo(element, offset = 80) {
            if (!element) return;
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    /* --------------------------------------------
       3. SELECTOR DE IDIOMA
       -------------------------------------------- */
    class LanguageSelector {
        constructor() {
            this.buttons = document.querySelectorAll('.lang-btn');
            this.currentLang = 'es';
            this.init();
        }
        
        init() {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.getAttribute('data-lang');
                    this.setLanguage(lang);
                });
            });
        }
        
        setLanguage(lang) {
            this.currentLang = lang;
            this.buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-lang') === lang) {
                    btn.classList.add('active');
                }
            });
            console.log(`%c🌐 Idioma cambiado a: ${lang.toUpperCase()}`, 'color: #00f3ff');
            // Aquí se implementaría la lógica de traducción real
            if (lang === 'en') {
                // Simulación de cambio de idioma para elementos clave
                const heroTitle = document.querySelector('.hero-title');
                if(heroTitle) heroTitle.innerHTML = 'AVI <span class="neon-text">CONNECTION</span>';
                const heroDesc = document.querySelector('.hero-description');
                if(heroDesc) heroDesc.textContent = 'Connecting ideas, creating realities.';
                const heroBtn = document.querySelector('.hero-section .btn-primary');
                if(heroBtn) heroBtn.textContent = 'Explore Ecosystem';
            } else {
                const heroTitle = document.querySelector('.hero-title');
                if(heroTitle) heroTitle.innerHTML = 'AVI <span class="neon-text">CONNECTION</span>';
                const heroDesc = document.querySelector('.hero-description');
                if(heroDesc) heroDesc.textContent = 'Conectando ideas, creando realidades.';
                const heroBtn = document.querySelector('.hero-section .btn-primary');
                if(heroBtn) heroBtn.textContent = 'Explorar Ecosistema';
            }
        }
    }

    /* --------------------------------------------
       4. FORMULARIO B2B
       -------------------------------------------- */
    class B2BForm {
        constructor() {
            this.form = document.getElementById('b2bContactForm');
            if (this.form) {
                this.init();
            }
        }
        
        init() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateAndSubmit();
            });
        }
        
        validateAndSubmit() {
            const inputs = this.form.querySelectorAll('input, select, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    this.showError(input, 'Este campo es requerido');
                } else {
                    this.clearError(input);
                }
            });
            
            const emailInput = this.form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    this.showError(emailInput, 'Email corporativo inválido');
                }
            }
            
            if (isValid) {
                this.submitForm();
            }
        }
        
        showError(input, message) {
            input.style.borderColor = '#ff0055';
            input.style.boxShadow = '0 0 10px rgba(255, 0, 85, 0.3)';
            
            let errorEl = input.parentElement?.querySelector('.error-message');
            if (!errorEl && input.parentElement) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-message';
                errorEl.style.color = '#ff0055';
                errorEl.style.fontSize = '0.7rem';
                errorEl.style.marginTop = '5px';
                errorEl.style.display = 'block';
                input.parentElement.appendChild(errorEl);
            }
            if (errorEl) errorEl.textContent = message;
        }
        
        clearError(input) {
            input.style.borderColor = '';
            input.style.boxShadow = '';
            const errorEl = input.parentElement?.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        }
        
        submitForm() {
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent;
            
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
            }
            
            setTimeout(() => {
                alert('✅ ¡Solicitud enviada con éxito! Un asesor de AVI CONNECTION se contactará en las próximas 24 horas.');
                this.form.reset();
                
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
                
                const event = new CustomEvent('b2bFormSubmit', {
                    detail: { timestamp: new Date().toISOString() }
                });
                document.dispatchEvent(event);
                
                console.log('%c📧 Formulario B2B enviado exitosamente', 'color: #00ff55');
            }, 1500);
        }
    }

    /* --------------------------------------------
       5. NEWSLETTER
       -------------------------------------------- */
    class Newsletter {
        constructor() {
            this.btn = document.querySelector('.footer-newsletter button');
            this.input = document.querySelector('.footer-newsletter input');
            if (this.btn) {
                this.init();
            }
        }
        
        init() {
            this.btn.addEventListener('click', () => {
                if (this.input && this.input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(this.input.value)) {
                        alert('✅ ¡Gracias por suscribirte! Recibirás las últimas novedades de AVI CONNECTION.');
                        this.input.value = '';
                    } else {
                        alert('📧 Por favor ingresa un email válido');
                    }
                } else {
                    alert('📧 Por favor ingresa tu email');
                }
            });
        }
    }

    /* --------------------------------------------
       6. NAVBAR INTERACTIVA Y SCROLL
       -------------------------------------------- */
    class NavbarManager {
        constructor() {
            this.navbar = document.getElementById('dynamicIslandNav');
            this.menuToggle = document.querySelector('.menu-toggle-nav');
            this.navLinks = document.querySelector('.island-nav-links');
            this.lastScrollY = window.scrollY;
            this.init();
        }
        
        init() {
            if (!this.navbar) return;
            
            // Evento de scroll con throttle para rendimiento
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 50));
            
            // Manejo de enlaces internos
            this.handleInternalLinks();
            
            // Menú móvil
            this.initMobileMenu();
        }
        
        handleScroll() {
            const currentScrollY = window.scrollY;
            const heroSection = document.getElementById('inicio');

            // --- NUEVO: Cálculo de la Barra de Progreso ---
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (currentScrollY / scrollHeight) * 100;
            const progressBar = document.getElementById('navProgress');
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
            
            // Calculamos el 80% de la altura del Header. 
            // Cuando el usuario pase esa marca, la navbar aparecerá.
            const triggerPoint = heroSection ? heroSection.offsetHeight * 0.8 : window.innerHeight * 0.8;
            
            if (currentScrollY > triggerPoint) {
                // El usuario ya pasó el Header: REVELAR NAVBAR
                this.navbar.classList.add('revealed');
                this.navbar.classList.add('scrolled');
                
                // Mantenemos tu lógica de ocultar al hacer scroll rápido hacia abajo para no estorbar
                if (currentScrollY > this.lastScrollY && currentScrollY > triggerPoint + 200) {
                    this.navbar.style.transform = 'translate(-50%, -150%)'; // Esconde arriba
                } else {
                    this.navbar.style.transform = 'translate(-50%, 0)'; // Muestra
                }
            } else {
                // El usuario regresó al inicio (Header): OCULTAR NAVBAR
                this.navbar.classList.remove('revealed');
                this.navbar.classList.remove('scrolled');
                this.navbar.style.transform = 'translate(-50%, 0)'; // Resetear transform
            }
            
            this.lastScrollY = currentScrollY;
        }
        
        handleInternalLinks() {
            const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        Utils.smoothScrollTo(targetElement);
                        
                        // Actualizar URL sin scroll brusco
                        history.pushState(null, null, targetId);
                        
                        // Cerrar menú móvil si está abierto
                        this.closeMobileMenu();
                        
                        // Actualizar clase active en el nav
                        this.updateActiveNavLink(targetId);
                    }
                });
            });
        }
        
        updateActiveNavLink(targetId) {
            const navLinks = document.querySelectorAll('.nav-link-island');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === targetId) {
                    link.classList.add('active');
                } else if (href !== '#inicio' && href !== '#') {
                    link.classList.remove('active');
                }
            });
        }
        
        initMobileMenu() {
            if (this.menuToggle && this.navLinks) {
                this.menuToggle.addEventListener('click', () => {
                    const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
                    this.menuToggle.setAttribute('aria-expanded', !isExpanded);
                    this.navLinks.classList.toggle('open');
                    
                    // Animación del botón
                    this.menuToggle.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
                    setTimeout(() => {
                        this.menuToggle.style.transform = '';
                    }, 300);
                });
            }
        }
        
        closeMobileMenu() {
            if (this.navLinks && this.navLinks.classList.contains('open')) {
                this.navLinks.classList.remove('open');
                if (this.menuToggle) this.menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    /* --------------------------------------------
       7. RED NEURONAL INTERACTIVA
       -------------------------------------------- */
    class ParticleNetwork {
        constructor() {
            this.canvas = document.getElementById('particle-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };
            this.colors = ['#00f3ff', '#ff0055', '#0066ff']; // Cyan, Magenta, Azul
            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.canvas.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
            this.createParticles();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createParticles(); // Recalcular densidad
        }

        createParticles() {
            this.particles = [];
            const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000); 
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)]
                });
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                p.x += p.speedX;
                p.y += p.speedY;

                // Rebote en bordes
                if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.fill();

                // Conectar entre partículas
                for (let j = i; j < this.particles.length; j++) {
                    let p2 = this.particles[j];
                    const distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 - distance/500})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }

                // Conexión con el ratón (La magia interactiva)
                if (this.mouse.x != null) {
                    const distanceMouse = Math.sqrt(Math.pow(p.x - this.mouse.x, 2) + Math.pow(p.y - this.mouse.y, 2));
                    if (distanceMouse < this.mouse.radius) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(255, 0, 85, ${0.8 - distanceMouse/this.mouse.radius})`; // Rayo magenta
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(this.mouse.x, this.mouse.y);
                        this.ctx.stroke();
                        // Ligera atracción
                        p.x -= (p.x - this.mouse.x) * 0.01;
                        p.y -= (p.y - this.mouse.y) * 0.01;
                    }
                }
            }
        }
    }

    /* --------------------------------------------
       7.1 EFECTO IA: TEXT SCRAMBLE Y TYPEWRITER
       -------------------------------------------- */
    class AITextEffect {
        constructor() {
            this.titleEl = document.querySelector('.scramble-text');
            this.descEl = document.querySelector('.typewriter-text');
            this.slidesData = [
                { title: "AVI CONNECTION", desc: "Conectando ideas, creando realidades. El ecosistema tecnológico definitivo." },
                { title: "CONNECTION LABS", desc: "IA SUBGERENTE: ALEX. Motor de I+D e Ingeniería de Software Avanzada." },
                { title: "CONNECTION PÍXEL", desc: "IA SUBGERENTE: VINSHI. Diseño visual de alto impacto y estética inmersiva." },
                { title: "CONNECTION EXPLORER", desc: "IA SUBGERENTE: EXPLORA. Descubre los mejores destinos y experiencias únicas." },
                { title: "CONNECTION LIFE", desc: "IA SUBGERENTE: LAYLA. Biometría y telemedicina autónoma." },
                { title: "CONNECTION LINK", desc: "IA SUBGERENTE: IVI. Infraestructura física, hardware y sistemas embebidos." },
                { title: "CONNECTION THINK", desc: "IA SUBGERENTE: SOFÍA. Gestión del conocimiento y tutoría adaptativa." }
            ];
            this.currentIndex = 0;
            this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
            if(this.titleEl && this.descEl) this.init();
        }

        init() {
            setTimeout(() => this.cycleText(), 500);
        }

        async cycleText() {
            const currentData = this.slidesData[this.currentIndex];
            
            // Efecto Hacker en el título
            this.scrambleText(this.titleEl, currentData.title);
            
            // Efecto de escribir
            await this.typeWriter(currentData.desc);
            
            // Leer durante 3.5 segundos
            await new Promise(r => setTimeout(r, 3500));
            
            // Borrar
            await this.deleteWriter();
            
            this.currentIndex = (this.currentIndex + 1) % this.slidesData.length;
            this.cycleText(); // Loop infinito
        }

        scrambleText(element, newText) {
            const length = Math.max(element.innerText.length, newText.length);
            const queue = [];
            for (let i = 0; i < length; i++) {
                const from = element.innerText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                queue.push({ from, to, start, end });
            }

            let frame = 0;
            const update = () => {
                let output = '';
                let complete = 0;
                for (let i = 0; i < queue.length; i++) {
                    let { from, to, start, end, char } = queue[i];
                    if (frame >= end) {
                        complete++;
                        output += to;
                    } else if (frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.chars[Math.floor(Math.random() * this.chars.length)];
                            queue[i].char = char;
                        }
                        output += `<span style="color:var(--neon-cyan); opacity:0.7">${char}</span>`;
                    } else {
                        output += from;
                    }
                }
                element.innerHTML = output;
                if (complete !== queue.length) {
                    requestAnimationFrame(update);
                    frame++;
                }
            };
            update();
        }

        async typeWriter(text) {
            this.descEl.innerHTML = '';
            for (let i = 0; i < text.length; i++) {
                this.descEl.innerHTML += text.charAt(i);
                await new Promise(r => setTimeout(r, 30)); 
            }
        }

        async deleteWriter() {
            let text = this.descEl.innerHTML;
            while (text.length > 0) {
                text = text.substring(0, text.length - 1);
                this.descEl.innerHTML = text;
                await new Promise(r => setTimeout(r, 15)); 
            }
        }
    }

    /* --------------------------------------------
       8. ANIMACIONES AL SCROLL (Intersection Observer)
       -------------------------------------------- */
    class ScrollAnimator {
        constructor() {
            this.animatedElements = document.querySelectorAll(
                '.pillar-card, .stat-card, .mv-card, .tech-stack-section, .contact-b2b-wrapper'
            );
            this.init();
        }
        
        init() {
            if (!('IntersectionObserver' in window)) {
                // Fallback para navegadores antiguos
                this.animatedElements.forEach(el => el.style.opacity = '1');
                return;
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            this.animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
    }

    /* --------------------------------------------
       9. ESTADÍSTICAS CON CONTADOR ANIMADO
       -------------------------------------------- */
    class AnimatedCounter {
        constructor() {
            this.statNumbers = document.querySelectorAll('.stat-number');
            this.hasAnimated = false;
            this.init();
        }
        
        init() {
            if (!('IntersectionObserver' in window)) {
                this.animateAll();
                return;
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateAll();
                        this.hasAnimated = true;
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            
            const statsContainer = document.querySelector('.stats-grid');
            if (statsContainer) observer.observe(statsContainer);
        }
        
        animateAll() {
            this.statNumbers.forEach(stat => {
                const target = parseInt(stat.innerText, 10);
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.innerText = target;
                        clearInterval(timer);
                    } else {
                        stat.innerText = Math.floor(current);
                    }
                }, 30);
            });
        }
    }

    /* --------------------------------------------
       10. PRELOADER MEJORADO
       -------------------------------------------- */
    class Preloader {
        constructor() {
            this.preloader = document.getElementById('preloader');
            if (!this.preloader) return;
            
            this.init();
        }
        
        init() {
            // Esperar a que todos los recursos críticos carguen
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.preloader.classList.add('hide');
                    setTimeout(() => {
                        this.preloader.style.display = 'none';
                    }, 500);
                }, 500);
            });
        }
    }

    /* --------------------------------------------
       11. SISTEMA DE DIAGNÓSTICO (Consola)
       -------------------------------------------- */
    class SystemDiagnostic {
        constructor() {
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00f3ff');
            console.log('%c   AVI CONNECTION - MATRIZ CENTRAL ACTIVADA   ', 'color: #00f3ff; font-size: 14px; font-weight: bold');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00f3ff');
            console.log('%c✓ Sistema de IA: AVI [v.4.7.2]', 'color: #0f0');
            console.log('%c✓ Pilares activos: 7/22', 'color: #0f0');
            console.log('%c✓ Tech Stack: AWS, Stripe, Meta Llama 3, Node.js, React, Figma', 'color: #0f0');
            console.log('%c✓ Modo: Operación Óptima', 'color: #0f0');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00f3ff');
        }
    }

    /* --------------------------------------------
       12. INICIALIZACIÓN DE MÓDULOS
       -------------------------------------------- */
    
    // Inicializar todos los módulos
    const preloader = new Preloader();
    const navbarManager = new NavbarManager();
    const particleNetwork = new ParticleNetwork();
    const aiTextEffect = new AITextEffect();
    const animatedCounter = new AnimatedCounter();
    const languageSelector = new LanguageSelector();
    const b2bForm = new B2BForm();
    const newsletter = new Newsletter();
    const diagnostic = new SystemDiagnostic();
    
    // Exportar para debugging (opcional)
    window.AVI = {
        version: '4.0',
        modules: {
            navbar: navbarManager,
            language: languageSelector
        },
        config: CONFIG
    };
    
    /* --------------------------------------------
       13. EVENTOS PERSONALIZADOS Y ANALYTICS
       -------------------------------------------- */
    
    // Registrar tiempo de carga
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`%c⏱ Tiempo de carga: ${loadTime}ms`, 'color: #888');
        
        // Evento personalizado
        const event = new CustomEvent('aviLoaded', {
            detail: { loadTime, timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);
        document.body.classList.add('loaded');
    });
    
    // Detectar errores no capturados
    window.addEventListener('error', (e) => {
        console.error('%c[AVI ERROR]', 'color: #f00', e.error);
    });
    
    // Soporte para prefers-reduced-motion (Accesibilidad)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }
    
    console.log('%c✓ Sistema AVI Connection inicializado correctamente', 'color: #00f3ff');
});