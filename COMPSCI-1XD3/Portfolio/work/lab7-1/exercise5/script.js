class Ball {
    constructor(x, y, xSpeed, ySpeed) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.radius = 5;
        this.red = Math.floor(Math.random() * 256);
        this.green = Math.floor(Math.random() * 256);
        this.blue = Math.floor(Math.random() * 256);
    }

    moveOneStep() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    draw(ctx) {
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    collidesWithEdge(width, height) {
        return this.x >= width - this.radius ||
            this.x <= this.radius ||
            this.y >= height - this.radius ||
            this.y <= this.radius;
    }
}

window.addEventListener("load", function () {
    const canvas = document.getElementById("animationCanvas");
    const ctx = canvas.getContext("2d");
    const startBtn = document.getElementById("startBtn");
    const resetBtn = document.getElementById("resetBtn");
    const status = document.getElementById("status");

    const BALL_COUNT = 500;
    let balls = [];
    let timerId = null;

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomSpeed() {
        return randomBetween(-5, 5);
    }

    function createBall() {
        const x = canvas.width / 2 + randomBetween(-50, 50);
        const y = canvas.height / 2 + randomBetween(-50, 50);
        return new Ball(x, y, randomSpeed(), randomSpeed());
    }

    function buildBalls() {
        balls = [];
        for (let i = 0; i < BALL_COUNT; i++) {
            balls.push(createBall());
        }
    }

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const b of balls) {
            b.draw(ctx);
        }
    }

    function stopAnimation(message) {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
        startBtn.textContent = "Start";
        if (message) {
            status.textContent = message;
        }
    }

    function updateAnimation() {
        for (const b of balls) {
            b.moveOneStep();
        }

        drawFrame();

        for (const b of balls) {
            if (b.collidesWithEdge(canvas.width, canvas.height)) {
                stopAnimation("Stopped: first ball reached the edge.");
                return;
            }
        }
    }

    startBtn.addEventListener("click", function () {
        if (timerId !== null) {
            stopAnimation("Paused.");
            return;
        }
        timerId = setInterval(updateAnimation, 16);
        startBtn.textContent = "Pause";
        status.textContent = "Animation running.";
    });

    resetBtn.addEventListener("click", function () {
        stopAnimation("New random ball set created.");
        buildBalls();
        drawFrame();
    });

    buildBalls();
    drawFrame();
    status.textContent = "Ready.";
});

