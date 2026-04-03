/* ============================================
   CONNECTION LIFE - SISTEMA INTERACTIVO v1.0
   IA Líder: LAYLA | Salud y Bienestar
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. CONFIGURACIÓN GLOBAL
       -------------------------------------------- */
    const CONFIG = {
        preloaderDelay: 1000,
        scrollThreshold: 50,
        animationDelay: 300,
        ecgUpdateInterval: 2000,
        vitalsUpdateInterval: 3000
    };
    
    /* --------------------------------------------
       2. DATOS DE BIOMETRÍA
       -------------------------------------------- */
    const BIOMETRIC_DATA = {
        heartRate: { min: 60, max: 100, unit: 'BPM' },
        spo2: { min: 95, max: 100, unit: '%' },
        temperature: { min: 36.0, max: 37.5, unit: '°C' },
        bloodPressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } }
    };
    
    /* --------------------------------------------
       3. CLASE DE SIMULACIÓN DE ECG
       -------------------------------------------- */
    class ECGSimulator {
        constructor() {
            this.ecgLine = document.getElementById('ecgLine');
            this.bpmValue = document.getElementById('bpmValue');
            this.spo2Value = document.getElementById('spo2Value');
            this.interval = null;
            this.vitalsInterval = null;
            this.init();
        }
        
        init() {
            this.generateECG();
            this.startSimulation();
            this.startVitalsSimulation();
        }
        
        generateECG() {
            if (!this.ecgLine) return;
            
            let points = [];
            for (let i = 0; i < 100; i++) {
                let y;
                // Simulación de onda cardíaca
                if (i < 20) y = 50;
                else if (i < 25) y = 20;
                else if (i < 30) y = 80;
                else if (i < 35) y = 20;
                else if (i < 40) y = 50;
                else y = 50 + Math.sin(i * 0.3) * 5;
                points.push(`${i},${y}`);
            }
            this.ecgLine.setAttribute('points', points.join(' '));
        }
        
        startSimulation() {
            this.interval = setInterval(() => {
                this.generateECG();
            }, CONFIG.ecgUpdateInterval);
        }
        
        startVitalsSimulation() {
            this.vitalsInterval = setInterval(() => {
                this.updateVitals();
            }, CONFIG.vitalsUpdateInterval);
        }
        
        updateVitals() {
            if (this.bpmValue) {
                const bpm = Math.floor(Math.random() * (85 - 65 + 1) + 65);
                this.bpmValue.textContent = bpm;
            }
            if (this.spo2Value) {
                const spo2 = Math.floor(Math.random() * (99 - 95 + 1) + 95);
                this.spo2Value.textContent = spo2;
            }
        }
        
        stop() {
            if (this.interval) clearInterval(this.interval);
            if (this.vitalsInterval) clearInterval(this.vitalsInterval);
        }
    }
    
    /* --------------------------------------------
       4. CLASE DE DETECCIÓN DE ANOMALÍAS
       -------------------------------------------- */
    class AnomalyDetector {
        constructor() {
            this.thresholds = {
                heartRateHigh: 100,
                heartRateLow: 50,
                spo2Low: 90,
                temperatureHigh: 38.0
            };
            this.alerts = [];
        }
        
        checkHeartRate(bpm) {
            if (bpm > this.thresholds.heartRateHigh) {
                this.addAlert(`Frecuencia cardíaca elevada: ${bpm} BPM`);
                return true;
            } else if (bpm < this.thresholds.heartRateLow) {
                this.addAlert(`Frecuencia cardíaca baja: ${bpm} BPM`);
                return true;
            }
            return false;
        }
        
        checkSpO2(spo2) {
            if (spo2 < this.thresholds.spo2Low) {
                this.addAlert(`Oxigenación baja: ${spo2}% - Riesgo de hipoxia`);
                return true;
            }
            return false;
        }
        
        addAlert(message) {
            const alert = {
                id: Date.now(),
                message: message,
                timestamp: new Date().toISOString()
            };
            this.alerts.unshift(alert);
            this.notifyAlert(message);
        }
        
        notifyAlert(message) {
            console.log(`%c🚨 ALERTA MÉDICA: ${message}`, 'color: #ff3366; font-weight: bold');
            // Simular notificación
            if (Notification.permission === 'granted') {
                new Notification('CONNECTION LIFE - Alerta Médica', { body: message });
            }
        }
        
        getAlerts() {
            return this.alerts;
        }
        
        requestNotificationPermission() {
            if ('Notification' in window) {
                Notification.requestPermission();
            }
        }
    }
    
    /* --------------------------------------------
       5. CLASE DE TELEMEDICINA
       -------------------------------------------- */
    class TelemedicinaManager {
        constructor() {
            this.activeConsultations = [];
            this.emergencyContacts = [];
        }
        
        requestEmergencyContact(contact) {
            this.emergencyContacts.push(contact);
            console.log(`%c📞 Contacto de emergencia agregado: ${contact.name}`, 'color: #00ff88');
        }
        
        sendEmergencyAlert(location, vitals) {
            const alert = {
                timestamp: new Date().toISOString(),
                location: location,
                vitals: vitals,
                message: 'ALERTA MÉDICA - Se requiere atención inmediata'
            };
            console.log(`%c🚨 ALERTA DE EMERGENCIA ENVIADA`, 'color: #ff3366', alert);
            return alert;
        }
        
        startVirtualConsultation(doctor, patient) {
            const consultation = {
                id: Date.now(),
                doctor: doctor,
                patient: patient,
                startTime: new Date().toISOString(),
                status: 'active'
            };
            this.activeConsultations.push(consultation);
            console.log(`%c🩺 Consulta virtual iniciada: ${doctor.name} con ${patient.name}`, 'color: #00ff88');
            return consultation;
        }
    }
    
    /* --------------------------------------------
       6. CLASE DE DISPOSITIVOS WEARABLES
       -------------------------------------------- */
    class WearableManager {
        constructor() {
            this.devices = [];
            this.activeDevice = null;
        }
        
        registerDevice(device) {
            this.devices.push(device);
            console.log(`%c⌚ Dispositivo registrado: ${device.name}`, 'color: #00ff88');
        }
        
        connectDevice(deviceId) {
            const device = this.devices.find(d => d.id === deviceId);
            if (device) {
                this.activeDevice = device;
                console.log(`%c🔌 Conectado a: ${device.name}`, 'color: #00ff88');
                return true;
            }
            return false;
        }
        
        getDeviceData() {
            if (this.activeDevice) {
                return {
                    heartRate: Math.floor(Math.random() * (85 - 65 + 1) + 65),
                    spo2: Math.floor(Math.random() * (99 - 95 + 1) + 95),
                    temperature: (Math.random() * (37 - 36) + 36).toFixed(1),
                    battery: Math.floor(Math.random() * 100)
                };
            }
            return null;
        }
    }
    
    /* --------------------------------------------
       7. NAVBAR DYNAMIC ISLAND
       -------------------------------------------- */
    class NavbarManager {
        constructor() {
            this.navbar = document.getElementById('dynamicIsland');
            this.menuToggle = document.querySelector('.menu-toggle-life');
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
       8. ANIMACIONES AL SCROLL
       -------------------------------------------- */
    class ScrollAnimator {
        constructor() {
            this.elements = document.querySelectorAll('.biometria-card, .diagnostico-card, .telemedicina-card, .device-card, .testimonial-card, .emergency-step');
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
       9. CONTADOR DE ESTADÍSTICAS
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
       10. PRELOADER
       -------------------------------------------- */
    class Preloader {
        constructor() {
            this.preloader = document.getElementById('preloaderLife');
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
       11. FUNCIONES GLOBALES
       -------------------------------------------- */
    window.notifyDevice = (deviceName) => {
        alert(`❤️ ¡Gracias por tu interés en ${deviceName}!\n\nLAYLA te notificará cuando este dispositivo esté disponible.\n\nCONNECTION LIFE - Tecnología al servicio de la vida`);
        console.log(`%c⌚ Notificación de dispositivo: ${deviceName}`, 'color: #00ff88');
    };
    
    /* --------------------------------------------
       12. SYSTEM DIAGNOSTIC
       -------------------------------------------- */
    class SystemDiagnostic {
        constructor() {
            this.init();
        }
        
        init() {
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ff88; font-size: 12px');
            console.log('%c   CONNECTION LIFE - IA LAYLA ACTIVADA   ', 'color: #00ff88; font-size: 14px; font-weight: bold');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ff88; font-size: 12px');
            console.log('%c✓ IA Líder: LAYLA [v.1.0]', 'color: #00ff55');
            console.log('%c✓ Biometría avanzada: ECG, SpO₂, Temperatura, Presión', 'color: #00ff55');
            console.log('%c✓ Diagnóstico Edge AI: Arritmias, Hipoxia, Caídas', 'color: #00ff55');
            console.log('%c✓ Telemedicina autónoma con alertas &lt;1s', 'color: #00ff55');
            console.log('%c✓ Dispositivos: LYAN Vita Watch, Ring, Patch, Home Hub', 'color: #00ff55');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ff88; font-size: 12px');
        }
    }
    
    /* --------------------------------------------
       13. INICIALIZACIÓN DE MÓDULOS
       -------------------------------------------- */
    const preloader = new Preloader();
    const navbarManager = new NavbarManager();
    const ecgSimulator = new ECGSimulator();
    const anomalyDetector = new AnomalyDetector();
    const telemedicinaManager = new TelemedicinaManager();
    const wearableManager = new WearableManager();
    const scrollAnimator = new ScrollAnimator();
    const statsCounter = new StatsCounter();
    const diagnostic = new SystemDiagnostic();
    
    // Solicitar permiso de notificaciones
    anomalyDetector.requestNotificationPermission();
    
    // Registrar dispositivos de ejemplo
    wearableManager.registerDevice({ id: 1, name: 'LYAN Vita Watch', type: 'watch' });
    wearableManager.registerDevice({ id: 2, name: 'LYAN Ring', type: 'ring' });
    wearableManager.registerDevice({ id: 3, name: 'LYAN Patch', type: 'patch' });
    
    // Simular alerta de demostración después de 10 segundos (solo para demostración)
    setTimeout(() => {
        console.log('%c💡 Demostración: Simulando alerta de arritmia', 'color: #ffaa00');
        anomalyDetector.checkHeartRate(145);
    }, 10000);
    
    // Exportar para debugging
    window.LIFE = {
        version: '1.0',
        modules: {
            ecg: ecgSimulator,
            anomaly: anomalyDetector,
            telemedicina: telemedicinaManager,
            wearables: wearableManager
        },
        config: CONFIG,
        biometricData: BIOMETRIC_DATA
    };
    
    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`%c⏱ Tiempo de carga: ${loadTime}ms`, 'color: #888');
    });
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('%c[LIFE ERROR]', 'color: #ff0055', e.error?.message || e.message);
    });
    
    console.log('%c❤️ CONNECTION LIFE | LAYLA vigilando tu bienestar', 'color: #00ff88; font-size: 12px');
});