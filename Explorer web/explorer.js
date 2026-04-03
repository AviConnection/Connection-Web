/* ============================================
   CONNECTION EXPLORER - SISTEMA INTERACTIVO v1.0
   IA Líder: EXPLORA | Experiencia de Viajes
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. CONFIGURACIÓN GLOBAL
       -------------------------------------------- */
    const CONFIG = {
        preloaderDelay: 1000,
        scrollThreshold: 50,
        animationDelay: 300,
        defaultPassengers: 1,
        minDate: new Date().toISOString().split('T')[0]
    };
    
    /* --------------------------------------------
       2. DATOS DE AEROLÍNEAS Y PRECIOS
       -------------------------------------------- */
    const AIRLINES = [
        { id: 'latam', name: 'LATAM Airlines', priceMultiplier: 1.2, icon: '✈', quality: 'Premium', color: '#00a0e0' },
        { id: 'sky', name: 'Sky Airline', priceMultiplier: 0.9, icon: '🛩️', quality: 'Económico', color: '#00b8ff' },
        { id: 'jetsmart', name: 'JetSmart Perú', priceMultiplier: 0.8, icon: '✈', quality: 'Low Cost', color: '#ff6600' },
        { id: 'starperu', name: 'Star Perú', priceMultiplier: 1.0, icon: '🛫', quality: 'Regional', color: '#00aa55' },
        { id: 'atsa', name: 'Atsa Airlines', priceMultiplier: 0.85, icon: '✈', quality: 'Regional', color: '#ffaa33' },
        { id: 'saeta', name: 'Saeta Airlines', priceMultiplier: 0.88, icon: '🛩️', quality: 'Regional', color: '#33cc99' }
    ];
    
    // Precios base por ruta (en soles)
    const ROUTE_PRICES = {
        'LIM-AQP': 180, 'AQP-LIM': 180,
        'LIM-CUZ': 220, 'CUZ-LIM': 220,
        'LIM-TRU': 150, 'TRU-LIM': 150,
        'LIM-PIU': 170, 'PIU-LIM': 170,
        'LIM-IQT': 280, 'IQT-LIM': 280,
        'LIM-TAR': 210, 'TAR-LIM': 210,
        'LIM-PCL': 200, 'PCL-LIM': 200,
        'LIM-CHM': 140, 'CHM-LIM': 140,
        'LIM-JUL': 190, 'JUL-LIM': 190,
        'AQP-CUZ': 160, 'CUZ-AQP': 160,
        'AQP-TRU': 200, 'TRU-AQP': 200,
        'AQP-PIU': 250, 'PIU-AQP': 250,
        'CUZ-TRU': 220, 'TRU-CUZ': 220,
        'CUZ-PIU': 280, 'PIU-CUZ': 280,
        'TRU-PIU': 120, 'PIU-TRU': 120,
        'IQT-TAR': 150, 'TAR-IQT': 150,
        'IQT-PCL': 180, 'PCL-IQT': 180,
        'TAR-PCL': 140, 'PCL-TAR': 140
    };
    
    // Nombres completos de aeropuertos
    const AIRPORT_NAMES = {
        'LIM': 'Lima - Jorge Chávez',
        'AQP': 'Arequipa - Rodríguez Ballón',
        'CUZ': 'Cusco - Alejandro Velasco',
        'TRU': 'Trujillo - Capitán Martínez',
        'PIU': 'Piura - Capitán Concha',
        'IQT': 'Iquitos - Coronel FAP',
        'TAR': 'Tarapoto - Cadete FAP',
        'PCL': 'Pucallpa - Capitán Roldán',
        'CHM': 'Chimbote - Teniente FAP',
        'JUL': 'Juliaca - Inca Manco Cápac'
    };
    
    /* --------------------------------------------
       3. CLASE DE GESTIÓN DE VUELOS
       -------------------------------------------- */
    class FlightManager {
        constructor() {
            this.flightForm = document.getElementById('flightSearchForm');
            this.resultsContainer = document.getElementById('flightResults');
            this.resultsList = document.getElementById('resultsList');
            this.init();
        }
        
        init() {
            if (this.flightForm) {
                this.flightForm.addEventListener('submit', (e) => this.searchFlights(e));
            }
            this.setupDateRestrictions();
        }
        
        setupDateRestrictions() {
            const departDate = document.getElementById('departDate');
            const returnDate = document.getElementById('returnDate');
            
            if (departDate) departDate.min = CONFIG.minDate;
            if (returnDate) returnDate.min = CONFIG.minDate;
        }
        
        getRoutePrice(origin, destination) {
            const route = `${origin}-${destination}`;
            return ROUTE_PRICES[route] || 250;
        }
        
        getAirportName(code) {
            return AIRPORT_NAMES[code] || code;
        }
        
        searchFlights(e) {
            e.preventDefault();
            
            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            const departDate = document.getElementById('departDate').value;
            const returnDate = document.getElementById('returnDate').value;
            const passengers = parseInt(document.getElementById('passengers').value);
            const tripType = document.querySelector('.search-tab.active')?.dataset.tab || 'roundtrip';
            
            // Validaciones
            if (!origin || !destination) {
                this.showError('Por favor selecciona origen y destino');
                return;
            }
            
            if (origin === destination) {
                this.showError('El origen y destino no pueden ser iguales');
                return;
            }
            
            if (!departDate) {
                this.showError('Por favor selecciona una fecha de viaje');
                return;
            }
            
            if (tripType === 'roundtrip' && !returnDate) {
                this.showError('Por favor selecciona una fecha de retorno');
                return;
            }
            
            const originName = this.getAirportName(origin);
            const destName = this.getAirportName(destination);
            const basePrice = this.getRoutePrice(origin, destination);
            
            this.generateFlightResults(originName, destName, departDate, returnDate, passengers, tripType, basePrice);
        }
        
        generateFlightResults(origin, destination, departDate, returnDate, passengers, tripType, basePrice) {
            let flightsHTML = '';
            
            AIRLINES.forEach(airline => {
                let price = basePrice * airline.priceMultiplier;
                if (tripType === 'roundtrip') price = price * 1.8;
                const totalPrice = Math.round(price * passengers);
                
                flightsHTML += `
                    <div class="flight-card" data-airline="${airline.id}">
                        <div class="flight-airline">
                            <span class="flight-icon">${airline.icon}</span>
                            <div>
                                <h4>${airline.name}</h4>
                                <span class="flight-quality">${airline.quality}</span>
                            </div>
                        </div>
                        <div class="flight-details">
                            <div class="flight-route">
                                <span>${origin.split(' - ')[0]}</span>
                                <span>→</span>
                                <span>${destination.split(' - ')[0]}</span>
                            </div>
                            <div class="flight-date">
                                📅 ${this.formatDate(departDate)} ${tripType === 'roundtrip' ? `→ ${this.formatDate(returnDate)}` : ''}
                            </div>
                            <div class="flight-passengers">👥 ${passengers} pasajero${passengers > 1 ? 's' : ''}</div>
                        </div>
                        <div class="flight-price">
                            <div class="price">S/ ${totalPrice.toLocaleString()}</div>
                            <div class="price-per">por ${passengers} ${passengers > 1 ? 'personas' : 'persona'}</div>
                            <button class="btn-select" onclick="window.selectFlight('${airline.name}', ${totalPrice}, '${origin}', '${destination}', '${departDate}', '${returnDate}', ${passengers})">
                                Seleccionar
                            </button>
                        </div>
                    </div>
                `;
            });
            
            if (this.resultsList) {
                this.resultsList.innerHTML = flightsHTML;
            }
            
            if (this.resultsContainer) {
                this.resultsContainer.style.display = 'block';
                this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            this.logSearch(origin, destination, passengers);
        }
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
        }
        
        showError(message) {
            alert(`❌ ${message}`);
        }
        
        logSearch(origin, destination, passengers) {
            console.log(`%c✈ Búsqueda de vuelos: ${origin} → ${destination} | ${passengers} pasajeros`, 'color: #00ffaa');
        }
    }
    
    /* --------------------------------------------
       4. CLASE DE GESTIÓN DE HOTELES
       -------------------------------------------- */
    class HotelManager {
        constructor() {
            this.init();
        }
        
        init() {
            // Los botones de hoteles se manejan con funciones globales
        }
        
        reserveHotel(hotelName, price) {
            console.log(`%c🏨 Reserva de hotel: ${hotelName}`, 'color: #00ffaa');
            return {
                success: true,
                hotel: hotelName,
                price: price
            };
        }
    }
    
    /* --------------------------------------------
       5. CLASE DE GESTIÓN DE TOURS
       -------------------------------------------- */
    class TourManager {
        constructor() {
            this.init();
        }
        
        init() {
            // Los botones de tours se manejan con funciones globales
        }
        
        reserveTour(tourName, price) {
            console.log(`%c🌿 Reserva de tour: ${tourName}`, 'color: #00ffaa');
            return {
                success: true,
                tour: tourName,
                price: price
            };
        }
    }
    
    /* --------------------------------------------
       6. CLASE DE GESTIÓN DE PAQUETES
       -------------------------------------------- */
    class PackageManager {
        constructor() {
            this.init();
        }
        
        init() {
            // Los botones de paquetes se manejan con funciones globales
        }
        
        reservePackage(packageName, price) {
            console.log(`%c🎁 Reserva de paquete: ${packageName}`, 'color: #00ffaa');
            return {
                success: true,
                package: packageName,
                price: price
            };
        }
    }
    
    /* --------------------------------------------
       7. NAVBAR DYNAMIC ISLAND
       -------------------------------------------- */
    class NavbarManager {
        constructor() {
            this.navbar = document.getElementById('dynamicIsland');
            this.menuToggle = document.querySelector('.menu-toggle-explorer');
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
       8. TABS DE BÚSQUEDA
       -------------------------------------------- */
    class SearchTabsManager {
        constructor() {
            this.tabs = document.querySelectorAll('.search-tab');
            this.returnDateGroup = document.getElementById('returnDateGroup');
            this.returnDateInput = document.getElementById('returnDate');
            this.init();
        }
        
        init() {
            if (!this.tabs.length) return;
            
            this.tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    const tripType = tab.dataset.tab;
                    if (tripType === 'oneway') {
                        this.disableReturnDate();
                    } else {
                        this.enableReturnDate();
                    }
                });
            });
        }
        
        disableReturnDate() {
            if (this.returnDateGroup) {
                this.returnDateGroup.style.opacity = '0.5';
            }
            if (this.returnDateInput) {
                this.returnDateInput.disabled = true;
            }
        }
        
        enableReturnDate() {
            if (this.returnDateGroup) {
                this.returnDateGroup.style.opacity = '1';
            }
            if (this.returnDateInput) {
                this.returnDateInput.disabled = false;
            }
        }
    }
    
    /* --------------------------------------------
       9. ANIMACIONES AL SCROLL
       -------------------------------------------- */
    class ScrollAnimator {
        constructor() {
            this.elements = document.querySelectorAll('.flight-card, .hotel-card, .tour-card, .package-card, .testimonial-card, .airline-card');
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
       10. CONTADOR DE ESTADÍSTICAS
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
        }
    }
    
    /* --------------------------------------------
       11. FORMULARIO DE CONTACTO (Modal)
       -------------------------------------------- */
    class ContactModal {
        constructor() {
            this.modal = null;
            this.init();
        }
        
        init() {
            // Crear modal dinámicamente
            this.createModal();
        }
        
        createModal() {
            const modalHTML = `
                <div id="contactModalExplorer" class="contact-modal-explorer" style="display: none;">
                    <div class="modal-content-explorer">
                        <span class="modal-close-explorer">&times;</span>
                        <h3>Solicitar Asesoría</h3>
                        <p>Completa el formulario y un asesor de CONNECTION EXPLORER te contactará.</p>
                        <form id="contactFormExplorer">
                            <input type="text" placeholder="Nombre completo" required>
                            <input type="email" placeholder="Email" required>
                            <input type="tel" placeholder="Teléfono">
                            <select required>
                                <option value="">Tipo de consulta</option>
                                <option>Vuelos</option>
                                <option>Hoteles</option>
                                <option>Tours</option>
                                <option>Paquetes Especiales</option>
                                <option>Otros</option>
                            </select>
                            <textarea rows="3" placeholder="Cuéntanos sobre tu viaje..."></textarea>
                            <button type="submit" class="btn-submit-modal">Enviar Mensaje</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.modal = document.getElementById('contactModalExplorer');
            this.setupModalEvents();
        }
        
        setupModalEvents() {
            const closeBtn = document.querySelector('.modal-close-explorer');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
            
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
            
            const form = document.getElementById('contactFormExplorer');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('✅ Mensaje enviado. Un asesor te contactará pronto.');
                    form.reset();
                    this.close();
                });
            }
        }
        
        open() {
            if (this.modal) this.modal.style.display = 'flex';
        }
        
        close() {
            if (this.modal) this.modal.style.display = 'none';
        }
    }
    
    /* --------------------------------------------
       12. PRELOADER
       -------------------------------------------- */
    class Preloader {
        constructor() {
            this.preloader = document.getElementById('preloaderExplorer');
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
       13. FUNCIONES GLOBALES (para botones inline)
       -------------------------------------------- */
    window.selectFlight = (airline, price, origin, destination, departDate, returnDate, passengers) => {
        const tripType = returnDate ? 'ida y vuelta' : 'solo ida';
        const message = `✅ Has seleccionado ${airline}\n\n` +
            `📍 Ruta: ${origin.split(' - ')[0]} → ${destination.split(' - ')[0]}\n` +
            `📅 Fecha: ${new Date(departDate).toLocaleDateString('es-PE')}${returnDate ? ` → ${new Date(returnDate).toLocaleDateString('es-PE')}` : ''}\n` +
            `👥 Pasajeros: ${passengers}\n` +
            `💰 Total: S/ ${price.toLocaleString()}\n\n` +
            `Un asesor de CONNECTION EXPLORER se contactará contigo para completar la reserva.`;
        alert(message);
        console.log(`%c✈ Vuelo seleccionado: ${airline} | ${origin} → ${destination} | S/ ${price}`, 'color: #00ffaa');
    };
    
    window.reservarHotel = (hotelName) => {
        alert(`🏨 Has solicitado reserva en ${hotelName}\n\nUn asesor de CONNECTION EXPLORER se contactará contigo para confirmar disponibilidad y precios.`);
        console.log(`%c🏨 Reserva solicitada: ${hotelName}`, 'color: #00ffaa');
    };
    
    window.reservarTour = (tourName) => {
        alert(`🌿 Has solicitado el tour: ${tourName}\n\nUn asesor te contactará para coordinar los detalles de tu experiencia.`);
        console.log(`%c🌿 Tour solicitado: ${tourName}`, 'color: #00ffaa');
    };
    
    window.reservarPaquete = (packageName) => {
        alert(`🎁 Has solicitado el paquete: ${packageName}\n\nAprovecha esta oferta especial. Un asesor te contactará para confirmar tu reserva.`);
        console.log(`%c🎁 Paquete solicitado: ${packageName}`, 'color: #00ffaa');
    };
    
    /* --------------------------------------------
       14. SYSTEM DIAGNOSTIC
       -------------------------------------------- */
    class SystemDiagnostic {
        constructor() {
            this.init();
        }
        
        init() {
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ffaa; font-size: 12px');
            console.log('%c   CONNECTION EXPLORER - IA EXPLORA ACTIVADA   ', 'color: #00ffaa; font-size: 14px; font-weight: bold');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ffaa; font-size: 12px');
            console.log('%c✓ IA Líder: EXPLORA [v.1.0]', 'color: #00ff55');
            console.log('%c✓ Sede Principal: Tarapoto - San Martín', 'color: #00ff55');
            console.log('%c✓ Aerolíneas Asociadas: 6', 'color: #00ff55');
            console.log('%c✓ Destinos Disponibles: 10+', 'color: #00ff55');
            console.log('%c✓ Hoteles Premium: 4', 'color: #00ff55');
            console.log('%c✓ Tours Disponibles: 6', 'color: #00ff55');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ffaa; font-size: 12px');
        }
    }
    
    /* --------------------------------------------
       15. INICIALIZACIÓN DE MÓDULOS
       -------------------------------------------- */
    const preloader = new Preloader();
    const navbarManager = new NavbarManager();
    const flightManager = new FlightManager();
    const hotelManager = new HotelManager();
    const tourManager = new TourManager();
    const packageManager = new PackageManager();
    const searchTabsManager = new SearchTabsManager();
    const scrollAnimator = new ScrollAnimator();
    const statsCounter = new StatsCounter();
    const contactModal = new ContactModal();
    const diagnostic = new SystemDiagnostic();
    
    // Exportar para debugging
    window.EXPLORER = {
        version: '1.0',
        modules: {
            flight: flightManager,
            hotel: hotelManager,
            tour: tourManager,
            package: packageManager
        },
        config: CONFIG,
        airlines: AIRLINES,
        routes: ROUTE_PRICES
    };
    
    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`%c⏱ Tiempo de carga: ${loadTime}ms`, 'color: #888');
    });
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('%c[EXPLORER ERROR]', 'color: #ff0055', e.error?.message || e.message);
    });
    
    console.log('%c✈ CONNECTION EXPLORER | Listo para descubrir nuevos destinos', 'color: #00ffaa; font-size: 12px');
});