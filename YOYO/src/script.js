// Enhanced YOYO Physics Simulation
class EnhancedYoYo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
        
        // Physics properties
        this.x = this.canvas.width / 2;
        this.y = 80;
        this.stringLength = 250;
        this.yoyoRadius = 25;
        this.angle = 0;
        this.speed = 0;
        this.damping = 0.998;
        this.gravity = 0.0008;
        
        // Control states
        this.isSwinging = false;
        this.mouseControl = false;
        this.effectsEnabled = false;
        this.colorMode = 0;
        
        // Visual effects
        this.trail = [];
        this.maxTrailLength = 30;
        this.particles = [];
        this.colors = [
            ['#00d4ff', '#b300ff', '#ff0080'],
            ['#ff6b6b', '#4ecdc4', '#45b7d1'],
            ['#96ceb4', '#ffeaa7', '#fab1a0'],
            ['#74b9ff', '#0984e3', '#6c5ce7']
        ];
        
        this.init();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    init() {
        // Mouse/Touch events
        this.canvas.addEventListener('mousedown', (e) => this.startControl(e));
        this.canvas.addEventListener('touchstart', (e) => this.startControl(e.touches[0]));
        
        this.canvas.addEventListener('mouseup', () => this.endControl());
        this.canvas.addEventListener('touchend', () => this.endControl());
        
        this.canvas.addEventListener('mousemove', (e) => this.updateControl(e));
        this.canvas.addEventListener('touchmove', (e) => this.updateControl(e.touches[0]));
        
        // Button controls
        document.getElementById('swingBtn').addEventListener('click', () => this.toggleSwing());
        document.getElementById('effectBtn').addEventListener('click', () => this.toggleEffects());
        document.getElementById('colorBtn').addEventListener('click', () => this.changeColors());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Window resize
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    startControl(e) {
        this.mouseControl = true;
        this.isSwinging = false;
        this.updateButtonStates();
    }
    
    endControl() {
        this.mouseControl = false;
    }
    
    updateControl(e) {
        if (!this.mouseControl) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.x;
        const y = e.clientY - rect.top - this.y;
        this.angle = Math.atan2(x, y);
    }
    
    toggleSwing() {
        this.isSwinging = !this.isSwinging;
        this.mouseControl = false;
        if (this.isSwinging) {
            this.speed = Math.random() * 0.1 + 0.05;
        }
        this.updateButtonStates();
    }
    
    toggleEffects() {
        this.effectsEnabled = !this.effectsEnabled;
        this.updateButtonStates();
    }
    
    changeColors() {
        this.colorMode = (this.colorMode + 1) % this.colors.length;
    }
    
    reset() {
        this.angle = 0;
        this.speed = 0;
        this.isSwinging = false;
        this.mouseControl = false;
        this.effectsEnabled = false;
        this.trail = [];
        this.particles = [];
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const swingBtn = document.getElementById('swingBtn');
        const effectBtn = document.getElementById('effectBtn');
        
        swingBtn.classList.toggle('active', this.isSwinging);
        effectBtn.classList.toggle('active', this.effectsEnabled);
        
        swingBtn.innerHTML = this.isSwinging ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Swing';
    }
    
    updatePhysics() {
        if (this.isSwinging) {
            this.speed += Math.sin(this.angle) * this.gravity;
            this.speed *= this.damping;
            this.angle += this.speed;
        }
        
        // Calculate yoyo position
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;
        
        // Update trail
        if (this.effectsEnabled) {
            this.trail.push({ 
                x: endX, 
                y: endY, 
                time: Date.now(),
                alpha: 1 
            });
            
            // Remove old trail points
            this.trail = this.trail.filter(point => Date.now() - point.time < 1000);
            
            // Add particles occasionally
            if (Math.random() < 0.1) {
                this.addParticle(endX, endY);
            }
        }
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.alpha -= 0.02;
            particle.size *= 0.99;
            
            if (particle.alpha <= 0 || particle.size <= 0.5) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    addParticle(x, y) {
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 4 + 2,
                alpha: 1,
                color: this.colors[this.colorMode][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    draw() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Calculate yoyo position
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;
        
        // Draw trail effect
        if (this.effectsEnabled && this.trail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.trail[0].x, this.trail[0].y);
            
            for (let i = 1; i < this.trail.length; i++) {
                const point = this.trail[i];
                const alpha = 1 - (Date.now() - point.time) / 1000;
                this.ctx.lineTo(point.x, point.y);
            }
            
            const gradient = this.ctx.createLinearGradient(this.trail[0].x, this.trail[0].y, endX, endY);
            gradient.addColorStop(0, `${this.colors[this.colorMode][0]}30`);
            gradient.addColorStop(0.5, `${this.colors[this.colorMode][1]}60`);
            gradient.addColorStop(1, `${this.colors[this.colorMode][2]}90`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 8;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (this.effectsEnabled) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color;
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
        
        // Draw string with gradient
        const stringGradient = this.ctx.createLinearGradient(this.x, this.y, endX, endY);
        stringGradient.addColorStop(0, '#ffffff');
        stringGradient.addColorStop(1, this.colors[this.colorMode][0]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = stringGradient;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        // Draw yoyo with enhanced effects
        this.ctx.save();
        
        if (this.effectsEnabled) {
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = this.colors[this.colorMode][1];
        }
        
        // Outer ring
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius + 5, 0, Math.PI * 2);
        const outerGradient = this.ctx.createRadialGradient(endX, endY, 0, endX, endY, this.yoyoRadius + 5);
        outerGradient.addColorStop(0, this.colors[this.colorMode][0]);
        outerGradient.addColorStop(1, this.colors[this.colorMode][1]);
        this.ctx.fillStyle = outerGradient;
        this.ctx.fill();
        
        // Main yoyo body
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius, 0, Math.PI * 2);
        const mainGradient = this.ctx.createRadialGradient(endX - 8, endY - 8, 0, endX, endY, this.yoyoRadius);
        mainGradient.addColorStop(0, '#ffffff');
        mainGradient.addColorStop(0.3, this.colors[this.colorMode][2]);
        mainGradient.addColorStop(1, this.colors[this.colorMode][1]);
        this.ctx.fillStyle = mainGradient;
        this.ctx.fill();
        
        // Inner details
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius * 0.6, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fill();
        
        // Spinning effect
        if (this.isSwinging || this.mouseControl) {
            const spinAngle = Date.now() * 0.01;
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2 / 6) + spinAngle;
                const x1 = endX + Math.cos(angle) * this.yoyoRadius * 0.4;
                const y1 = endY + Math.sin(angle) * this.yoyoRadius * 0.4;
                const x2 = endX + Math.cos(angle) * this.yoyoRadius * 0.7;
                const y2 = endY + Math.sin(angle) * this.yoyoRadius * 0.7;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
        
        // Draw attachment point
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = this.colors[this.colorMode][0];
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    animate() {
        this.updatePhysics();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Particle System for Background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 120, density: { enable: true, value_area: 800 } },
                color: { value: ['#00
