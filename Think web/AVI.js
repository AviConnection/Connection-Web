/* ============================================
   AVI AI - ASISTENTE INTELIGENTE v2.0
   Interfaz dinámica con animaciones y efectos
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------
       1. PRELOADER
       -------------------------------------------- */
    const preloader = document.getElementById('preloaderAvi');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 1500);
    }
    
    /* --------------------------------------------
       2. CONFIGURACIÓN DE VERSIONES
       -------------------------------------------- */
    const versions = {
        lite: {
            name: 'AVI LITE',
            maxMessages: 10,
            color: '#00cc88',
            icon: '✨',
            features: ['Chat básico', '10 mensajes/día', 'Respuestas limitadas'],
            requiresAuth: false
        },
        pro: {
            name: 'AVI PRO',
            maxMessages: Infinity,
            color: '#00f3ff',
            icon: '⚡',
            features: ['Chat avanzado', 'Mensajes ilimitados', 'Generación de imágenes', 'Análisis de documentos'],
            requiresAuth: true,
            price: '$9.99/mes'
        },
        ultra: {
            name: 'AVI ULTRA',
            maxMessages: Infinity,
            color: '#ff00ff',
            icon: '🌀',
            features: ['Chat premium', 'Mensajes ilimitados', 'Generación de imágenes HD', 'Generación de videos', 'Código avanzado', 'Análisis profundo'],
            requiresAuth: true,
            price: '$29.99/mes'
        },
        business: {
            name: 'AVI BUSINESS',
            maxMessages: Infinity,
            color: '#ffaa00',
            icon: '🏢',
            features: ['API acceso', 'Múltiples usuarios', 'Soporte prioritario', 'Personalización', 'Análisis de datos masivos'],
            requiresAuth: true,
            price: 'Consultar'
        }
    };
    
    let currentVersion = 'lite';
    let currentUser = null;
    let messageCount = 0;
    let currentTool = 'chat';
    let messages = [];
    
    /* --------------------------------------------
       3. ELEMENTOS DEL DOM
       -------------------------------------------- */
    const versionBtns = document.querySelectorAll('.version-btn');
    const versionNameDisplay = document.getElementById('versionNameDisplay');
    const versionLimitDisplay = document.getElementById('versionLimitDisplay');
    const currentVersionBadge = document.getElementById('currentVersionBadge');
    const welcomeVersion = document.getElementById('welcomeVersion');
    const messageCountSpan = document.getElementById('countValue');
    const maxCountSpan = document.getElementById('maxCount');
    const remainingMessagesSpan = document.getElementById('remainingMessages');
    const progressFill = document.getElementById('progressFill');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userAvatar = document.getElementById('userAvatar');
    const modal = document.getElementById('loginModal');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const charCount = document.getElementById('charCount');
    const toolIndicator = document.getElementById('toolIndicator');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    /* --------------------------------------------
       4. FUNCIONES DE VERSIÓN
       -------------------------------------------- */
    function updateVersionUI() {
        const version = versions[currentVersion];
        versionNameDisplay.textContent = version.name;
        versionLimitDisplay.innerHTML = `${version.icon} ${version.maxMessages === Infinity ? 'Mensajes ilimitados' : `${version.maxMessages} mensajes/día`}`;
        currentVersionBadge.innerHTML = `${version.name} • Activo`;
        if (welcomeVersion) welcomeVersion.textContent = version.name;
        maxCountSpan.textContent = version.maxMessages === Infinity ? '∞' : version.maxMessages;
        
        // Actualizar barra de progreso
        const percentage = version.maxMessages === Infinity ? 100 : (messageCount / version.maxMessages) * 100;
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        
        // Cambiar color del indicador según versión
        const versionColors = {
            lite: '#00cc88',
            pro: '#00f3ff',
            ultra: '#ff00ff',
            business: '#ffaa00'
        };
        progressFill.style.background = `linear-gradient(90deg, ${versionColors[currentVersion]}, ${versionColors[currentVersion]}88)`;
        
        // Verificar acceso
        if (version.requiresAuth && !currentUser) {
            upgradeBtn.style.display = 'flex';
            upgradeBtn.innerHTML = `<span class="upgrade-icon">✨</span><span>Actualizar a ${version.name}</span>`;
        } else {
            upgradeBtn.style.display = 'none';
        }
        
        updateMessageCount();
    }
    
    function updateMessageCount() {
        const version = versions[currentVersion];
        const remaining = version.maxMessages === Infinity ? Infinity : Math.max(0, version.maxMessages - messageCount);
        remainingMessagesSpan.innerHTML = version.maxMessages === Infinity ? '∞ mensajes restantes' : `${remaining} mensajes restantes`;
        messageCountSpan.textContent = messageCount;
        
        // Deshabilitar input si se excedió el límite
        if (version.maxMessages !== Infinity && messageCount >= version.maxMessages) {
            messageInput.disabled = true;
            sendBtn.disabled = true;
            messageInput.placeholder = '🚫 Límite de mensajes diarios alcanzado. Actualiza tu plan para continuar.';
        } else {
            messageInput.disabled = false;
            sendBtn.disabled = false;
            messageInput.placeholder = 'Escribe tu mensaje aquí... (Ctrl + Enter para enviar)';
        }
        
        updateProgressBar();
    }
    
    function updateProgressBar() {
        const version = versions[currentVersion];
        const percentage = version.maxMessages === Infinity ? 100 : (messageCount / version.maxMessages) * 100;
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
    }
    
    /* --------------------------------------------
       5. FUNCIONES DE CHAT
       -------------------------------------------- */
    function addMessage(content, isUser = false, isSystem = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : isSystem ? 'system' : 'avi'} fade-in`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${!isUser ? '<div class="avatar-glow"></div>' : ''}
                <span>${isUser ? '👤' : isSystem ? '⚙️' : '🤖'}</span>
            </div>
            <div class="message-content">
                ${!isUser ? `<div class="message-name">${isSystem ? 'Sistema' : 'AVI AI'}</div>` : ''}
                <div class="message-text">${content}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        messages.push({ role: isUser ? 'user' : 'assistant', content });
    }
    
    function simulateAIResponse(userMessage) {
        const version = versions[currentVersion];
        let response = '';
        
        // Respuestas según herramienta y versión
        if (currentTool === 'image') {
            if (currentVersion === 'lite') {
                response = `🎨 **Generación de Imágenes**\n\n⚠️ *Esta función solo está disponible en AVI PRO, ULTRA y BUSINESS.*\n\n✨ **Actualiza tu plan** para desbloquear:\n• Imágenes HD con IA\n• Múltiples estilos artísticos\n• Generación masiva\n\n🔓 Haz clic en "Mejorar Plan" para acceder.`;
            } else {
                response = `🎨 **Generando imagen para:** "${userMessage.substring(0, 80)}"\n\n✨ *AVI ${version.name} está creando una imagen de alta calidad para ti.*\n\n🖼️ **[Simulación] Imagen generada**\nEstilo: Arte digital\nResolución: ${currentVersion === 'ultra' ? '8K Ultra HD' : '4K'}\nFormato: PNG\n\n💡 *¿Quieres ajustar algún detalle? Puedo modificar colores, estilo o composición.*`;
            }
        } else if (currentTool === 'code') {
            response = `💻 **Generando código para:** "${userMessage.substring(0, 80)}"\n\n\`\`\`javascript\n// Código generado por AVI ${version.name}\nfunction processRequest(query) {\n    console.log("Procesando:", query);\n    \n    // Análisis semántico\n    const analysis = {\n        input: query,\n        confidence: 0.98,\n        timestamp: new Date().toISOString()\n    };\n    \n    return analysis;\n}\n\n// Ejecutar análisis\nconst result = processRequest("${userMessage.substring(0, 50)}");\nconsole.log(result);\n\`\`\`\n\n🔧 *¿Necesitas el código en otro lenguaje? Puedo generarlo en Python, Java, Go o Rust.*`;
        } else if (currentTool === 'video' && currentVersion === 'ultra') {
            response = `🎬 **Generando video para:** "${userMessage.substring(0, 80)}"\n\n✨ *AVI ULTRA está procesando tu video con calidad cinematográfica.*\n\n🎥 **[Simulación] Video generado**\nDuración: 30 segundos\nResolución: 4K\nFormato: MP4\nFPS: 60\n\n⏱️ *Procesamiento completado. ¿Quieres editar algún aspecto del video?*`;
        } else if (currentTool === 'video') {
            response = `🎬 **Generación de Videos**\n\n⚠️ *Esta función es exclusiva de AVI ULTRA.*\n\n🌀 **AVI ULTRA** puede:\n• Generar videos con IA\n• Animaciones 3D\n• Edición automática\n• Efectos visuales avanzados\n\n✨ *Actualiza a AVI ULTRA para desbloquear esta función.*`;
        } else if (currentTool === 'analyze') {
            if (currentVersion === 'lite') {
                response = `📊 **Análisis de Documentos**\n\n⚠️ *Esta función requiere AVI PRO o superior.*\n\n📈 **AVI PRO** puede analizar:\n• Documentos PDF\n• Imágenes\n• Datos estructurados\n• Gráficos y tablas\n\n🔓 *Actualiza tu plan para acceder.*`;
            } else {
                response = `📊 **Analizando:** "${userMessage.substring(0, 80)}"\n\n📈 *AVI ${version.name} ha procesado tu solicitud.*\n\n✅ **Análisis completado**\n• ${Math.floor(Math.random() * 20) + 10} insights encontrados\n• ${Math.floor(Math.random() * 5) + 2} patrones detectados\n• Nivel de confianza: ${Math.floor(Math.random() * 15) + 85}%\n\n📋 **Resumen ejecutivo:**\n${userMessage.substring(0, 150)}...\n\n🔍 *¿Deseas un análisis más detallado o visualización de datos?*`;
            }
        } else {
            // Chat normal
            const responses = [
                `✨ **Respuesta de AVI ${version.name}:**\n\nExcelente pregunta sobre "${userMessage.substring(0, 80)}". La inteligencia artificial está revolucionando la forma en que interactuamos con la tecnología. Con AVI ${version.name}, tienes acceso a herramientas de vanguardia que potencian tu creatividad y productividad.\n\n¿Te gustaría profundizar en algún aspecto específico?`,
                `🧠 **Análisis de AVI:**\n\nHe procesado tu consulta: "${userMessage.substring(0, 80)}".\n\n📌 **Puntos clave:**\n• ${currentVersion === 'ultra' ? 'Análisis semántico avanzado completado' : 'Procesamiento exitoso'}\n• ${version.maxMessages === Infinity ? 'Consultas ilimitadas disponibles' : `Te quedan ${versions[currentVersion].maxMessages - messageCount} mensajes hoy`}\n• ${currentVersion !== 'lite' ? 'Herramientas premium activas' : 'Actualiza para más funciones'}\n\n¿Hay algo más en lo que pueda ayudarte?`,
                `💡 **AVI AI Asistente:**\n\nHe recibido tu mensaje: "${userMessage.substring(0, 80)}".\n\n${currentVersion === 'ultra' ? '🌀 **Modo ULTRA activado** - Procesamiento de máxima potencia' : currentVersion === 'pro' ? '⚡ **Modo PRO activado** - Respuestas optimizadas' : '✨ **Modo LITE activo** - Consultas básicas disponibles'}\n\n¿En qué más puedo asistirte hoy?`
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Añadir mensaje de limitación para LITE
        if (currentVersion === 'lite' && messageCount >= 8) {
            response += `\n\n⚠️ **Nota:** Te quedan ${versions.lite.maxMessages - messageCount} mensajes hoy. Considera actualizar a **AVI PRO** para:\n• Mensajes ilimitados\n• Generación de imágenes\n• Análisis de documentos\n• Respuestas más rápidas`;
        }
        
        addMessage(response);
    }
    
    function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;
        
        const version = versions[currentVersion];
        if (version.maxMessages !== Infinity && messageCount >= version.maxMessages) {
            addMessage('🚫 **Límite alcanzado**\n\nHas alcanzado el límite de mensajes diarios. Actualiza a **AVI PRO**, **ULTRA** o **BUSINESS** para continuar disfrutando de mensajes ilimitados y todas las funciones premium.', false, true);
            return;
        }
        
        addMessage(userMessage, true);
        messageCount++;
        updateMessageCount();
        messageInput.value = '';
        charCount.textContent = '0';
        
        // Simular respuesta de IA con delay
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message avi';
        typingIndicator.innerHTML = `
            <div class="message-avatar"><div class="avatar-glow"></div><span>🤖</span></div>
            <div class="message-content"><div class="message-name">AVI AI</div><div class="message-text"><span class="typing-dots">AVI está escribiendo<span>.</span><span>.</span><span>.</span></span></div></div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        setTimeout(() => {
            typingIndicator.remove();
            simulateAIResponse(userMessage);
        }, 800);
    }
    
    function clearChat() {
        chatMessages.innerHTML = '';
        addMessage(`✨ **Conversación reiniciada**\n\nSoy **AVI ${versions[currentVersion].name}**, tu asistente de inteligencia artificial.\n\n📌 **Versión actual:** ${versions[currentVersion].name}\n🔧 **Herramientas disponibles:** ${currentTool === 'chat' ? 'Chat' : currentTool === 'image' ? 'Generador de imágenes' : currentTool === 'code' ? 'Generador de código' : currentTool === 'analyze' ? 'Analizador de documentos' : 'Generador de video'}\n\n¿En qué puedo ayudarte hoy?`, false);
        messages = [];
    }
    
    /* --------------------------------------------
       6. CAMBIO DE VERSIÓN
       -------------------------------------------- */
    function changeVersion(version) {
        const newVersion = versions[version];
        if (newVersion.requiresAuth && !currentUser) {
            modal.style.display = 'flex';
            alert(`🔐 Para acceder a ${newVersion.name}, necesitas iniciar sesión con tu cuenta AVI.`);
            return;
        }
        
        currentVersion = version;
        updateVersionUI();
        
        // Actualizar botones
        versionBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.version === version) btn.classList.add('active');
        });
        
        // Mensaje de bienvenida a la nueva versión
        addMessage(`✨ **${newVersion.name} activado**\n\n${newVersion.features.map(f => `✓ ${f}`).join('\n')}\n\n🎉 ¡Disfruta de todas las funcionalidades de ${newVersion.name}! ¿En qué puedo ayudarte?`, false);
        
        // Actualizar tooltip de herramientas
        updateToolAccess();
    }
    
    function updateToolAccess() {
        const version = versions[currentVersion];
        const hasAccess = !version.requiresAuth || currentUser;
        
        sidebarItems.forEach(item => {
            const tool = item.dataset.tool;
            let isAvailable = true;
            
            if (tool === 'image' && currentVersion === 'lite') isAvailable = false;
            if (tool === 'video' && currentVersion !== 'ultra') isAvailable = false;
            if (tool === 'analyze' && currentVersion === 'lite') isAvailable = false;
            
            if (!isAvailable && !hasAccess) {
                item.style.opacity = '0.5';
                item.style.cursor = 'not-allowed';
            } else {
                item.style.opacity = '1';
                item.style.cursor = 'pointer';
            }
        });
    }
    
    /* --------------------------------------------
       7. CAMBIO DE HERRAMIENTA
       -------------------------------------------- */
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.dataset.tool;
            let canAccess = true;
            
            if (tool === 'image' && currentVersion === 'lite') canAccess = false;
            if (tool === 'video' && currentVersion !== 'ultra') canAccess = false;
            if (tool === 'analyze' && currentVersion === 'lite') canAccess = false;
            
            if (!canAccess) {
                addMessage(`⚠️ **Acceso restringido**\n\nLa herramienta "${item.querySelector('.sidebar-text').textContent}" requiere **${tool === 'video' ? 'AVI ULTRA' : 'AVI PRO o superior'}**.\n\n✨ Actualiza tu plan para desbloquear todas las funciones.`, false, true);
                return;
            }
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentTool = tool;
            
            const toolNames = {
                chat: '💬 Chat',
                image: '🎨 Generador de Imágenes',
                code: '💻 Generador de Código',
                analyze: '📊 Analizador de Documentos',
                video: '🎬 Generador de Video'
            };
            
            toolIndicator.textContent = toolNames[currentTool];
            
            addMessage(`🛠️ **${toolNames[currentTool]} seleccionado**\n\n¿Qué te gustaría ${currentTool === 'chat' ? 'conversar' : currentTool === 'image' ? 'generar' : currentTool === 'code' ? 'programar' : currentTool === 'analyze' ? 'analizar' : 'crear'}?\n\n✨ Puedes describir tu solicitud en detalle y AVI ${versions[currentVersion].name} se encargará del resto.`, false);
        });
    });
    
    /* --------------------------------------------
       8. MODAL DE LOGIN
       -------------------------------------------- */
    const modalClose = document.querySelector('.modal-close');
    const modalTabs = document.querySelectorAll('.modal-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const submitLogin = document.getElementById('submitLogin');
    const submitRegister = document.getElementById('submitRegister');
    
    loginBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            }
        });
    });
    
    submitLogin.addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email.endsWith('@avi.connection')) {
            alert('❌ El email debe terminar en @avi.connection');
            return;
        }
        
        if (!password) {
            alert('❌ Por favor ingresa tu contraseña');
            return;
        }
        
        currentUser = { email, name: email.split('@')[0] };
        loginBtn.style.display = 'none';
        userAvatar.innerHTML = currentUser.name.charAt(0).toUpperCase();
        modal.style.display = 'none';
        
        addMessage(`✅ **Bienvenido ${currentUser.name}!**\n\nAhora tienes acceso a todas las versiones premium de AVI:\n• **AVI PRO** - Mensajes ilimitados, imágenes, análisis\n• **AVI ULTRA** - Videos, código avanzado\n• **AVI BUSINESS** - API y soporte prioritario\n\nSelecciona la versión que desees en el menú superior.`, false);
        
        updateVersionUI();
        updateToolAccess();
    });
    
    submitRegister.addEventListener('click', () => {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        
        if (!name) {
            alert('❌ Por favor ingresa tu nombre');
            return;
        }
        if (!email.endsWith('@avi.connection')) {
            alert('❌ El email debe terminar en @avi.connection');
            return;
        }
        if (password.length < 8) {
            alert('❌ La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (password !== confirm) {
            alert('❌ Las contraseñas no coinciden');
            return;
        }
        
        alert('✅ ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        modalTabs[0].click();
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirm').value = '';
    });
    
    /* --------------------------------------------
       9. EVENTOS ADICIONALES
       -------------------------------------------- */
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            sendMessage();
        }
        charCount.textContent = messageInput.value.length;
    });
    
    clearChatBtn.addEventListener('click', clearChat);
    
    menuToggle.addEventListener('click', () => {
        const versionMenu = document.querySelector('.version-buttons');
        versionMenu.classList.toggle('open');
        sidebar.classList.toggle('open');
    });
    
    upgradeBtn.addEventListener('click', () => {
        if (!currentUser) {
            modal.style.display = 'flex';
            addMessage(`🔐 **Actualización requerida**\n\nPara acceder a ${versions[currentVersion].name}, necesitas iniciar sesión con tu cuenta AVI.\n\n✨ Regístrate o inicia sesión para desbloquear funciones premium.`, false, true);
        } else {
            addMessage(`✨ **Mejorar plan**\n\nEstás a punto de actualizar a **${versions[currentVersion].name}**.\n\n📋 **Beneficios:**\n${versions[currentVersion].features.map(f => `• ${f}`).join('\n')}\n\n💰 **Precio:** ${versions[currentVersion].price || 'Consultar'}\n\n¿Deseas proceder con la actualización?`, false);
        }
    });
    
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('dynamicIsland');
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
    
    /* --------------------------------------------
       10. INICIALIZACIÓN
       -------------------------------------------- */
    updateVersionUI();
    updateToolAccess();
    
    addMessage(`✨ **Bienvenido a AVI AI**\n\nSoy tu asistente inteligente. Puedes:\n• 💬 **Chatear** para resolver dudas\n• 🎨 **Generar imágenes** (PRO/ULTRA)\n• 💻 **Generar código**\n• 📊 **Analizar documentos** (PRO/ULTRA)\n• 🎬 **Crear videos** (ULTRA)\n\nSelecciona una herramienta en el menú lateral y comienza a crear. 🚀`, false);
    
    console.log('%c🤖 AVI AI | Asistente Inteligente v2.0', 'color: #00f3ff; font-size: 14px; font-weight: bold');
    console.log('%c✓ Versiones: LITE, PRO, ULTRA, BUSINESS', 'color: #00ff55');
    console.log('%c✓ Herramientas: Chat, Imágenes, Código, Análisis, Video', 'color: #00ff55');
    console.log('%c✓ Interfaz dinámica | Animaciones fluidas', 'color: #00ff55');
});