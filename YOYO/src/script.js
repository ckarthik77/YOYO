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

        this.init();
    }

    init() {
        // Mouse control
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

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
    }

    reset() {
        this.angle = 0;
        this.speed = 0;
        this.isSwinging = false;
        this.mouseControl = false;
    }

    update() {
        if (this.isSwinging) {
            this.speed += Math.sin(this.angle) * this.gravity;
            this.speed *= this.damping;
            this.angle += this.speed;
        }

        this.draw();
        requestAnimationFrame(() => this.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate yoyo position
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;

        // Draw string
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

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
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('yoyoCanvas');
    const yoyo = new YoYo(canvas);
    yoyo.update();

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = Math.min(800, window.innerWidth - 40);
        canvas.height = Math.min(600, window.innerHeight - 200);
    });

    // Initial resize
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = Math.min(600, window.innerHeight - 200);
});