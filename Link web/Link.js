/* ============================================
   CONNECTION LINK - SISTEMA INTERACTIVO v1.0
   IA Líder: IVI | Hardware y Sistemas Embebidos
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. CONFIGURACIÓN GLOBAL
       -------------------------------------------- */
    const CONFIG = {
        preloaderDelay: 1000,
        scrollThreshold: 50,
        animationDelay: 300
    };
    
    /* --------------------------------------------
       2. DATOS DE HARDWARE Y SISTEMAS
       -------------------------------------------- */
    const HARDWARE_SPECS = {
        microcontrollers: [
            { name: 'ARM Cortex-M7', cores: 1, freq: '480MHz', power: '150mW' },
            { name: 'ESP32-S3', cores: 2, freq: '240MHz', power: '200mW' },
            { name: 'RP2040', cores: 2, freq: '133MHz', power: '80mW' },
            { name: 'STM32H7', cores: 2, freq: '480MHz', power: '250mW' }
        ],
        connectivity: [
            { type: 'LTE-M', bandwidth: '1Mbps', latency: '50ms', range: '10km' },
            { type: 'NB-IoT', bandwidth: '200kbps', latency: '1.5s', range: '15km' },
            { type: 'LoRaWAN', bandwidth: '50kbps', latency: '2s', range: '20km' },
            { type: 'Bluetooth 5.3', bandwidth: '2Mbps', latency: '5ms', range: '400m' }
        ]
    };
    
    /* --------------------------------------------
       3. CLASE DE GESTIÓN DE HARDWARE
       -------------------------------------------- */
    class HardwareManager {
        constructor() {
            this.init();
        }
        
        init() {
            this.logHardwareStatus();
        }
        
        logHardwareStatus() {
            console.log('%c🔧 Hardware Status:', 'color: #ffaa00');
            console.log('Microcontroladores soportados:', HARDWARE_SPECS.microcontrollers.length);
            console.log('Tecnologías de conectividad:', HARDWARE_SPECS.connectivity.length);
        }
        
        getMicrocontrollerInfo(name) {
            return HARDWARE_SPECS.microcontrollers.find(mcu => mcu.name === name);
        }
    }
    
    /* --------------------------------------------
       4. CLASE DE GESTIÓN DE LYAN OS
       -------------------------------------------- */
    class LyanOSManager {
        constructor() {
            this.version = '3.2';
            this.kernel = 'LYAN Microkernel';
            this.languages = ['Rust', 'C++17', 'Assembly'];
            this.architectures = ['ARM', 'RISC-V', 'x86_64'];
            this.init();
        }
        
        init() {
            this.logOSInfo();
        }
        
        logOSInfo() {
            console.log('%c🖥️ LYAN OS Information:', 'color: #ffaa00');
            console.log(`Versión: ${this.version}`);
            console.log(`Kernel: ${this.kernel}`);
            console.log(`Lenguajes: ${this.languages.join(', ')}`);
            console.log(`Arquitecturas: ${this.architectures.join(', ')}`);
        }
        
        getSpecs() {
            return {
                version: this.version,
                kernel: this.kernel,
                languages: this.languages,
                architectures: this.architectures
            };
        }
    }
    
    /* --------------------------------------------
       5. CLASE DE GESTIÓN DE CONECTIVIDAD
       -------------------------------------------- */
    class ConnectivityManager {
        constructor() {
            this.init();
        }
        
        init() {
            this.simulateNetworkStatus();
        }
        
        simulateNetworkStatus() {
            setInterval(() => {
                const latency = Math.floor(Math.random() * 30 + 10);
                const bandwidth = (Math.random() * 50 + 50).toFixed(1);
                // Actualizar UI si existe
                const statusElement = document.querySelector('.network-status');
                if (statusElement) {
                    statusElement.innerHTML = `📡 Latencia: ${latency}ms | Ancho de banda: ${bandwidth}Mbps`;
                }
            }, 5000);
        }
        
        getTechStack() {
            return HARDWARE_SPECS.connectivity;
        }
    }
    
    /* --------------------------------------------
       6. NAVBAR DYNAMIC ISLAND
       -------------------------------------------- */
    class NavbarManager {
        constructor() {
            this.navbar = document.getElementById('dynamicIsland');
            this.menuToggle = document.querySelector('.menu-toggle-link');
            this.navLinks = document.querySelector('.island-links');
            this.init();
        }
        
        init() {
            this.handleScroll();
            this.setupMobileMenu();
            this.setupSmoothScroll();
            
            window.addEventListener('scroll', () => this.handleScroll());
        }
        
        handleScroll() {
            if (this.navbar) {
                if (window.scrollY > CONFIG.scrollThreshold) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }
        }
        
        setupMobileMenu() {
            if (this.menuToggle && this.navLinks) {
                this.menuToggle.addEventListener('click', () => {
                    this.navLinks.classList.toggle('open');
                    this.menuToggle.classList.toggle('active');
                });
            }
        }
        
        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId && targetId !== '#') {
                        const target = document.querySelector(targetId);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            if (this.navLinks) this.navLinks.classList.remove('open');
                        }
                    }
                });
            });
        }
    }
    
    /* --------------------------------------------
       7. ANIMACIONES AL SCROLL
       -------------------------------------------- */
    class ScrollAnimator {
        constructor() {
            this.elements = document.querySelectorAll('.lyan-card, .embedded-card, .iomt-card, .connectivity-card, .product-card, .testimonial-card');
            this.init();
        }
        
        init() {
            if (!('IntersectionObserver' in window)) {
                this.fallbackAnimation();
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
            }, { threshold: 0.1, rootMargin: '50px' });
            
            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
        
        fallbackAnimation() {
            this.elements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    }
    
    /* --------------------------------------------
       8. CONTADOR DE ESTADÍSTICAS
       -------------------------------------------- */
    class StatsCounter {
        constructor() {
            this.statNumbers = document.querySelectorAll('.stat-number');
            this.hasAnimated = false;
            this.init();
        }
        
        init() {
            if (!('IntersectionObserver' in window)) {
                this.animateCounters();
                return;
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateCounters();
                        this.hasAnimated = true;
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            
            const statsSection = document.querySelector('.hero-stats');
            if (statsSection) observer.observe(statsSection);
        }
        
        animateCounters() {
            this.statNumbers.forEach(stat => {
                const text = stat.innerText;
                const numericText = text.replace(/[^0-9]/g, '');
                if (!numericText) return;
                
                const target = parseInt(numericText, 10);
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
        }
    }
    
    /* --------------------------------------------
       9. PRELOADER
       -------------------------------------------- */
    class Preloader {
        constructor() {
            this.preloader = document.getElementById('preloaderLink');
            if (!this.preloader) return;
            this.init();
        }
        
        init() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.preloader.classList.add('hide');
                    setTimeout(() => {
                        this.preloader.style.display = 'none';
                    }, 600);
                }, CONFIG.preloaderDelay);
                document.body.classList.add('loaded');
            });
        }
    }
    
    /* --------------------------------------------
       10. FUNCIONES GLOBALES
       -------------------------------------------- */
    window.notifyProduct = (productName) => {
        alert(`🔌 ¡Gracias por tu interés en ${productName}!\n\nRecibirás notificaciones cuando este dispositivo esté disponible.\n\nIA Líder: IVI - CONNECTION LINK`);
        console.log(`%c🔌 Notificación de producto: ${productName}`, 'color: #ffaa00');
    };
    
    /* --------------------------------------------
       11. SYSTEM DIAGNOSTIC
       -------------------------------------------- */
    class SystemDiagnostic {
        constructor() {
            this.init();
        }
        
        init() {
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ffaa00; font-size: 12px');
            console.log('%c   CONNECTION LINK - IA IVI ACTIVADA   ', 'color: #ffaa00; font-size: 14px; font-weight: bold');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ffaa00; font-size: 12px');
            console.log('%c✓ IA Líder: IVI [v.1.0]', 'color: #00ff55');
            console.log('%c✓ Sistema Operativo: LYAN OS v3.2', 'color: #00ff55');
            console.log('%c✓ Arquitecturas: ARM, RISC-V, x86_64', 'color: #00ff55');
            console.log('%c✓ Conectividad: LTE-M, NB-IoT, LoRaWAN, Bluetooth 5.3', 'color: #00ff55');
            console.log('%c✓ Seguridad: TPM 2.0, Secure Enclave, eSIM', 'color: #00ff55');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ffaa00; font-size: 12px');
        }
    }
    
    /* --------------------------------------------
       12. INICIALIZACIÓN DE MÓDULOS
       -------------------------------------------- */
    const preloader = new Preloader();
    const navbarManager = new NavbarManager();
    const hardwareManager = new HardwareManager();
    const lyanOSManager = new LyanOSManager();
    const connectivityManager = new ConnectivityManager();
    const scrollAnimator = new ScrollAnimator();
    const statsCounter = new StatsCounter();
    const diagnostic = new SystemDiagnostic();
    
    // Exportar para debugging
    window.LINK = {
        version: '1.0',
        modules: {
            hardware: hardwareManager,
            lyanOS: lyanOSManager,
            connectivity: connectivityManager
        },
        config: CONFIG,
        hardwareSpecs: HARDWARE_SPECS
    };
    
    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`%c⏱ Tiempo de carga: ${loadTime}ms`, 'color: #888');
    });
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('%c[LINK ERROR]', 'color: #ff0055', e.error?.message || e.message);
    });
    
    console.log('%c🔌 CONNECTION LINK | Hardware listo para conectar', 'color: #ffaa00; font-size: 12px');
});