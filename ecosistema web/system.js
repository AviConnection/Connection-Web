/* ============================================
   ECOSISTEMA AVI CONNECTION - SYSTEM JS
   Funcionalidades interactivas para los pilares
   ============================================ */

// Datos completos de los 22 pilares
const PILARES_DATA = [
    // Fundacionales (Activos)
    { id: 1, name: "CONNECTION LABS", ia: "ALEX", description: "El origen. La tecnología pura. Motor de I+D, ingeniería de software e inteligencia artificial avanzada.", icon: "&lt;/&gt;", status: "fundacional", color: "#00e676", link: "../Labs web/labs.html" },
    { id: 2, name: "CONNECTION PÍXEL", ia: "VINSHI", description: "La comunicación que perdura. Diseño visual, UI/UX, branding y conceptualización estética inmersiva.", icon: "🎨", status: "fundacional", color: "#ff0055", link: "../Píxel web/pixel.html" },
    { id: 3, name: "CONNECTION THINK", ia: "SOFÍA", description: "Gestión del conocimiento global y sistemas de tutoría adaptativa.", icon: "📘", status: "fundacional", color: "#00f3ff", link: "#" },
    { id: 4, name: "CONNECTION LIFE", ia: "LAYLA", description: "Tecnologías de preservación de la vida, biometría y telemedicina autónoma.", icon: "❤️", status: "fundacional", color: "#ff66cc", link: "#" },
    { id: 5, name: "CONNECTION LINK", ia: "IVI", description: "Infraestructura física, hardware, IoT y desarrollo del sistema LYAN OS.", icon: "🔗", status: "fundacional", color: "#ffaa00", link: "#" },
    // Pilares en Desarrollo
    { id: 6, name: "CONNECTION FOLD", ia: "KAMI", description: "Nanotecnología aplicada a materiales avanzados y sistemas moleculares.", icon: "🔬", status: "desarrollo", color: "#00ffaa", link: "#" },
    { id: 7, name: "CONNECTION SEVEN", ia: "GUS", description: "Redes de comunicación de séptima generación y conectividad cuántica.", icon: "📡", status: "desarrollo", color: "#ff6600", link: "#" },
    { id: 8, name: "CONNECTION SPACE", ia: "NOVA", description: "Tecnología aeroespacial y exploración orbital.", icon: "🚀", status: "desarrollo", color: "#6b00ff", link: "#" },
    { id: 9, name: "CONNECTION MOTORS", ia: "VOLT", description: "Vehículos autónomos y sistemas de propulsión eléctrica avanzada.", icon: "⚡", status: "desarrollo", color: "#00c8ff", link: "#" },
    { id: 10, name: "CONNECTION OFFICE", ia: "LYRA", description: "Fintech, sistemas financieros autónomos y gestión corporativa.", icon: "💎", status: "desarrollo", color: "#ffaa44", link: "#" },
    { id: 11, name: "CONNECTION ENERGY", ia: "RAY", description: "Energías renovables, fusión nuclear y sistemas de almacenamiento.", icon: "☀️", status: "desarrollo", color: "#ffdd44", link: "#" },
    { id: 12, name: "CONNECTION SHIELD", ia: "AEGIS", description: "Ciberseguridad cuántica y defensa digital avanzada.", icon: "🛡️", status: "desarrollo", color: "#00aaff", link: "#" },
    { id: 13, name: "CONNECTION AGRO", ia: "CERES", description: "Biotecnología agrícola y sistemas de producción sostenible.", icon: "🌾", status: "desarrollo", color: "#88ff44", link: "#" },
    // Pilares en Conceptualización
    { id: 14, name: "CONNECTION MEDIA", ia: "ORION", description: "Producción audiovisual inmersiva y realidad extendida.", icon: "🎥", status: "conceptual", color: "#ff66aa", link: "#" },
    { id: 15, name: "CONNECTION MIND", ia: "NEXUS", description: "Interfaces cerebro-computadora y neurotecnología.", icon: "🧠", status: "conceptual", color: "#aa66ff", link: "#" },
    { id: 16, name: "CONNECTION OCEAN", ia: "MARIS", description: "Tecnología marina y exploración oceánica profunda.", icon: "🌊", status: "conceptual", color: "#44aaff", link: "#" },
    { id: 17, name: "CONNECTION FORGE", ia: "VULCAN", description: "Manufactura aditiva y fabricación inteligente.", icon: "⚙️", status: "conceptual", color: "#ff8844", link: "#" },
    { id: 18, name: "CONNECTION CODE", ia: "LYNX", description: "Lenguajes de programación cuántica y compiladores avanzados.", icon: "📝", status: "conceptual", color: "#44ffaa", link: "#" },
    { id: 19, name: "CONNECTION CLOUD", ia: "NIMBUS", description: "Computación en la nube distribuida y edge computing.", icon: "☁️", status: "conceptual", color: "#88aaff", link: "#" },
    { id: 20, name: "CONNECTION BIO", ia: "HELIX", description: "Ingeniería genética y medicina regenerativa.", icon: "🧬", status: "conceptual", color: "#ff88aa", link: "#" },
    { id: 21, name: "CONNECTION VIRTUAL", ia: "ECHO", description: "Mundos virtuales y metaverso corporativo.", icon: "🌌", status: "conceptual", color: "#aa88ff", link: "#" },
    { id: 22, name: "CONNECTION LOGIC", ia: "ATOM", description: "Computación neuromórfica y sistemas de lógica difusa.", icon: "⚛️", status: "conceptual", color: "#88ff88", link: "#" }
];

// Estado del filtro actual
let currentFilter = 'all';

// Función para renderizar los pilares
function renderPilares() {
    const grid = document.getElementById('pilaresGrid');
    if (!grid) return;
    
    const filtered = PILARES_DATA.filter(p => currentFilter === 'all' || p.status === currentFilter);
    
    grid.innerHTML = filtered.map(pilar => `
        <div class="pilar-card" data-status="${pilar.status}" data-id="${pilar.id}" style="--pilar-color: ${pilar.color}">
            <div class="pilar-icon">${pilar.icon}</div>
            <h3>${pilar.name}</h3>
            <div class="pilar-ia">IA LÍDER: ${pilar.ia}</div>
            <p>${pilar.description}</p>
            <div class="pilar-status ${pilar.status}">
                ${pilar.status === 'fundacional' ? '✅ Fundacional Activo' : pilar.status === 'desarrollo' ? '⚡ En Desarrollo' : '💡 Conceptualización'}
            </div>
            ${pilar.link !== '#' ? `<a href="${pilar.link}" class="pilar-link">Explorar →</a>` : '<span class="pilar-soon">Próximamente</span>'}
        </div>
    `).join('');
}

// Configurar filtros
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-pilar');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderPilares();
        });
    });
}

// Animación de números al hacer scroll
function setupNumberAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 30);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-eco-section');
    if (statsSection) observer.observe(statsSection);
}

// Menú móvil
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle-eco');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
}

// Efecto de scroll en navbar
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar-eco');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderPilares();
    setupFilters();
    setupNumberAnimation();
    setupMobileMenu();
    setupNavbarScroll();
    
    console.log('%c🌐 ECOSISTEMA AVI | 22 PILARES ACTIVOS', 'color: #00f3ff; font-size: 14px; font-weight: bold');
    console.log('%c✓ IA Central: AVI | Sincronización Neural: Óptima', 'color: #00ff55');
});