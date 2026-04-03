/* ============================================
   CONNECTION PÍXEL - TRANSITION SYSTEM
   Animación de carga entre páginas
   ============================================ */

class PageTransition {
    constructor() {
        this.transitionOverlay = null;
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.createTransitionOverlay();
        this.interceptLinks();
        this.handlePopState();
        
        window.addEventListener('beforeunload', () => {
            this.isTransitioning = false;
        });
    }
    
    createTransitionOverlay() {
        if (!document.getElementById('pageTransition')) {
            const overlay = document.createElement('div');
            overlay.id = 'pageTransition';
            overlay.innerHTML = `
                <div class="transition-container">
                    <div class="transition-ring"></div>
                    <div class="transition-logo">
                        <span class="transition-icon">✨</span>
                        <span class="transition-text">CONNECTION PÍXEL</span>
                    </div>
                    <div class="transition-bar">
                        <div class="transition-progress"></div>
                    </div>
                    <div class="transition-glow"></div>
                </div>
            `;
            document.body.appendChild(overlay);
            this.transitionOverlay = overlay;
            
            const style = document.createElement('style');
            style.textContent = `
                #pageTransition {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #050510, #0a0a2a);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.4s ease, visibility 0.4s ease;
                    pointer-events: none;
                }
                
                #pageTransition.active {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: all;
                }
                
                .transition-container {
                    position: relative;
                    text-align: center;
                    animation: fadeInScale 0.5s ease forwards;
                }
                
                .transition-ring {
                    width: 120px;
                    height: 120px;
                    border: 3px solid rgba(255, 0, 85, 0.2);
                    border-top-color: #ff0055;
                    border-right-color: #ff3366;
                    border-bottom-color: #b300ff;
                    border-radius: 50%;
                    margin: 0 auto 30px;
                    animation: spinRing 1s linear infinite;
                }
                
                .transition-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 30px;
                    font-family: 'Orbitron', monospace;
                    font-size: 1.2rem;
                    letter-spacing: 2px;
                    color: #fff;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease 0.2s forwards;
                }
                
                .transition-icon {
                    font-size: 1.8rem;
                    animation: pulseIcon 1s ease-in-out infinite;
                }
                
                .transition-text {
                    background: linear-gradient(135deg, #ff0055, #ff3366, #b300ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                
                .transition-bar {
                    width: 280px;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                    margin: 0 auto;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease 0.3s forwards;
                }
                
                .transition-progress {
                    width: 0%;
                    height: 100%;
                    background: linear-gradient(90deg, #ff0055, #ff3366, #b300ff);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                
                .transition-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255, 0, 85, 0.2), transparent);
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    opacity: 0;
                    animation: pulseGlow 1.5s ease-in-out infinite;
                }
                
                @keyframes spinRing {
                    to { transform: rotate(360deg); }
                }
                
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes pulseIcon {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 1; }
                }
                
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
                    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Ignorar enlaces externos, anclas (#) y target _blank
            if (href.startsWith('http') || href.startsWith('#') || link.target === '_blank') return;
            
            // Ignorar si es el mismo enlace
            if (href === window.location.pathname || href === window.location.href) return;
            
            e.preventDefault();
            this.navigateTo(href);
        });
    }
    
    navigateTo(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.showTransition();
        
        const progressBar = document.querySelector('.transition-progress');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, 80);
        
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }
    
    showTransition() {
        if (this.transitionOverlay) {
            this.transitionOverlay.classList.add('active');
            const progressBar = document.querySelector('.transition-progress');
            if (progressBar) progressBar.style.width = '0%';
        }
    }
    
    hideTransition() {
        if (this.transitionOverlay) {
            this.transitionOverlay.classList.remove('active');
        }
        this.isTransitioning = false;
    }
    
    handlePopState() {
        window.addEventListener('popstate', () => {
            this.showTransition();
            setTimeout(() => {
                this.hideTransition();
            }, 800);
        });
    }
    
    showInitialTransition() {
        this.showTransition();
        setTimeout(() => {
            this.hideTransition();
        }, 800);
    }
}

// Inicializar el sistema de transición cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransition = new PageTransition();
    
    // Mostrar transición inicial solo si es necesario
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.pageTransition.showInitialTransition();
    }
});

window.PageTransition = PageTransition;