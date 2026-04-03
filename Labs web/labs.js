/* ============================================
   CONNECTION LABS - SISTEMA INTERACTIVO v3.0
   IA Líder: ALEX | Terminal y Telemetría Avanzada
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. CONFIGURACIÓN GLOBAL
       -------------------------------------------- */
    const CONFIG = {
        matrixSpeed: 33,
        telemetryInterval: 2500,
        logInterval: 4000,
        tempInterval: 3000,
        typewriterSpeed: 40
    };
    
    /* --------------------------------------------
       2. PRELOADER
       -------------------------------------------- */
    const preloader = document.getElementById('preloaderLabs');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hide');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 800);
            document.body.classList.add('loaded');
        });
    }
    
    /* --------------------------------------------
       3. DYNAMIC ISLAND NAVIGATION
       -------------------------------------------- */
    const navbar = document.getElementById('dynamic-island');
    const menuToggle = document.querySelector('.menu-toggle-labs');
    const navLinks = document.querySelector('.island-links');
    
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
       5. TYPEWRITER EFFECT
       -------------------------------------------- */
    const typewriterElement = document.getElementById('typewriter_v3');
    const messages = [
        'Sistema operativo LYAN OS compilado...',
        'Modelos de IA sincronizados...',
        'Repositorios clonados exitosamente...',
        'Entorno de desarrollo listo.',
        'Bienvenido a CONNECTION LABS.'
    ];
    let messageIndex = 0;
    let charIndex = 0;
    
    function typeWriter() {
        if (typewriterElement && messageIndex < messages.length) {
            if (charIndex < messages[messageIndex].length) {
                typewriterElement.textContent += messages[messageIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, CONFIG.typewriterSpeed);
            } else {
                messageIndex++;
                charIndex = 0;
                if (messageIndex < messages.length) {
                    typewriterElement.textContent += '\n';
                    setTimeout(typeWriter, 200);
                }
            }
        }
    }
    setTimeout(typeWriter, 1000);
    
    /* --------------------------------------------
       6. MATRIX RAIN EFFECT
       -------------------------------------------- */
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()<>{}[]/\\';
        const fontSize = 14;
        let drops = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const columns = canvas.width / fontSize;
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        }
        
        function animateMatrix() {
            if (!ctx) return;
            ctx.fillStyle = 'rgba(1, 6, 4, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00E676';
            ctx.font = fontSize + 'px Fira Code, monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                ctx.fillText(text, x, y);
                
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(animateMatrix);
        }
        
        resizeCanvas();
        animateMatrix();
        window.addEventListener('resize', resizeCanvas);
    }
    
    /* --------------------------------------------
       7. TELEMETRY SYSTEM
       -------------------------------------------- */
    const cpuValEl = document.getElementById('cpu-val');
    const cpuRing = document.getElementById('cpu-ring');
    const pingValEl = document.getElementById('ping-val');
    const coreTempEl = document.getElementById('core-temp');
    const packetCountEl = document.getElementById('packet-count');
    
    function updateCoreMetrics() {
        const cpuVal = Math.floor(Math.random() * 50 + 30);
        const pingVal = Math.floor(Math.random() * 20 + 5);
        const packetCount = Math.floor(Math.random() * 17000 + 8000);
        
        if (cpuValEl) cpuValEl.textContent = cpuVal;
        if (pingValEl) pingValEl.textContent = pingVal;
        if (packetCountEl) packetCountEl.textContent = (packetCount / 1000).toFixed(1) + 'K';
        
        if (cpuRing) {
            const circumference = 2 * Math.PI * 40;
            const offset = circumference - (cpuVal / 100) * circumference;
            cpuRing.style.strokeDashoffset = offset;
        }
    }
    
    function updateTemperature() {
        if (coreTempEl) {
            const temp = (Math.random() * 6 + 32).toFixed(1);
            coreTempEl.textContent = temp;
        }
    }
    
    setInterval(updateCoreMetrics, CONFIG.telemetryInterval);
    setInterval(updateTemperature, CONFIG.tempInterval);
    
    /* --------------------------------------------
       8. LIVE LOGS
       -------------------------------------------- */
    const logsContainer = document.getElementById('server-logs');
    const logMessages = [
        "> Conexión cifrada establecida...",
        "> Analizando paquetes de datos...",
        "> Handshake completado",
        "> Optimizando base de datos...",
        "> Bloqueando intento de acceso no autorizado...",
        "> Sincronizando con nodo CONNECTION THINK...",
        "> Compilando paquete de actualizaciones...",
        "> Machine Learning: Época 450 completada.",
        "> Escaneo de vulnerabilidades: 0 encontradas",
        "> Backups sincronizados en la nube",
        "> IA ALEX procesando nuevas instrucciones"
    ];
    
    setInterval(() => {
        if (logsContainer) {
            const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
            const newLog = document.createElement('p');
            newLog.textContent = randomLog;
            logsContainer.appendChild(newLog);
            while (logsContainer.children.length > 4) {
                logsContainer.removeChild(logsContainer.firstChild);
            }
        }
    }, CONFIG.logInterval);
    
    /* --------------------------------------------
       9. LIVE TIMESTAMP
       -------------------------------------------- */
    const timestampEl = document.getElementById('liveTimestamp');
    function updateTimestamp() {
        if (timestampEl) {
            const now = new Date();
            timestampEl.textContent = now.toLocaleTimeString('es-ES');
        }
    }
    setInterval(updateTimestamp, 1000);
    updateTimestamp();
    
    /* --------------------------------------------
       10. PROTOCOL INTERFACE
       -------------------------------------------- */
    const protocolsData = {
        software: {
            title: "/PROTOCOLOS/SOFTWARE.EXE",
            heading: "Ingeniería y Desarrollo de Software",
            desc: "Arquitecturas robustas y escalables. Cubrimos el ciclo de vida completo del desarrollo con metodologías ágiles y entrega continua.",
            techs: [
                "> Front-end (React, Next.js, Vue, Angular)",
                "> Back-end (Node.js, Python, Java, Go)",
                "> Mobile Apps (Kotlin, Swift, Flutter)",
                "> Motores de Videojuegos (Unity, Unreal Engine)",
                "> DevOps & Cloud (AWS, Azure, GCP)"
            ]
        },
        ai: {
            title: "/PROTOCOLOS/IA_DATA.EXE",
            heading: "Datos e Inteligencia Artificial",
            desc: "El núcleo algorítmico. Analizamos grandes volúmenes de datos y entrenamos modelos predictivos con redes neuronales avanzadas.",
            techs: [
                "> Machine Learning & Deep Learning (TensorFlow, PyTorch)",
                "> Procesamiento de Lenguaje Natural (LLMs, Transformers)",
                "> Data Engineering & Big Data (Spark, Hadoop)",
                "> Computer Vision (OpenCV, YOLO)",
                "> IA Generativa (GANs, Stable Diffusion)"
            ]
        },
        hardware: {
            title: "/PROTOCOLOS/HARDWARE.SYS",
            heading: "Hardware y Sistemas Embebidos",
            desc: "La integración perfecta entre el código puro y el mundo físico, trabajando en conjunto con CONNECTION LINK.",
            techs: [
                "> Arquitectura de Computadoras (ARM, RISC-V)",
                "> Robótica Automatizada",
                "> Internet de las Cosas (IoT)",
                "> Programación de Microcontroladores (C, C++, Rust)",
                "> FPGA y Circuitos Digitales"
            ]
        },
        cyber: {
            title: "/PROTOCOLOS/SECURITY.SH",
            heading: "Redes y Ciberseguridad",
            desc: "Protección absoluta de los activos digitales corporativos y mantenimiento de la infraestructura con estándares militares.",
            techs: [
                "> Hacking Ético y Criptografía (AES-256, RSA)",
                "> Arquitectura Cloud (AWS, GCP, Azure)",
                "> Protocolos 5G y Fibra Óptica",
                "> Administración de Redes (Cisco, Juniper)",
                "> Zero Trust Architecture & SIEM"
            ]
        },
        quantum: {
            title: "/PROTOCOLOS/EXPERIMENTAL.BIN",
            heading: "Teoría y Aplicaciones Interdisciplinares",
            desc: "Exploración de nuevos paradigmas. Donde la ciencia teórica se convierte en tecnología aplicable.",
            techs: [
                "> Computación Cuántica (Qiskit, Cirq)",
                "> Realidad Virtual (VR) y Aumentada (AR)",
                "> Bioinformática y Neurotecnología",
                "> Complejidad Algorítmica",
                "> Blockchain y Web3"
            ]
        }
    };
    
    const cmdBtns = document.querySelectorAll('.cmd-btn');
    const outputTitle = document.getElementById('output-title');
    const outputData = document.getElementById('output-data');
    
    cmdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cmdBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const protocol = btn.getAttribute('data-protocol');
            if (protocol && protocolsData[protocol]) {
                const data = protocolsData[protocol];
                if (outputTitle) outputTitle.textContent = data.title;
                if (outputData) {
                    let html = `<h3>${data.heading}</h3><p>${data.desc}</p><ul class="tech-list">`;
                    data.techs.forEach(t => html += `<li>${t}</li>`);
                    html += `</ul>`;
                    outputData.innerHTML = html;
                }
            }
        });
    });
    
    /* --------------------------------------------
       11. NEWSLETTER
       -------------------------------------------- */
    const newsletterBtn = document.querySelector('.footer-newsletter button');
    const newsletterInput = document.querySelector('.footer-newsletter input');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            if (newsletterInput && newsletterInput.value.trim()) {
                alert('✅ ¡Gracias por suscribirte! Recibirás novedades de CONNECTION LABS.');
                newsletterInput.value = '';
            } else {
                alert('📧 Por favor ingresa tu email');
            }
        });
    }
    
    /* --------------------------------------------
       12. SYSTEM DIAGNOSTIC
       -------------------------------------------- */
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00e676');
    console.log('%c   CONNECTION LABS - ALEX ACTIVADO   ', 'color: #00e676; font-size: 14px; font-weight: bold');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00e676');
    console.log('%c✓ IA Líder: ALEX [v.3.2.7]', 'color: #0f0');
    console.log('%c✓ Kernel: Óptimo | LYAN OS Integrado', 'color: #0f0');
    console.log('%c✓ Repositorios: Sincronizados', 'color: #0f0');
    console.log('%c✓ Protocolos de Seguridad: Activos', 'color: #0f0');
});