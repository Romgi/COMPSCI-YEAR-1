const STORAGE_KEY = "cs1xd3_lab7_guessing_game";

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
        this.guessHistory = [];
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
        this.guessHistory.push(guess);

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

    toJSON() {
        return {
            title: this.title,
            min: this.min,
            max: this.max,
            maxWrong: this.maxWrong,
            target: this.target,
            totalGuesses: this.totalGuesses,
            wrongGuesses: this.wrongGuesses,
            lastGuess: this.lastGuess,
            lastFeedback: this.lastFeedback,
            guessHistory: this.guessHistory
        };
    }

    static fromJSON(data) {
        if (!data || typeof data !== "object") {
            return new GuessingGame();
        }

        const game = new GuessingGame(data.min, data.max, data.maxWrong);
        game.title = typeof data.title === "string" ? data.title : game.title;
        game.target = Number.isInteger(data.target) ? data.target : game.target;
        game.totalGuesses = Number.isInteger(data.totalGuesses) ? data.totalGuesses : 0;
        game.wrongGuesses = Number.isInteger(data.wrongGuesses) ? data.wrongGuesses : 0;
        game.lastGuess = data.lastGuess === null || Number.isInteger(data.lastGuess) ? data.lastGuess : null;
        game.lastFeedback = typeof data.lastFeedback === "string" ? data.lastFeedback : "Start guessing.";
        game.guessHistory = Array.isArray(data.guessHistory)
            ? data.guessHistory.filter((n) => Number.isInteger(n))
            : [];

        if (game.min >= game.max || game.target < game.min || game.target > game.max) {
            return new GuessingGame();
        }

        return game;
    }

    render(container, storageMessage) {
        const last = this.lastGuess === null ? "None" : String(this.lastGuess);
        const history = this.guessHistory.length === 0 ? "None yet" : this.guessHistory.join(", ");
        container.innerHTML = `
            <div><strong>Title:</strong> ${this.title}</div>
            <div><strong>Total guesses:</strong> ${this.totalGuesses}</div>
            <div><strong>Wrong guesses:</strong> ${this.wrongGuesses}/${this.maxWrong}</div>
            <div><strong>Most recent guess:</strong> ${last}</div>
            <div><strong>Feedback:</strong> ${this.lastFeedback}</div>
            <div><strong>Guess history:</strong> ${history}</div>
            <div><strong>Storage:</strong> ${storageMessage}</div>
        `;
    }
}

function loadGame() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { game: new GuessingGame(), status: "No saved game found. New game started." };
        }
        return { game: GuessingGame.fromJSON(JSON.parse(raw)), status: "Saved game loaded from localStorage." };
    } catch (error) {
        return { game: new GuessingGame(), status: "Saved game could not be loaded. New game started." };
    }
}

function saveGame(game) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(game.toJSON()));
        return "Game saved.";
    } catch (error) {
        return "Game could not be saved.";
    }
}

window.addEventListener("load", function () {
    const form = document.getElementById("guessForm");
    const input = document.getElementById("guessInput");
    const message = document.getElementById("message");
    const state = document.getElementById("state");

    const loaded = loadGame();
    let game = loaded.game;
    let storageStatus = `${loaded.status} ${saveGame(game)}`;
    game.render(state, storageStatus);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const result = game.guess(input.value);

        if (result === "correct") {
            message.textContent = `Correct. The number was ${game.target}. Starting a new game.`;
            game = new GuessingGame();
        } else if (result === "game-over") {
            message.textContent = `Game over after ${game.maxWrong} incorrect guesses. The number was ${game.target}. Starting a new game.`;
            game = new GuessingGame();
        } else {
            message.textContent = game.lastFeedback;
        }

        storageStatus = saveGame(game);
        game.render(state, storageStatus);
        input.value = "";
        input.focus();
    });
});
