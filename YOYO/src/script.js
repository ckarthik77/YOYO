class YoYo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.stringLength = 200;
        this.angle = 0;
        this.speed = 0.03;
        this.direction = 1;
    }

    update() {
        this.angle += this.speed * this.direction;
        if (Math.abs(this.angle) > Math.PI / 2) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        // Draw string
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x + Math.sin(this.angle) * this.stringLength;
        const endY = this.y + Math.cos(this.angle) * this.stringLength;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Draw yo-yo
        ctx.beginPath();
        ctx.arc(endX, endY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.strokeStyle = 'darkred';
        ctx.stroke();
    }
}

const canvas = document.getElementById('yoyoCanvas');
const ctx = canvas.getContext('2d');
const yoyo = new YoYo(400, 100);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    yoyo.update();
    yoyo.draw(ctx);
    requestAnimationFrame(animate);
}

animate();