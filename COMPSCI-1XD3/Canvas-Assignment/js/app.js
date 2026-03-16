/*
    Name: Jonathan Graydon
    Created: 2026-03-16
    Description: JavaScript logic for the Memory Match canvas assignment app. This file controls
    the splash canvas, memory-game state, screen updates, event handling, and localStorage history.
*/

window.addEventListener("load", () => {
    const TOTAL_ROUNDS = 10;
    const HISTORY_LIMIT = 5;

    class MemoryGame {
        /**
         * Creates a new memory game model.
         *
         * @param {number} totalRounds The number of rounds needed to win the game.
         * @returns {void}
         */
        constructor(totalRounds) {
            this.totalRounds = totalRounds;
            this.reset();
        }

        /**
         * Resets the game state back to the starting values.
         *
         * @returns {void}
         */
        reset() {
            this.round = 1;
            this.score = 0;
            this.sequence = [];
            this.inputIndex = 0;
            this.roundsCleared = 0;
            this.phase = "ready";
        }

        /**
         * Starts the current round and returns the sequence the player must repeat.
         *
         * @returns {number[]} The sequence of pad indices for the current round.
         */
        startRound() {
            while (this.sequence.length < this.round) {
                this.sequence.push(Math.floor(Math.random() * 4));
            }

            this.inputIndex = 0;
            this.phase = "showing";
            return this.sequence.slice(0, this.round);
        }

        /**
         * Changes the game phase so the player can begin entering input.
         *
         * @returns {void}
         */
        beginInput() {
            if (this.phase !== "finished") {
                this.phase = "input";
            }
        }

        /**
         * Checks one player input against the expected sequence value.
         *
         * @param {number} padId The index of the pad clicked by the player.
         * @returns {object} An object describing whether the input was correct and whether the game or round ended.
         */
        registerInput(padId) {
            if (this.phase !== "input") {
                return { accepted: false };
            }

            const expectedPad = this.sequence[this.inputIndex];
            if (padId !== expectedPad) {
                this.phase = "finished";
                return {
                    accepted: true,
                    correct: false,
                    roundComplete: false,
                    finished: true,
                    won: false
                };
            }

            this.inputIndex += 1;

            if (this.inputIndex < this.round) {
                return {
                    accepted: true,
                    correct: true,
                    roundComplete: false,
                    finished: false,
                    won: false,
                    remainingInputs: this.round - this.inputIndex
                };
            }

            this.score += 10;
            this.roundsCleared = this.round;

            if (this.round === this.totalRounds) {
                this.phase = "finished";
                return {
                    accepted: true,
                    correct: true,
                    roundComplete: true,
                    finished: true,
                    won: true
                };
            }

            this.round += 1;
            this.phase = "between-rounds";
            return {
                accepted: true,
                correct: true,
                roundComplete: true,
                finished: false,
                won: false
            };
        }

        /**
         * Calculates how much of the game has been completed.
         *
         * @returns {number} The percentage of rounds cleared as a whole number.
         */
        getProgressPercent() {
            return Math.round((this.roundsCleared / this.totalRounds) * 100);
        }
    }

    class HistoryStore {
        /**
         * Creates a storage helper for saved game history.
         *
         * @param {string} storageKey The localStorage key used to store saved runs.
         * @param {number} limit The maximum number of history entries to keep.
         * @returns {void}
         */
        constructor(storageKey, limit) {
            this.storageKey = storageKey;
            this.limit = limit;
        }

        /**
         * Loads saved game history from localStorage.
         *
         * @returns {object[]} An array of saved history entries.
         */
        load() {
            try {
                const rawValue = window.localStorage.getItem(this.storageKey);
                if (!rawValue) {
                    return [];
                }

                const parsed = JSON.parse(rawValue);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }

        /**
         * Saves a new game result and trims the saved history to the configured limit.
         *
         * @param {object} entry The result object to add to history.
         * @returns {object[]} The updated history array.
         */
        save(entry) {
            const history = this.load();
            history.unshift(entry);
            const trimmedHistory = history.slice(0, this.limit);

            try {
                window.localStorage.setItem(this.storageKey, JSON.stringify(trimmedHistory));
            } catch (error) {
                return trimmedHistory;
            }

            return trimmedHistory;
        }

        /**
         * Finds the highest score stored in game history.
         *
         * @param {object[]} history The history array to search. Defaults to the saved localStorage history.
         * @returns {number} The highest score found in the history list.
         */
        getHighScore(history = this.load()) {
            return history.reduce((bestScore, entry) => Math.max(bestScore, Number(entry.score) || 0), 0);
        }
    }

    class SplashBanner {
        /**
         * Creates a splash-screen canvas helper.
         *
         * @param {HTMLCanvasElement} canvas The canvas used for the splash drawing.
         * @returns {void}
         */
        constructor(canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.animationId = 0;
            this.startTime = 0;
        }

        /**
         * Starts the splash-screen animation loop.
         *
         * @returns {void}
         */
        start() {
            if (!this.context) {
                return;
            }

            this.startTime = performance.now();
            this.drawFrame(this.startTime);
        }

        /**
         * Stops the splash-screen animation loop.
         *
         * @returns {void}
         */
        stop() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = 0;
            }
        }

        /**
         * Draws one frame of the splash-screen animation.
         *
         * @param {number} timestamp The current animation timestamp from requestAnimationFrame.
         * @returns {void}
         */
        drawFrame(timestamp) {
            if (!this.context) {
                return;
            }

            const elapsed = timestamp - this.startTime;
            const highlightIndex = Math.floor(elapsed / 500) % 4;
            const context = this.context;

            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            context.fillStyle = "#18314f";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            context.fillStyle = "#ffffff";
            context.font = "bold 24px Arial";
            context.fillText("Memory Match", 74, 46);
            context.font = "15px Arial";
            context.fillText("Watch and repeat the order.", 72, 70);

            const circles = [
                { x: 75, y: 120, color: "#ef6b6b" },
                { x: 135, y: 120, color: "#62a8e5" },
                { x: 195, y: 120, color: "#f2cf63" },
                { x: 255, y: 120, color: "#82c97a" }
            ];

            circles.forEach((circle, index) => {
                context.beginPath();
                context.fillStyle = index === highlightIndex ? "#ffffff" : circle.color;
                context.arc(circle.x, circle.y, 18, 0, Math.PI * 2);
                context.fill();
            });

            this.animationId = requestAnimationFrame((nextTimestamp) => this.drawFrame(nextTimestamp));
        }
    }

    class GameView {
        /**
         * Creates a view helper that updates the DOM for the game.
         *
         * @param {object} elements References to the DOM elements used by the app.
         * @returns {void}
         */
        constructor(elements) {
            this.elements = elements;
        }

        /**
         * Shows one screen and hides the others.
         *
         * @param {string} screenName The screen to display: splash, game, or results.
         * @returns {void}
         */
        showScreen(screenName) {
            const screens = {
                splash: this.elements.splashScreen,
                game: this.elements.gameScreen,
                results: this.elements.resultsScreen
            };

            Object.entries(screens).forEach(([name, screen]) => {
                screen.hidden = name !== screenName;
            });
        }

        /**
         * Enables the splash-screen start button after the intro delay.
         *
         * @returns {void}
         */
        enableStartButton() {
            this.elements.startButton.disabled = false;
        }

        /**
         * Updates the score, round, best score, and progress bar shown on the page.
         *
         * @param {MemoryGame} game The current game model.
         * @param {number} bestScore The highest saved score.
         * @returns {void}
         */
        updateStats(game, bestScore) {
            const currentBest = Math.max(bestScore, game.score);
            const displayedRound = Math.min(game.round, game.totalRounds);

            this.elements.roundValue.textContent = `${displayedRound} / ${game.totalRounds}`;
            this.elements.scoreValue.textContent = String(game.score);
            this.elements.bestValue.textContent = String(currentBest);
            this.elements.progressFill.style.width = `${game.getProgressPercent()}%`;
        }

        /**
         * Displays a status message to the player.
         *
         * @param {string} message The message to display in the status area.
         * @returns {void}
         */
        setStatus(message) {
            this.elements.statusText.textContent = message;
        }

        /**
         * Shows or hides the help panel and updates the help button label.
         *
         * @param {boolean} isVisible True to show help and false to hide it.
         * @returns {void}
         */
        setHelpVisible(isVisible) {
            this.elements.helpPanel.hidden = !isVisible;
            this.elements.helpButton.textContent = isVisible ? "Hide Help" : "Help";
        }

        /**
         * Enables or disables all game-board buttons.
         *
         * @param {boolean} isEnabled True to allow input and false to block it.
         * @returns {void}
         */
        setPadsEnabled(isEnabled) {
            this.elements.padButtons.forEach((button) => {
                button.disabled = !isEnabled;
            });
        }

        /**
         * Briefly highlights one pad button.
         *
         * @param {number} padId The index of the pad to highlight.
         * @param {number} duration The number of milliseconds to keep the pad highlighted.
         * @returns {void}
         */
        flashPad(padId, duration = 300) {
            const pad = this.elements.padButtons[padId];
            if (!pad) {
                return;
            }

            pad.classList.add("is-lit");
            window.setTimeout(() => {
                pad.classList.remove("is-lit");
            }, duration);
        }

        /**
         * Removes highlight styling from all pad buttons.
         *
         * @returns {void}
         */
        resetPads() {
            this.elements.padButtons.forEach((button) => {
                button.classList.remove("is-lit");
            });
        }

        /**
         * Updates the results screen with the final outcome and saved history.
         *
         * @param {MemoryGame} game The completed game model.
         * @param {boolean} didWin True if the player won and false otherwise.
         * @param {object[]} history The saved game-history entries to render.
         * @param {number} highScore The highest score stored in history.
         * @returns {void}
         */
        renderResults(game, didWin, history, highScore) {
            this.elements.resultHeading.textContent = didWin ? "You won" : "You lost";
            this.elements.resultMessage.textContent = didWin
                ? `You completed all ${game.totalRounds} rounds.`
                : "You tapped the wrong button before the pattern was complete.";
            this.elements.resultScore.textContent = String(game.score);
            this.elements.resultRounds.textContent = `${game.roundsCleared} / ${game.totalRounds}`;
            this.elements.resultHighScore.textContent = String(highScore);

            this.elements.historyList.textContent = "";

            if (history.length === 0) {
                const emptyItem = document.createElement("li");
                emptyItem.className = "history-empty";
                emptyItem.textContent = "No saved scores yet.";
                this.elements.historyList.appendChild(emptyItem);
                return;
            }

            history.forEach((entry) => {
                const item = document.createElement("li");
                item.className = "history-item";

                const leftBlock = document.createElement("div");
                const title = document.createElement("strong");
                const date = document.createElement("span");
                title.textContent = `${entry.outcome} - ${entry.score} points`;
                date.textContent = entry.dateLabel;

                const rightBlock = document.createElement("div");
                const rounds = document.createElement("strong");
                rounds.textContent = `${entry.roundsCleared}/${entry.totalRounds} rounds`;

                leftBlock.appendChild(title);
                leftBlock.appendChild(date);
                rightBlock.appendChild(rounds);

                item.appendChild(leftBlock);
                item.appendChild(rightBlock);
                this.elements.historyList.appendChild(item);
            });
        }
    }

    class GameController {
        /**
         * Creates a controller that connects the model, view, storage, and splash canvas.
         *
         * @param {MemoryGame} game The game model object.
         * @param {GameView} view The DOM view helper.
         * @param {HistoryStore} historyStore The storage helper for recent game results.
         * @param {SplashBanner} splashBanner The splash-screen canvas helper.
         * @param {object} elements References to important DOM elements.
         * @returns {void}
         */
        constructor(game, view, historyStore, splashBanner, elements) {
            this.game = game;
            this.view = view;
            this.historyStore = historyStore;
            this.splashBanner = splashBanner;
            this.elements = elements;
            this.helpVisible = false;
            this.timeoutIds = new Set();
            this.runToken = 0;
        }

        /**
         * Starts the app by binding events, drawing the splash canvas, and enabling the start button after a delay.
         *
         * @returns {void}
         */
        init() {
            this.bindEvents();
            this.splashBanner.start();
            this.view.updateStats(this.game, this.historyStore.getHighScore());
            this.schedule(() => this.view.enableStartButton(), 1200);
        }

        /**
         * Attaches the app's event listeners to buttons on the page.
         *
         * @returns {void}
         */
        bindEvents() {
            this.elements.startButton.addEventListener("click", () => this.startGame());
            this.elements.helpButton.addEventListener("click", () => this.toggleHelp());
            this.elements.restartButton.addEventListener("click", () => this.startGame());
            this.elements.playAgainButton.addEventListener("click", () => this.startGame());

            this.elements.padButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const padId = Number(button.dataset.pad);
                    this.handlePadClick(padId);
                });
            });
        }

        /**
         * Starts a new game and switches from the splash or results screen to gameplay.
         *
         * @returns {void}
         */
        startGame() {
            this.clearScheduled();
            this.runToken += 1;
            this.splashBanner.stop();
            this.game.reset();
            this.helpVisible = false;

            this.view.showScreen("game");
            this.view.setHelpVisible(false);
            this.view.resetPads();
            this.view.setPadsEnabled(false);
            this.view.updateStats(this.game, this.historyStore.getHighScore());
            this.view.setStatus("Watch the pattern.");

            this.schedule(() => this.runRound(), 500);
        }

        /**
         * Toggles the visibility of the help panel.
         *
         * @returns {void}
         */
        toggleHelp() {
            this.helpVisible = !this.helpVisible;
            this.view.setHelpVisible(this.helpVisible);
        }

        /**
         * Plays the current round's pattern for the player.
         *
         * @returns {void}
         */
        runRound() {
            const sequence = this.game.startRound();
            const activeToken = ++this.runToken;
            let delay = 400;

            this.view.setPadsEnabled(false);
            this.view.resetPads();
            this.view.updateStats(this.game, this.historyStore.getHighScore());
            this.view.setStatus(`Round ${this.game.round}: watch the pattern.`);

            sequence.forEach((padId) => {
                this.schedule(() => {
                    if (activeToken !== this.runToken) {
                        return;
                    }

                    this.view.flashPad(padId);
                }, delay);

                delay += 550;
            });

            this.schedule(() => {
                if (activeToken !== this.runToken) {
                    return;
                }

                this.game.beginInput();
                this.view.setPadsEnabled(true);
                this.view.setStatus("Repeat the pattern.");
            }, delay);
        }

        /**
         * Processes a button click from the player during gameplay.
         *
         * @param {number} padId The index of the pad clicked by the player.
         * @returns {void}
         */
        handlePadClick(padId) {
            const result = this.game.registerInput(padId);
            if (!result.accepted) {
                return;
            }

            this.view.flashPad(padId, 180);
            this.view.updateStats(this.game, this.historyStore.getHighScore());

            if (result.correct && !result.roundComplete) {
                const plural = result.remainingInputs === 1 ? "" : "s";
                this.view.setStatus(`${result.remainingInputs} input${plural} left this round.`);
                return;
            }

            this.view.setPadsEnabled(false);

            if (!result.correct) {
                this.view.setStatus("Wrong button.");
                this.schedule(() => this.finishGame(false), 700);
                return;
            }

            if (result.finished) {
                this.view.setStatus("All rounds complete.");
                this.schedule(() => this.finishGame(true), 700);
                return;
            }

            this.view.setStatus("Correct. Next round starting.");
            this.schedule(() => this.runRound(), 850);
        }

        /**
         * Ends the game, saves the result, and shows the results screen.
         *
         * @param {boolean} didWin True if the player won and false if the player lost.
         * @returns {void}
         */
        finishGame(didWin) {
            this.clearScheduled();
            this.runToken += 1;

            const entry = this.buildHistoryEntry(didWin);
            const history = this.historyStore.save(entry);
            const highScore = this.historyStore.getHighScore(history);

            this.view.renderResults(this.game, didWin, history, highScore);
            this.view.showScreen("results");
        }

        /**
         * Builds one saved-history entry for the finished game.
         *
         * @param {boolean} didWin True if the player won and false if the player lost.
         * @returns {object} A history object containing the score, rounds cleared, and date.
         */
        buildHistoryEntry(didWin) {
            const dateLabel = new Intl.DateTimeFormat(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }).format(new Date());

            return {
                score: this.game.score,
                roundsCleared: this.game.roundsCleared,
                totalRounds: this.game.totalRounds,
                outcome: didWin ? "Win" : "Loss",
                dateLabel
            };
        }

        /**
         * Schedules a delayed callback and tracks it so it can be cancelled later.
         *
         * @param {Function} callback The function to run after the delay.
         * @param {number} delay The delay in milliseconds.
         * @returns {void}
         */
        schedule(callback, delay) {
            const timeoutId = window.setTimeout(() => {
                this.timeoutIds.delete(timeoutId);
                callback();
            }, delay);

            this.timeoutIds.add(timeoutId);
        }

        /**
         * Clears all scheduled timeouts used by the controller.
         *
         * @returns {void}
         */
        clearScheduled() {
            this.timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
            this.timeoutIds.clear();
        }
    }

    const elements = {
        splashScreen: document.getElementById("splash-screen"),
        gameScreen: document.getElementById("game-screen"),
        resultsScreen: document.getElementById("results-screen"),
        startButton: document.getElementById("splash-start"),
        helpButton: document.getElementById("help-button"),
        restartButton: document.getElementById("restart-button"),
        playAgainButton: document.getElementById("play-again-button"),
        helpPanel: document.getElementById("help-panel"),
        statusText: document.getElementById("status-text"),
        progressFill: document.getElementById("progress-fill"),
        roundValue: document.getElementById("round-value"),
        scoreValue: document.getElementById("score-value"),
        bestValue: document.getElementById("best-value"),
        resultHeading: document.getElementById("result-heading"),
        resultMessage: document.getElementById("result-message"),
        resultScore: document.getElementById("result-score"),
        resultRounds: document.getElementById("result-rounds"),
        resultHighScore: document.getElementById("result-high-score"),
        historyList: document.getElementById("history-list"),
        padButtons: Array.from(document.querySelectorAll(".memory-pad")),
        splashCanvas: document.getElementById("splash-canvas")
    };

    const game = new MemoryGame(TOTAL_ROUNDS);
    const view = new GameView(elements);
    const historyStore = new HistoryStore("memory-match-history", HISTORY_LIMIT);
    const splashBanner = new SplashBanner(elements.splashCanvas);
    const controller = new GameController(game, view, historyStore, splashBanner, elements);

    controller.init();
});
