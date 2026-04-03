/* ============================================
   CONNECTION PÍXEL - CANVAS STUDIO
   IA Líder: VINSHI | Sistema de Edición
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    console.log('Canvas Studio iniciando...');
    
    /* --------------------------------------------
       1. ELEMENTOS DEL DOM
       -------------------------------------------- */
    const canvas = document.getElementById('mainCanvas');
    if (!canvas) {
        console.error('Canvas no encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    canvas.width = 800;
    canvas.height = 600;
    
    // Variables de dibujo
    let drawing = false;
    let currentMode = 'draw';
    let currentColor = '#ff0055';
    let currentBrushSize = 5;
    let lastX = 0, lastY = 0;
    
    // Historial
    let history = [];
    let historyIndex = -1;
    
    // Elementos DOM
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const sizeValue = document.getElementById('sizeValue');
    const currentModeSpan = document.getElementById('currentMode');
    const currentSizeSpan = document.getElementById('currentSize');
    
    const btnDraw = document.getElementById('btnDraw');
    const btnEraser = document.getElementById('btnEraser');
    const btnText = document.getElementById('btnText');
    const btnClear = document.getElementById('btnClear');
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    const btnNewProject = document.getElementById('btnNewProject');
    const btnSaveProject = document.getElementById('btnSaveProject');
    const btnLoadProject = document.getElementById('btnLoadProject');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const textInput = document.getElementById('textInput');
    const addTextBtn = document.getElementById('addTextBtn');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeInput = document.getElementById('fontSize');
    
    const exportPNG = document.getElementById('exportPNG');
    const exportJPG = document.getElementById('exportJPG');
    const exportSVG = document.getElementById('exportSVG');
    const copyToClipboard = document.getElementById('copyToClipboard');
    const downloadProject = document.getElementById('downloadProject');
    const aiSuggestion = document.getElementById('aiSuggestion');
    
    /* --------------------------------------------
       2. INICIALIZAR CANVAS
       -------------------------------------------- */
    function initCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
        console.log('Canvas inicializado');
    }
    
    /* --------------------------------------------
       3. FUNCIONES DE DIBUJO
       -------------------------------------------- */
    function startDrawing(e) {
        drawing = true;
        const pos = getMousePos(e);
        lastX = pos.x;
        lastY = pos.y;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    }
    
    function draw(e) {
        if (!drawing) return;
        
        const pos = getMousePos(e);
        const currentX = pos.x;
        const currentY = pos.y;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        
        if (currentMode === 'draw') {
            ctx.strokeStyle = currentColor;
        } else if (currentMode === 'eraser') {
            ctx.strokeStyle = 'white';
        }
        
        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        lastX = currentX;
        lastY = currentY;
    }
    
    function stopDrawing() {
        if (drawing) {
            drawing = false;
            saveToHistory();
        }
    }
    
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        let x = (clientX - rect.left) * scaleX;
        let y = (clientY - rect.top) * scaleY;
        
        return {
            x: Math.min(Math.max(0, x), canvas.width),
            y: Math.min(Math.max(0, y), canvas.height)
        };
    }
    
    function setMode(mode) {
        currentMode = mode;
        if (currentModeSpan) {
            currentModeSpan.textContent = mode === 'draw' ? 'Dibujar' : mode === 'eraser' ? 'Borrador' : 'Texto';
        }
        
        if (btnDraw) btnDraw.classList.remove('active');
        if (btnEraser) btnEraser.classList.remove('active');
        if (btnText) btnText.classList.remove('active');
        
        if (mode === 'draw' && btnDraw) btnDraw.classList.add('active');
        else if (mode === 'eraser' && btnEraser) btnEraser.classList.add('active');
        else if (mode === 'text' && btnText) btnText.classList.add('active');
    }
    
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
    }
    
    /* --------------------------------------------
       4. FUNCIONES DE TEXTO
       -------------------------------------------- */
    function addText() {
        if (!textInput) return;
        const text = textInput.value.trim();
        if (!text) {
            alert('Por favor escribe un texto');
            return;
        }
        
        const font = fontSelect ? fontSelect.value : 'Arial';
        const fontSize = fontSizeInput ? parseInt(fontSizeInput.value) : 24;
        
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = currentColor;
        const x = canvas.width / 2 - ctx.measureText(text).width / 2;
        const y = canvas.height / 2;
        ctx.fillText(text, x, y);
        
        saveToHistory();
        if (textInput) textInput.value = '';
    }
    
    /* --------------------------------------------
       5. HISTORIAL
       -------------------------------------------- */
    function saveToHistory() {
        const imageData = canvas.toDataURL();
        
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        
        history.push(imageData);
        historyIndex = history.length - 1;
        
        if (history.length > 30) {
            history.shift();
            historyIndex--;
        }
    }
    
    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            restoreFromHistory();
        }
    }
    
    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            restoreFromHistory();
        }
    }
    
    function restoreFromHistory() {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyIndex];
    }
    
    /* --------------------------------------------
       6. FUNCIONES DE ARCHIVOS
       -------------------------------------------- */
    function newProject() {
        if (confirm('¿Crear nuevo proyecto? Se perderán los cambios no guardados.')) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveToHistory();
        }
    }
    
    function saveProject() {
        const projectData = {
            version: '1.0',
            imageData: canvas.toDataURL(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixel_project_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ Proyecto guardado');
    }
    
    function loadProject() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const projectData = JSON.parse(ev.target.result);
                    const img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        saveToHistory();
                        alert('✅ Proyecto cargado');
                    };
                    img.src = projectData.imageData;
                } catch (error) {
                    alert('❌ Error al cargar el proyecto');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    function downloadProjectFile() {
        saveProject();
    }
    
    /* --------------------------------------------
       7. SUBIDA DE IMÁGENES
       -------------------------------------------- */
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImageToCanvas(file);
        }
    }
    
    function handleDrop(event) {
        event.preventDefault();
        if (uploadArea) uploadArea.style.borderColor = 'rgba(255, 0, 85, 0.3)';
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImageToCanvas(file);
        }
    }
    
    function loadImageToCanvas(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                saveToHistory();
                alert('✅ Imagen agregada al canvas');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    /* --------------------------------------------
       8. EXPORTACIÓN
       -------------------------------------------- */
    function exportImage(format) {
        const link = document.createElement('a');
        link.download = `pixel_design_${Date.now()}.${format}`;
        link.href = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.9);
        link.click();
        alert(`✅ Exportado como ${format.toUpperCase()}`);
    }
    
    function exportAsSVG() {
        const svgData = `<?xml version="1.0" encoding="UTF-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                <image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}"/>
            </svg>`;
        
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = `pixel_design_${Date.now()}.svg`;
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ Exportado como SVG');
    }
    
    async function copyCanvasToClipboard() {
        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            alert('✅ Copiado al portapapeles');
        } catch (error) {
            alert('❌ No se pudo copiar al portapapeles');
        }
    }
    
    /* --------------------------------------------
       9. IA VINSHI - SUGERENCIAS
       -------------------------------------------- */
    const suggestions = [
        "✨ Agrega formas geométricas para un diseño moderno",
        "🎨 Combina colores complementarios para impacto visual",
        "📝 Usa tipografías sans-serif para diseños legibles",
        "🖼️ Añade capas para organizar mejor tus elementos",
        "⭐ Las formas redondeadas transmiten cercanía",
        "🔴 El rojo transmite energía - úsalo con moderación",
        "💙 El azul transmite confianza y profesionalismo",
        "💚 El verde transmite naturaleza y sostenibilidad",
        "⚫ El contraste mejora la legibilidad"
    ];
    
    function generateAISuggestion() {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        const suggestionText = suggestions[randomIndex];
        const aiDiv = document.querySelector('.ai-suggestion p');
        if (aiDiv) aiDiv.textContent = `✨ "${suggestionText}"`;
    }
    
    /* --------------------------------------------
       10. EVENTOS
       -------------------------------------------- */
    function setupEvents() {
        // Canvas events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
        canvas.addEventListener('touchend', stopDrawing);
        
        // Toolbar events
        if (colorPicker) colorPicker.addEventListener('input', (e) => { currentColor = e.target.value; });
        if (brushSize) brushSize.addEventListener('input', (e) => {
            currentBrushSize = parseInt(e.target.value);
            if (sizeValue) sizeValue.textContent = currentBrushSize + 'px';
            if (currentSizeSpan) currentSizeSpan.textContent = currentBrushSize;
        });
        
        if (btnDraw) btnDraw.addEventListener('click', () => setMode('draw'));
        if (btnEraser) btnEraser.addEventListener('click', () => setMode('eraser'));
        if (btnText) btnText.addEventListener('click', () => setMode('text'));
        if (btnClear) btnClear.addEventListener('click', clearCanvas);
        if (btnUndo) btnUndo.addEventListener('click', undo);
        if (btnRedo) btnRedo.addEventListener('click', redo);
        if (btnNewProject) btnNewProject.addEventListener('click', newProject);
        if (btnSaveProject) btnSaveProject.addEventListener('click', saveProject);
        if (btnLoadProject) btnLoadProject.addEventListener('click', loadProject);
        
        // Upload events
        if (uploadArea) uploadArea.addEventListener('click', () => fileUpload && fileUpload.click());
        if (uploadArea) uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); if (uploadArea) uploadArea.style.borderColor = '#ff0055'; });
        if (uploadArea) uploadArea.addEventListener('dragleave', () => { if (uploadArea) uploadArea.style.borderColor = 'rgba(255, 0, 85, 0.3)'; });
        if (uploadArea) uploadArea.addEventListener('drop', handleDrop);
        if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
        
        // Text events
        if (addTextBtn) addTextBtn.addEventListener('click', addText);
        
        // Export events
        if (exportPNG) exportPNG.addEventListener('click', () => exportImage('png'));
        if (exportJPG) exportJPG.addEventListener('click', () => exportImage('jpg'));
        if (exportSVG) exportSVG.addEventListener('click', exportAsSVG);
        if (copyToClipboard) copyToClipboard.addEventListener('click', copyCanvasToClipboard);
        if (downloadProject) downloadProject.addEventListener('click', downloadProjectFile);
        if (aiSuggestion) aiSuggestion.addEventListener('click', generateAISuggestion);
    }
    
    /* --------------------------------------------
       11. PRELOADER
       -------------------------------------------- */
    function hidePreloader() {
        const preloader = document.getElementById('preloaderCanvas');
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                if (preloader) preloader.style.display = 'none';
            }, 600);
        }
    }
    
    /* --------------------------------------------
       12. NAVBAR DINÁMICA
       -------------------------------------------- */
    function setupNavbar() {
        const menuToggle = document.querySelector('.menu-toggle-pixel');
        const navLinks = document.querySelector('.island-links');
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
        }
        
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('dynamicIsland');
            if (navbar) {
                if (window.scrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            }
        });
    }
    
    /* --------------------------------------------
       13. INICIALIZACIÓN
       -------------------------------------------- */
    function resizeCanvas() {
        const container = document.querySelector('.canvas-area');
        if (container) {
            const maxWidth = container.clientWidth - 40;
            canvas.style.width = `${Math.min(maxWidth, canvas.width)}px`;
            canvas.style.height = 'auto';
        }
    }
    
    window.addEventListener('load', () => {
        initCanvas();
        setupEvents();
        setupNavbar();
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        hidePreloader();
        document.body.classList.add('loaded');
        
        console.log('%c🎨 CONNECTION PÍXEL | Canvas Studio', 'color: #ff0055; font-size: 14px; font-weight: bold');
        console.log('%c✓ IA VINSHI activada | Herramientas listas', 'color: #00ff55');
    });
});