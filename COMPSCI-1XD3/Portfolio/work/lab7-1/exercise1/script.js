class GuessingGame {
    constructor(min = 1, max = 100, maxWrong = 10) {
        this.title = `Guessing Game (${min}-${max})`;
        this.min = min;
        this.max = max;
        this.maxWrong = maxWrong;
        this.target = this.randomNumber();
        this.totalGuesses = 0;
        this.wrongGuesses = 0;
        this.lastGuess = null;
        this.lastFeedback = "Start guessing.";
    }

    randomNumber() {
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

    guess(value) {
        const guess = Number.parseInt(value, 10);
        if (!Number.isInteger(guess) || guess < this.min || guess > this.max) {
            this.lastFeedback = `Please enter a whole number from ${this.min} to ${this.max}.`;
            return "invalid";
        }

        this.lastGuess = guess;
        this.totalGuesses += 1;

        if (guess === this.target) {
            this.lastFeedback = "Correct.";
            return "correct";
        }

        this.wrongGuesses += 1;
        if (this.wrongGuesses >= this.maxWrong) {
            this.lastFeedback = "Out of guesses.";
            return "game-over";
        }

        if (guess < this.target) {
            this.lastFeedback = "Too low.";
            return "low";
        }

        this.lastFeedback = "Too high.";
        return "high";
    }

    render(container) {
        const last = this.lastGuess === null ? "None" : String(this.lastGuess);
        container.innerHTML = `
            <div><strong>Title:</strong> ${this.title}</div>
            <div><strong>Total guesses:</strong> ${this.totalGuesses}</div>
            <div><strong>Wrong guesses:</strong> ${this.wrongGuesses}/${this.maxWrong}</div>
            <div><strong>Most recent guess:</strong> ${last}</div>
            <div><strong>Feedback:</strong> ${this.lastFeedback}</div>
        `;
    }
}

window.addEventListener("load", function () {
    const form = document.getElementById("guessForm");
    const input = document.getElementById("guessInput");
    const message = document.getElementById("message");
    const state = document.getElementById("state");
    let game = new GuessingGame();

    game.render(state);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const result = game.guess(input.value);

        if (result === "correct") {
            message.textContent = `Correct. The number was ${game.target}. Starting a new game.`;
            game = new GuessingGame();
        } else if (result === "game-over") {
            message.textContent = `Game over after ${game.maxWrong} incorrect guesses. The number was ${game.target}. Starting a new game.`;
            game = new GuessingGame();
        } else if (result === "invalid") {
            message.textContent = game.lastFeedback;
        } else {
            message.textContent = game.lastFeedback;
        }

        game.render(state);
        input.value = "";
        input.focus();
    });
});
