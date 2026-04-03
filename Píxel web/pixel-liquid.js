/* ============================================
   CONNECTION PÍXEL - LIQUID EFFECT LIGERO
   Canvas 2D + GSAP | Efecto de distorsión fluida
   Optimizado para rendimiento
   ============================================ */

class LiquidHoverEffect {
    constructor(canvas, imageUrl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imageUrl = imageUrl;
        this.img = new Image();
        this.isHovering = false;
        this.intensity = 0;
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Configurar dimensiones del canvas
        this.resizeCanvas();
        
        // Cargar imagen
        this.img.crossOrigin = "Anonymous";
        this.img.src = this.imageUrl;
        
        this.img.onload = () => {
            this.draw();
            this.startAnimation();
        };
        
        // Eventos de hover
        this.canvas.addEventListener('mouseenter', () => this.onHoverStart());
        this.canvas.addEventListener('mouseleave', () => this.onHoverEnd());
        
        // Resize observer
        const resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        resizeObserver.observe(this.canvas.parentElement);
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }
    
    onHoverStart() {
        this.isHovering = true;
        gsap.to(this, {
            intensity: 1.2,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => this.draw()
        });
    }
    
    onHoverEnd() {
        this.isHovering = false;
        gsap.to(this, {
            intensity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: () => this.draw()
        });
    }
    
    // Algoritmo de distorsión líquida optimizado
    draw() {
        if (!this.img.complete || this.img.naturalWidth === 0) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        if (w === 0 || h === 0) return;
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, w, h);
        
        // Si no hay intensidad, mostrar imagen normal
        if (this.intensity <= 0.05) {
            this.ctx.drawImage(this.img, 0, 0, w, h);
            return;
        }
        
        // Crear buffer de imagen temporal
        const offCanvas = document.createElement('canvas');
        offCanvas.width = w;
        offCanvas.height = h;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(this.img, 0, 0, w, h);
        const imageData = offCtx.getImageData(0, 0, w, h);
        const data = imageData.data;
        
        // Crear nuevo array para la imagen distorsionada
        const newImageData = this.ctx.createImageData(w, h);
        const newData = newImageData.data;
        
        // Intensidad del efecto
        const strength = this.intensity * 12;
        const time = this.time;
        
        // Recorrer píxeles con distorsión optimizada (cada 2 píxeles para rendimiento)
        for (let y = 0; y < h; y += 1) {
            for (let x = 0; x < w; x += 1) {
                // Coordenadas UV normalizadas
                const u = x / w;
                const v = y / h;
                
                // Crear distorsión con ondas sinusoidales + ruido
                const offsetX = Math.sin(v * 12 + time * 4) * 0.03 * this.intensity +
                                Math.cos(u * 8 + time * 3) * 0.02 * this.intensity +
                                Math.sin((u * 15 + v * 10) + time * 5) * 0.015 * this.intensity;
                
                const offsetY = Math.cos(u * 12 + time * 4.5) * 0.03 * this.intensity +
                                Math.sin(v * 8 + time * 3.5) * 0.02 * this.intensity +
                                Math.cos((v * 15 + u * 10) + time * 5.5) * 0.015 * this.intensity;
                
                // Aplicar offset
                let newX = x + offsetX * strength;
                let newY = y + offsetY * strength;
                
                // Clamp a bordes
                newX = Math.min(Math.max(newX, 0), w - 1);
                newY = Math.min(Math.max(newY, 0), h - 1);
                
                const srcIdx = (Math.floor(newY) * w + Math.floor(newX)) * 4;
                const dstIdx = (y * w + x) * 4;
                
                if (srcIdx >= 0 && srcIdx < data.length) {
                    newData[dstIdx] = data[srcIdx];     // R
                    newData[dstIdx + 1] = data[srcIdx + 1]; // G
                    newData[dstIdx + 2] = data[srcIdx + 2]; // B
                    newData[dstIdx + 3] = data[srcIdx + 3]; // A
                    
                    // Efecto de brillo en bordes (toque magenta)
                    const glowIntensity = (Math.abs(offsetX) + Math.abs(offsetY)) * this.intensity * 0.8;
                    if (glowIntensity > 0.1) {
                        newData[dstIdx] = Math.min(255, newData[dstIdx] + 80 * glowIntensity);
                        newData[dstIdx + 1] = Math.min(255, newData[dstIdx + 1] + 20 * glowIntensity);
                        newData[dstIdx + 2] = Math.min(255, newData[dstIdx + 2] + 50 * glowIntensity);
                    }
                } else {
                    // Si está fuera de rango, copiar píxel original
                    const origIdx = (y * w + x) * 4;
                    newData[dstIdx] = data[origIdx];
                    newData[dstIdx + 1] = data[origIdx + 1];
                    newData[dstIdx + 2] = data[origIdx + 2];
                    newData[dstIdx + 3] = data[origIdx + 3];
                }
            }
        }
        
        this.ctx.putImageData(newImageData, 0, 0);
        
        // Efecto de brillo adicional si está en hover
        if (this.intensity > 0.5) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.fillStyle = `rgba(255, 0, 85, ${this.intensity * 0.15})`;
            this.ctx.fillRect(0, 0, w, h);
            this.ctx.restore();
        }
    }
    
    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            if (this.intensity > 0 || this.isHovering) {
                this.time += 0.03;
                this.draw();
            }
        };
        animate();
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Inicializar efectos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const effects = [];
    
    portfolioItems.forEach((item, index) => {
        const canvas = item.querySelector('.liquid-canvas');
        const imageContainer = item.querySelector('.portfolio-image');
        const imageUrl = imageContainer?.getAttribute('data-image');
        
        if (canvas && imageUrl) {
            // Pequeño delay escalonado para mejor rendimiento
            setTimeout(() => {
                const effect = new LiquidHoverEffect(canvas, imageUrl);
                effects.push(effect);
            }, index * 30);
        }
    });
    
    console.log('%c✨ Liquid Hover Effect initialized - VINSHI Creative Engine', 'color: #ff0055');
    console.log('%c⚡ Optimized for performance - Canvas 2D + GSAP', 'color: #00ff55');
});