/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Handles the Whiplash game state, clicks, prestige flow, timer updates, and hidden leaderboard submission fields.
*/

window.addEventListener("load", function () {
    const PRESTIGE_REQUIREMENT = 100000;

    const state = {
        beats: 0,
        peakBeats: 0,
        lifetimeBeats: 0,
        prestigeLevel: 0,
        clickValue: 1,
        totalClicks: 0,
        totalUpgradesPurchased: 0,
        sessionUpgradesPurchased: 0,
        autoIntervalMs: 0,
        autoTimerId: null,
        isMuted: false,
        sessionStartTime: Date.now(),
        clockTimerId: null
    };

    const elements = {
        clickButton: document.getElementById("clickButton"),
        helpButton: document.getElementById("helpButton"),
        muteButton: document.getElementById("muteButton"),
        prestigeButton: document.getElementById("prestigeButton"),
        helpPanel: document.getElementById("helpPanel"),
        beatsDisplay: document.getElementById("beatsDisplay"),
        runTotalDisplay: document.getElementById("runTotalDisplay"),
        clickValueDisplay: document.getElementById("clickValueDisplay"),
        autoRateDisplay: document.getElementById("autoRateDisplay"),
        upgradeCountDisplay: document.getElementById("upgradeCountDisplay"),
        prestigeDisplay: document.getElementById("prestigeDisplay"),
        sessionTimeDisplay: document.getElementById("sessionTimeDisplay"),
        resourceMeterFill: document.getElementById("resourceMeterFill"),
        meterGoalDisplay: document.getElementById("meterGoalDisplay"),
        quitForm: document.getElementById("quitForm"),
        finalBeatsInput: document.getElementById("finalBeatsInput"),
        lifetimeBeatsInput: document.getElementById("lifetimeBeatsInput"),
        totalClicksInput: document.getElementById("totalClicksInput"),
        totalUpgradesInput: document.getElementById("totalUpgradesInput"),
        prestigeLevelInput: document.getElementById("prestigeLevelInput"),
        achievementCountInput: document.getElementById("achievementCountInput"),
        sessionSecondsInput: document.getElementById("sessionSecondsInput")
    };

    const snareSounds = [
        "audio/click/snare1.mp3",
        "audio/click/snare2.mp3",
        "audio/click/snare3.mp3",
        "audio/click/snare4.mp3"
    ];
    const prestigeSoundPath = "audio/music/Prestige.mp3";

    /**
     * Adds beats to the current run and updates peak plus lifetime totals.
     *
     * @param {number} beatAmount The amount of beats that should be added.
     * @returns {void} No value is returned.
     */
    function addBeats(beatAmount) {
        state.beats += beatAmount;
        state.lifetimeBeats += beatAmount;
        state.peakBeats = Math.max(state.peakBeats, state.beats);
    }

    /**
     * Calculates the current auto-generated beats per second value.
     *
     * @returns {number} The current auto rate in beats per second.
     */
    function getAutoRate() {
        return state.autoIntervalMs > 0 ? 1000 / state.autoIntervalMs : 0;
    }

    /**
     * Calculates how long the current session has been running in seconds.
     *
     * @returns {number} The elapsed session length in whole seconds.
     */
    function getSessionSeconds() {
        return Math.max(0, Math.floor((Date.now() - state.sessionStartTime) / 1000));
    }

    /**
     * Formats a duration in seconds for the run timer display.
     *
     * @param {number} totalSeconds The duration in whole seconds.
     * @returns {string} The formatted timer string.
     */
    function formatSessionTime(totalSeconds) {
        const safeSeconds = Math.max(0, totalSeconds);
        const hours = Math.floor(safeSeconds / 3600);
        const minutes = Math.floor((safeSeconds % 3600) / 60);
        const seconds = safeSeconds % 60;

        if (hours > 0) {
            return hours + "h " + String(minutes).padStart(2, "0") + "m " + String(seconds).padStart(2, "0") + "s";
        }

        if (minutes > 0) {
            return minutes + "m " + String(seconds).padStart(2, "0") + "s";
        }

        return seconds + "s";
    }

    /**
     * Copies the current session values into the hidden inputs used by leaderboard.php.
     *
     * @returns {void} No value is returned.
     */
    function updateSubmissionFields() {
        const achievementCount = window.clicker.getRewardCount ? window.clicker.getRewardCount() : 0;

        elements.finalBeatsInput.value = String(Math.floor(state.beats));
        elements.lifetimeBeatsInput.value = String(Math.floor(state.lifetimeBeats));
        elements.totalClicksInput.value = String(state.totalClicks);
        elements.totalUpgradesInput.value = String(state.sessionUpgradesPurchased);
        elements.prestigeLevelInput.value = String(state.prestigeLevel);
        elements.achievementCountInput.value = String(achievementCount);
        elements.sessionSecondsInput.value = String(getSessionSeconds());
    }

    /**
     * Updates the visible scoreboard and progress meter from the current game state.
     *
     * @returns {void} No value is returned.
     */
    function updateDisplay() {
        const beatsValue = Math.floor(state.beats);
        const peakValue = Math.floor(state.peakBeats);
        let meterGoal = 100;

        while (peakValue >= meterGoal * 10) {
            meterGoal *= 10;
        }

        elements.beatsDisplay.textContent = beatsValue.toLocaleString();
        elements.runTotalDisplay.textContent = Math.floor(state.lifetimeBeats).toLocaleString();
        elements.clickValueDisplay.textContent = state.clickValue.toLocaleString();
        elements.autoRateDisplay.textContent = getAutoRate().toFixed(1);
        elements.upgradeCountDisplay.textContent = state.totalUpgradesPurchased.toLocaleString();
        elements.prestigeDisplay.textContent = state.prestigeLevel.toLocaleString();
        elements.sessionTimeDisplay.textContent = formatSessionTime(getSessionSeconds());
        elements.resourceMeterFill.style.width = ((beatsValue % meterGoal) / meterGoal * 100) + "%";
        elements.meterGoalDisplay.textContent = meterGoal.toLocaleString();
        elements.muteButton.textContent = state.isMuted ? "Mute: On" : "Mute: Off";
        elements.prestigeButton.disabled = state.beats < PRESTIGE_REQUIREMENT;
        elements.prestigeButton.textContent = "Prestige (Need " + PRESTIGE_REQUIREMENT.toLocaleString() + " beats)";

        updateSubmissionFields();
    }

    /**
     * Refreshes the main game display together with any dependent shop or reward UI.
     *
     * @returns {void} No value is returned.
     */
    function refreshGame() {
        updateDisplay();

        if (window.clicker.checkRewards) {
            window.clicker.checkRewards();
        }

        if (window.clicker.updateShopDisplay) {
            window.clicker.updateShopDisplay();
        }
    }

    /**
     * Starts or replaces the auto-click timer for the metronome upgrade.
     *
     * @param {number} intervalMs The interval in milliseconds between auto clicks.
     * @returns {void} No value is returned.
     */
    function setAutoTimer(intervalMs) {
        if (state.autoTimerId !== null) {
            clearInterval(state.autoTimerId);
        }

        state.autoTimerId = null;
        state.autoIntervalMs = intervalMs;

        if (intervalMs > 0) {
            state.autoTimerId = setInterval(function () {
                addBeats(state.clickValue);
                refreshGame();
            }, intervalMs);
        }
    }

    /**
     * Plays one random snare sample when the drum is clicked.
     *
     * @returns {void} No value is returned.
     */
    function playRandomSnare() {
        if (state.isMuted) {
            return;
        }

        const snareSound = new Audio(snareSounds[Math.floor(Math.random() * snareSounds.length)]);
        snareSound.volume = 0.45;
        snareSound.play().catch(function () {
            return;
        });
    }

    /**
     * Handles one manual click on the drum button.
     *
     * @returns {void} No value is returned.
     */
    function handleClick() {
        if (window.clicker.music && window.clicker.music.ensurePlaying) {
            window.clicker.music.ensurePlaying();
        }

        playRandomSnare();
        state.totalClicks += 1;
        addBeats(state.clickValue);
        refreshGame();
    }

    /**
     * Shows or hides the help panel.
     *
     * @returns {void} No value is returned.
     */
    function toggleHelp() {
        elements.helpPanel.classList.toggle("hidden");
    }

    /**
     * Toggles the muted audio state for sound effects and music.
     *
     * @returns {void} No value is returned.
     */
    function toggleMute() {
        state.isMuted = !state.isMuted;

        if (window.clicker.music && window.clicker.music.setMuted) {
            window.clicker.music.setMuted(state.isMuted);
        }

        updateDisplay();
    }

    /**
     * Performs the prestige reset while preserving session totals and prestige count.
     *
     * @returns {void} No value is returned.
     */
    function doPrestige() {
        state.prestigeLevel += 1;
        state.beats = 0;
        state.clickValue = 1;
        state.totalUpgradesPurchased = 0;

        if (window.clicker.resetShopState) {
            window.clicker.resetShopState();
        } else {
            setAutoTimer(0);
        }

        refreshGame();

        if (state.isMuted) {
            return;
        }

        const prestigeSound = new Audio(prestigeSoundPath);
        prestigeSound.volume = 0.6;
        prestigeSound.play().catch(function () {
            return;
        });
    }

    /**
     * Validates the prestige requirement before resetting the run state.
     *
     * @returns {void} No value is returned.
     */
    function handlePrestige() {
        if (state.beats < PRESTIGE_REQUIREMENT) {
            return;
        }

        doPrestige();
    }

    /**
     * Starts the visible session timer that updates once per second.
     *
     * @returns {void} No value is returned.
     */
    function startClock() {
        state.clockTimerId = setInterval(function () {
            updateDisplay();
        }, 1000);
    }

    /**
     * Finalizes the hidden form values immediately before the run is submitted.
     *
     * @returns {void} No value is returned.
     */
    function handleQuitSubmit() {
        updateSubmissionFields();
    }

    elements.clickButton.addEventListener("click", handleClick);
    elements.helpButton.addEventListener("click", toggleHelp);
    elements.muteButton.addEventListener("click", toggleMute);
    elements.prestigeButton.addEventListener("click", handlePrestige);
    elements.quitForm.addEventListener("submit", handleQuitSubmit);

    window.clicker = {
        state: state,
        elements: elements,
        updateDisplay: updateDisplay,
        setAutoTimer: setAutoTimer
    };

    startClock();
    updateDisplay();
});
