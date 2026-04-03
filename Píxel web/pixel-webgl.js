/* ============================================
   CONNECTION PÍXEL - LIQUID DISPLACEMENT EFFECT
   Three.js + GSAP | WebGL Liquid Hover Effect
   ============================================ */

import * as THREE from 'three';

class LiquidDisplacementEffect {
    constructor(container, imageUrl) {
        this.container = container;
        this.imageUrl = imageUrl;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.material = null;
        this.mesh = null;
        this.clock = new THREE.Clock();
        this.hoverProgress = 0;
        this.isHovering = false;
        
        this.init();
    }
    
    init() {
        // Obtener dimensiones del contenedor
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Crear escena
        this.scene = new THREE.Scene();
        
        // Crear cámara ortográfica para plano a medida
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.z = 1;
        
        // Crear renderer con transparencia
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Insertar canvas en el contenedor
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // Cargar textura principal
        const textureLoader = new THREE.TextureLoader();
        const mainTexture = textureLoader.load(this.imageUrl);
        mainTexture.wrapS = THREE.RepeatWrapping;
        mainTexture.wrapT = THREE.RepeatWrapping;
        
        // Crear textura de ruido (displacement map)
        const noiseCanvas = this.createNoiseTexture(512);
        const displacementTexture = new THREE.CanvasTexture(noiseCanvas);
        displacementTexture.wrapS = THREE.RepeatWrapping;
        displacementTexture.wrapT = THREE.RepeatWrapping;
        displacementTexture.repeat.set(2, 2);
        
        // Vertex Shader
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_PointSize = 1.0;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        // Fragment Shader con efecto líquido
        const fragmentShader = `
            uniform sampler2D uTexture;
            uniform sampler2D uDisplacement;
            uniform float uTime;
            uniform float uIntensity;
            uniform vec2 uResolution;
            varying vec2 vUv;
            
            void main() {
                // Coordenadas UV con desplazamiento
                vec2 uv = vUv;
                
                // Sample displacement map con movimiento temporal
                vec2 displacementCoord = uv * 2.0 + vec2(uTime * 0.05, uTime * 0.03);
                vec4 displacement = texture2D(uDisplacement, displacementCoord);
                
                // Crear efecto de onda líquida
                float strength = uIntensity * 0.15;
                vec2 offset = vec2(
                    (displacement.r - 0.5) * strength,
                    (displacement.g - 0.5) * strength
                );
                
                // Añadir ondulación sinusoidal para más fluidez
                offset.x += sin(uv.y * 20.0 + uTime * 5.0) * 0.01 * uIntensity;
                offset.y += cos(uv.x * 20.0 + uTime * 4.0) * 0.01 * uIntensity;
                
                // Aplicar offset a UV
                vec2 distortedUv = uv + offset;
                
                // Evitar bordes extremos
                distortedUv = clamp(distortedUv, 0.01, 0.99);
                
                // Sample textura final
                vec4 color = texture2D(uTexture, distortedUv);
                
                // Efecto de brillo en bordes distorsionados
                float edgeGlow = abs(offset.x) + abs(offset.y);
                color.rgb += vec3(0.8, 0.2, 0.4) * edgeGlow * 0.3 * uIntensity;
                
                gl_FragColor = color;
            }
        `;
        
        // Crear geometría plana
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // Crear material con uniforms
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: mainTexture },
                uDisplacement: { value: displacementTexture },
                uTime: { value: 0 },
                uIntensity: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });
        
        // Crear mesh y añadir a escena
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
        
        // Iniciar animación
        this.animate();
        
        // Configurar eventos de hover
        this.setupHoverEvents();
        
        // Configurar resize observer
        this.setupResizeObserver();
    }
    
    createNoiseTexture(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Generar ruido Simplex-like
        const imageData = ctx.createImageData(size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Ruido Perlin simplificado
            const x = (i / 4) % size;
            const y = Math.floor((i / 4) / size);
            const value = Math.sin(x * 0.05) * Math.cos(y * 0.05) + 
                         Math.sin(x * 0.2) * 0.5 + 
                         Math.cos(y * 0.15) * 0.5;
            const noise = (value + 1) / 2;
            
            imageData.data[i] = noise * 255;     // R
            imageData.data[i + 1] = noise * 255; // G
            imageData.data[i + 2] = noise * 255; // B
            imageData.data[i + 3] = 255;         // A
        }
        ctx.putImageData(imageData, 0, 0);
        
        return canvas;
    }
    
    setupHoverEvents() {
        let hoverAnimation;
        
        this.container.addEventListener('mouseenter', () => {
            this.isHovering = true;
            if (hoverAnimation) hoverAnimation.kill();
            
            hoverAnimation = gsap.to(this.material.uniforms.uIntensity, {
                value: 1.2,
                duration: 0.6,
                ease: "power2.out",
                overwrite: true
            });
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
            if (hoverAnimation) hoverAnimation.kill();
            
            hoverAnimation = gsap.to(this.material.uniforms.uIntensity, {
                value: 0,
                duration: 0.8,
                ease: "power2.inOut",
                overwrite: true
            });
        });
    }
    
    setupResizeObserver() {
        const resizeObserver = new ResizeObserver(() => {
            const rect = this.container.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            if (width > 0 && height > 0) {
                this.renderer.setSize(width, height);
                this.material.uniforms.uResolution.value.set(width, height);
            }
        });
        
        resizeObserver.observe(this.container);
    }
    
    animate() {
        const animateFrame = () => {
            requestAnimationFrame(animateFrame);
            
            const time = this.clock.getElapsedTime();
            this.material.uniforms.uTime.value = time;
            
            // Animación sutil cuando no hay hover
            if (!this.isHovering && this.material.uniforms.uIntensity.value > 0) {
                // Pequeño efecto de "respiración"
                const breathIntensity = Math.sin(time * 1.5) * 0.08;
                if (this.material.uniforms.uIntensity.value < 0.2) {
                    this.material.uniforms.uIntensity.value = breathIntensity * 0.5;
                }
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animateFrame();
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
        }
        if (this.material) {
            this.material.dispose();
        }
        if (this.mesh) {
            this.mesh.geometry.dispose();
        }
    }
}

// Inicializar efectos para cada portfolio-item
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const effects = [];
    
    portfolioItems.forEach((item, index) => {
        const imageContainer = item.querySelector('.portfolio-image');
        const imageUrl = imageContainer?.getAttribute('data-image');
        
        if (imageUrl && imageContainer) {
            // Pequeño delay escalonado para mejor rendimiento
            setTimeout(() => {
                const effect = new LiquidDisplacementEffect(imageContainer, imageUrl);
                effects.push(effect);
            }, index * 50);
        }
    });
    
    // Limpiar efectos al salir de la página (opcional)
    window.addEventListener('beforeunload', () => {
        effects.forEach(effect => effect.dispose());
    });
    
    console.log('%c✨ Liquid Displacement Effects initialized', 'color: #ff0055');
});