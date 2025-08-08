// Custom cursor implementation
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        cursor.style.transform = 'scale(1.5)';
    } else {
        cursor.style.transform = 'scale(1)';
    }
});

// Particle system configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80 },
        color: { value: '#3498db' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: true
        },
        size: {
            value: 3,
            random: true
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    }
});

class YoYo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width / 2;
        this.y = 100;
        this.stringLength = 200;
        this.yoyoRadius = 20;
        this.angle = 0;
        this.speed = 0;
        this.damping = 0.995;
        this.gravity = 0.0005;
        this.isSwinging = false;
        this.mouseControl = false;
        this.trail = [];
        this.maxTrailLength = 20;
        this.effectsEnabled = false;

        this.init();
    }

    init() {
        // Mouse control events
        this.canvas.addEventListener('mousedown', () => {
            this.mouseControl = true;
            this.isSwinging = false;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouseControl = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouseControl) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left - this.x;
                const y = e.clientY - rect.top - this.y;
                this.angle = Math.atan2(x, y);
            }
        });

        // Button controls
        document.getElementById('swingBtn').addEventListener('click', () => {
            this.isSwinging = !this.isSwinging;
            if (this.isSwinging) {
                this.speed = 0.05;
            }
        });

        document.getElementById('effectBtn').addEventListener('click', () => {
            this.effectsEnabled = !this.effectsEnabled;
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
    }

    reset() {
        this.angle = 0;
        this.speed = 0;
        this.isSwinging = false;
        this.mouseControl = false;
        this.trail = [];
        this.effectsEnabled = false;
    }

    update() {
        if (this.isSwinging) {
            this.speed += Math.sin(this.angle) * this.gravity;
            this.speed *= this.damping;
            this.angle += this.speed;
        }

        // Update trail
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;
        
        if (this.effectsEnabled) {
            this.trail.push({ x: endX, y: endY });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        this.draw();
        requestAnimationFrame(() => this.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate yoyo position
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;

        // Draw trail effect
        if (this.effectsEnabled && this.trail.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                this.ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }

        // Draw string
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw glow effect
        if (this.effectsEnabled) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#3498db';
        }

        // Draw yoyo body
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw yoyo details
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius * 0.7, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('yoyoCanvas');
    const yoyo = new YoYo(canvas);
    yoyo.update();

    // Responsive canvas sizing
    function resizeCanvas() {
        canvas.width = Math.min(800, window.innerWidth - 40);
        canvas.height = Math.min(600, window.innerHeight - 200);
        yoyo.x = canvas.width / 2;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial sizing
});