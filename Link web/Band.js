/* ============================================
   AVI BAND - Sistema Interactivo Completo
   Basado en PROYECTO.pdf | Animación de carga
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. ANIMACIÓN DE CARGA
       -------------------------------------------- */
    const loader = document.getElementById('avibandLoader');
    const pageContent = document.getElementById('bandPage');
    const progressBar = document.getElementById('loaderProgressBar');
    const statusText = document.getElementById('loaderStatus');
    
    const loadingMessages = [
        'Sincronizando hardware...',
        'Inicializando LYAN OS...',
        'Calibrando sensores biométricos...',
        'Activando Protocolo Fénix...',
        'Estableciendo conectividad LoRa...',
        'Verificando cifrado AES-256...',
        'Cargando interfaz háptica...',
        'Listo. AVI BAND operativa.'
    ];
    
    let progress = 0;
    let messageIndex = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Actualizar barra y mensaje final
            progressBar.style.width = '100%';
            statusText.textContent = '✅ Sistema operativo. AVI BAND lista.';
            
            setTimeout(() => {
                loader.classList.add('hide');
                pageContent.style.display = 'block';
                
                // Animación de entrada
                pageContent.style.animation = 'fadeInUp 0.8s ease forwards';
                
                // Iniciar componentes flotantes
                setTimeout(() => {
                    animateToComponent('all');
                }, 200);
            }, 800);
        }
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress > 30 && messageIndex === 0) {
            messageIndex = 1;
            statusText.textContent = loadingMessages[1];
        } else if (progress > 45 && messageIndex === 1) {
            messageIndex = 2;
            statusText.textContent = loadingMessages[2];
        } else if (progress > 60 && messageIndex === 2) {
            messageIndex = 3;
            statusText.textContent = loadingMessages[3];
        } else if (progress > 75 && messageIndex === 3) {
            messageIndex = 4;
            statusText.textContent = loadingMessages[4];
        } else if (progress > 85 && messageIndex === 4) {
            messageIndex = 5;
            statusText.textContent = loadingMessages[5];
        } else if (progress > 93 && messageIndex === 5) {
            messageIndex = 6;
            statusText.textContent = loadingMessages[6];
        }
    }, 300);
    
    /* --------------------------------------------
       2. DATOS DE LOS COMPONENTES (Basados en PDF)
       -------------------------------------------- */
    const componentsData = {
        all: {
            title: 'AVI BAND - Visión General',
            description: 'Baliza táctica de alta seguridad y supervivencia diseñada para operar bajo el paradigma de Edge Computing. Hardware inquebrantable que garantiza soberanía de datos, identidad unificada inexpugnable y supervivencia en entornos aislados.',
            specs: ['Chasis Acero 316L', '6 meses autonomía', 'LoRa 15km', 'AES-256', 'LYAN OS', 'Protocolo Fénix', 'Edge AI']
        },
        chasis: {
            title: 'Chasis Táctico Ciego',
            description: 'Fabricado en acero cepillado y polímero de alta resistencia. Elimina la pantalla táctil (componente más frágil) sustituyéndola por un panel translúcido retroiluminado por LED de ultra-bajo consumo.',
            specs: ['Acero 316L', 'MIL-STD-810G', 'IP68 / 10 ATM', '45g', 'Botón único antideslizante']
        },
        nfc: {
            title: 'Módulo NFC/RFID',
            description: 'Chip NFC/RFID integrado en la curvatura de la correa para comunicación de corto alcance. Autorización pasiva de accesos y servicios. Cero-fricción en la identificación.',
            specs: ['13.56 MHz', 'ISO/IEC 14443', 'AES-256', '<5cm', 'Autenticación pasiva']
        },
        lora: {
            title: 'Antena LoRa + Protocolo Fénix',
            description: 'Sistema de comunicación de largo alcance de bajo consumo. Emite señal de auxilio encriptada operando independientemente de redes celulares. Modo Enjambre (LoRa Mesh Network).',
            specs: ['868/915 MHz', 'Hasta 15 km', 'AES-128', 'LoRa Mesh', 'Protocolo Fénix', 'Sin cobertura celular']
        },
        sensor: {
            title: 'Sensores Biométricos',
            description: 'Sensores IMU (Acelerómetro/Giroscopio) y sensor óptico PPG para monitoreo de pulso cardíaco. Detección de caídas bruscas con activación automática del Protocolo Fénix.',
            specs: ['PPG Sensor', 'Acelerómetro 6 ejes', 'Giroscopio', 'Detección <1s', 'Protocolo "Hombre Caído"']
        },
        bateria: {
            title: 'Batería de Larga Duración',
            description: 'Batería de polímero de litio con gestión proactiva del sistema operativo. Autonomía estimada de 3 a 6 meses por carga, gracias a la optimización extrema de LYAN OS.',
            specs: ['300 mAh', '3-6 meses autonomía', 'Carga rápida 30 min', 'Ultra bajo consumo', 'Power Management IC']
        },
        lyanos: {
            title: 'LYAN OS - Sistema Operativo',
            description: 'Sistema operativo diseñado desde cero para microcontroladores. Almacena llaves criptográficas matemáticas, no datos biométricos. Procesamiento Edge AI con latencia cero.',
            specs: ['Microkernel v3.2', 'Rust/C++17', 'Boot <200ms', 'Edge AI Ready', 'Secure Enclave', 'Identidad Unificada']
        }
    };
    
    /* --------------------------------------------
       3. ELEMENTOS DEL DOM
       -------------------------------------------- */
    const components = {
        chasis: document.getElementById('compChasis'),
        nfc: document.getElementById('compNfc'),
        lora: document.getElementById('compLora'),
        sensor: document.getElementById('compSensor'),
        bateria: document.getElementById('compBateria'),
        lyanos: document.getElementById('compLyanos')
    };
    
    const infoContainer = document.getElementById('prototypeInfo');
    const buttons = document.querySelectorAll('.prototype-btn');
    
    /* --------------------------------------------
       4. FUNCIONES DE ANIMACIÓN
       -------------------------------------------- */
    function resetAllComponents() {
        Object.keys(components).forEach(key => {
            if (components[key]) components[key].classList.remove('active');
        });
    }
    
    function showComponent(componentId) {
        resetAllComponents();
        if (componentId !== 'all' && components[componentId]) {
            components[componentId].classList.add('active');
        }
    }
    
    function updateInfoPanel(componentId) {
        const data = componentsData[componentId];
        if (!data) return;
        
        const iconMap = {
            all: '🔓',
            chasis: '🔧',
            nfc: '📡',
            lora: '📶',
            sensor: '❤️',
            bateria: '🔋',
            lyanos: '🧠'
        };
        
        const specsHtml = data.specs.map(spec => `<span class="spec-chip">${spec}</span>`).join('');
        
        infoContainer.innerHTML = `
            <div class="info-header">
                <span class="info-icon">${iconMap[componentId]}</span>
                <h3>${data.title}</h3>
            </div>
            <p class="info-description">${data.description}</p>
            <div class="info-specs">${specsHtml}</div>
        `;
    }
    
    function animateToComponent(componentId) {
        if (componentId === 'all') {
            resetAllComponents();
            updateInfoPanel('all');
        } else {
            resetAllComponents();
            setTimeout(() => {
                showComponent(componentId);
                updateInfoPanel(componentId);
            }, 50);
        }
        
        buttons.forEach(btn => {
            if (btn.getAttribute('data-component') === componentId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    /* --------------------------------------------
       5. EVENTOS DE LOS BOTONES
       -------------------------------------------- */
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const component = btn.getAttribute('data-component');
            animateToComponent(component);
        });
    });
    
    /* --------------------------------------------
       6. EFECTO DE BRILLO EN LA IMAGEN
       -------------------------------------------- */
    const bandImage = document.getElementById('bandMainImage');
    if (bandImage) {
        bandImage.addEventListener('mouseenter', () => {
            bandImage.style.filter = 'drop-shadow(0 0 40px rgba(255, 170, 0, 0.8))';
        });
        bandImage.addEventListener('mouseleave', () => {
            bandImage.style.filter = 'drop-shadow(0 0 30px rgba(255, 170, 0, 0.5))';
        });
    }
    
    /* --------------------------------------------
       7. SCROLL ANIMATION
       -------------------------------------------- */
    const animatedElements = document.querySelectorAll('.spec-detailed-card, .innovative-card, .integration-band-card');
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
    
    console.log('%c🔓 AVI BAND | Sistema completo cargado', 'color: #ffaa00');
    console.log('%c✓ Basado en PROYECTO.pdf | Modelo de Utilidad 2026', 'color: #ffaa00');
    console.log('%c✓ Protocolo Fénix | Edge Computing | LYAN OS', 'color: #ffaa00');
});