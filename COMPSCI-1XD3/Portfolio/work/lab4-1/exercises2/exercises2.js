// Create a lottery ball object
class LotteryBall {
    constructor() {
        this.color = Math.random() < 0.5 ? "red" : "white";
        this.points = Math.floor(Math.random() * 101);
    }
}

// Initialize game
const balls = [];
for (let i = 0; i < 100; i++) {
    balls.push(new LotteryBall());
}

// Show first ball created
alert(`First ball created:\nColor: ${balls[0].color}\nPoints: ${balls[0].points}`);

// Game logic
let score = 0;
const drawnBalls = new Set();
let gameActive = true;

while (gameActive) {
    const input = prompt(
        `Enter a ball number (0-99) to draw.\nCurrent score: ${score}\n(or press Cancel to quit)`
    );

    if (input === null) {
        // User clicked Cancel
        alert(`Game Over!\nYour final score: ${score}`);
        gameActive = false;
        break;
    }

    const ballIndex = parseInt(input);

    // Validate input
    if (isNaN(ballIndex) || ballIndex < 0 || ballIndex > 99) {
        alert("Invalid input. Please enter a number between 0 and 99.");
        continue;
    }

    // Check if already drawn
    if (drawnBalls.has(ballIndex)) {
        alert("You already drew that ball. Try another.");
        continue;
    }

    // Mark as drawn
    drawnBalls.add(ballIndex);

    // Get ball
    const ball = balls[ballIndex];
    alert(`Ball ${ballIndex}:\nColor: ${ball.color}\nPoints: ${ball.points}`);

    if (ball.color === "red") {
        score -= ball.points;
        alert(`Red ball! You lost ${ball.points} points.\nYour final score: ${score}`);
        gameActive = false;
    } else {
        score += ball.points;
        alert(`White ball! You gained ${ball.points} points.\nCurrent score: ${score}`);
    }
}