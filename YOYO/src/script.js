class YoYo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width / 2;
        this.y = 100;
        this.stringLength = 200;
        this.yoyoRadius = 20;
        this.angle = 0;
        this.targetAngle = 0;
        this.swinging = false;
        this.speed = 0;
        this.damping = 0.98;
        this.gravity = 0.001;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) { // Left mouse button
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.targetAngle = Math.atan2(x - this.x, y - this.y);
            }
        });

        document.getElementById('swingBtn').addEventListener('click', () => {
            this.swing();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
    }

    swing() {
        this.swinging = true;
        this.speed = 0.1;
    }

    reset() {
        this.angle = 0;
        this.targetAngle = 0;
        this.speed = 0;
        this.swinging = false;
    }

    update() {
        if (this.swinging) {
            this.speed += Math.sin(this.angle) * this.gravity;
            this.speed *= this.damping;
            this.angle += this.speed;
        } else {
            this.angle += (this.targetAngle - this.angle) * 0.1;
        }

        requestAnimationFrame(() => this.update());
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw string
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw yoyo
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, this.yoyoRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('yoyoCanvas');
    const yoyo = new YoYo(canvas);
    yoyo.update();
});