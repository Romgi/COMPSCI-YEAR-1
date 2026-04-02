/*
    Names: Charles Chen and Jonathan Graydon
    Date Modified: Feb 26, 2026
    File Description: Handles core state, click behavior, save/load, UI updates, mute toggle, and click sound effects.
*/

window.addEventListener("load", function () {
    const SAVE_KEY = "whiplashSaveData";
    const PRESTIGE_REQUIREMENT = 100000;

    const state = {
        beats: 0,
        maxBeatsEver: 0,
        prestigeLevel: 0,
        clickValue: 1,
        totalClicks: 0,
        totalUpgradesPurchased: 0,
        autoIntervalMs: 0,
        autoTimerId: null,
        isMuted: false
    };

    const elements = {
        clickButton: document.getElementById("clickButton"),
        helpButton: document.getElementById("helpButton"),
        muteButton: document.getElementById("muteButton"),
        prestigeButton: document.getElementById("prestigeButton"),
        helpPanel: document.getElementById("helpPanel"),
        beatsDisplay: document.getElementById("beatsDisplay"),
        clickValueDisplay: document.getElementById("clickValueDisplay"),
        autoRateDisplay: document.getElementById("autoRateDisplay"),
        upgradeCountDisplay: document.getElementById("upgradeCountDisplay"),
        prestigeDisplay: document.getElementById("prestigeDisplay"),
        resourceMeterFill: document.getElementById("resourceMeterFill"),
        meterGoalDisplay: document.getElementById("meterGoalDisplay")
    };

    const snareSounds = [
        "audio/click/snare1.mp3",
        "audio/click/snare2.mp3",
        "audio/click/snare3.mp3",
        "audio/click/snare4.mp3"
    ];
    const prestigeSoundPath = "audio/music/Prestige.mp3";
    let isPrestiging = false;

    /*
        Purpose: Reads and parses saved game data from localStorage.
        Parameters: None.
        Return Value: Object|null. Parsed save object if available, otherwise null.
    */
    function getSavedData() {
        try {
            return JSON.parse(localStorage.getItem(SAVE_KEY)) || null;
        } catch (error) {
            return null;
        }
    }

    const loadedData = getSavedData();

    if (loadedData && loadedData.core) {
        state.beats = Math.max(0, Number(loadedData.core.beats) || 0);
        state.prestigeLevel = Math.max(0, parseInt(loadedData.core.prestigeLevel, 10) || 0);
        state.maxBeatsEver = Math.max(
            state.beats,
            Math.max(0, Number(loadedData.core.maxBeatsEver) || 0)
        );
        state.clickValue = Math.max(1, parseInt(loadedData.core.clickValue, 10) || 1);
        state.totalClicks = Math.max(0, parseInt(loadedData.core.totalClicks, 10) || 0);
        state.totalUpgradesPurchased = Math.max(0, parseInt(loadedData.core.totalUpgradesPurchased, 10) || 0);
        state.isMuted = loadedData.core.isMuted === true;
    }

    /*
        Purpose: Updates the all-time maximum beats value using the current beats.
        Parameters: None.
    */
    function updateMaxBeatsEver() {
        state.maxBeatsEver = Math.max(state.maxBeatsEver, state.beats);
    }

    /*
        Purpose: Calculates auto-generated beats per second from the current auto timer interval.
        Parameters: None.
        Return Value: number (float). Beats generated per second.
    */
    function getAutoRate() {
        return state.autoIntervalMs > 0 ? 1000 / state.autoIntervalMs : 0;
    }

    /*
        Purpose: Updates all core scoreboard and UI values from the current model state.
        Parameters: None.
    */
    function updateDisplay() {
        const beatsValue = Math.floor(state.beats);
        const maxBeatsValue = Math.floor(state.maxBeatsEver);
        let meterGoal = 100;

        while (maxBeatsValue >= meterGoal * 10) {
            meterGoal *= 10;
        }

        elements.beatsDisplay.textContent = beatsValue;
        elements.clickValueDisplay.textContent = state.clickValue;
        elements.autoRateDisplay.textContent = getAutoRate().toFixed(1);
        elements.upgradeCountDisplay.textContent = state.totalUpgradesPurchased;
        elements.prestigeDisplay.textContent = state.prestigeLevel;
        elements.resourceMeterFill.style.width = ((beatsValue % meterGoal) / meterGoal * 100) + "%";
        elements.meterGoalDisplay.textContent = meterGoal.toLocaleString();
        elements.muteButton.textContent = state.isMuted ? "Mute: On" : "Mute: Off";
        elements.prestigeButton.disabled = state.beats < PRESTIGE_REQUIREMENT;
        elements.prestigeButton.textContent = "Prestige (Need " + PRESTIGE_REQUIREMENT.toLocaleString() + " beats)";
    }

    /*
        Purpose: Saves current game state (core, shop, advancements) to localStorage.
        Parameters: None.
    */
    function saveGame() {
        if (isPrestiging) {
            return;
        }

        const saveData = {
            core: {
                beats: state.beats,
                maxBeatsEver: state.maxBeatsEver,
                prestigeLevel: state.prestigeLevel,
                clickValue: state.clickValue,
                totalClicks: state.totalClicks,
                totalUpgradesPurchased: state.totalUpgradesPurchased,
                isMuted: state.isMuted
            },
            shop: null,
            rewards: null
        };

        if (window.clicker && window.clicker.upgrades) {
            const upgradeKeys = ["drumsticks", "snareDrum", "bassDrum", "hiHat", "crashCymbal"];
            const savedShopUpgrades = {};

            upgradeKeys.forEach(function (key) {
                savedShopUpgrades[key] = window.clicker.upgrades[key];
            });

            saveData.shop = {
                drumsticks: savedShopUpgrades.drumsticks,
                snareDrum: savedShopUpgrades.snareDrum,
                bassDrum: savedShopUpgrades.bassDrum,
                hiHat: savedShopUpgrades.hiHat,
                crashCymbal: savedShopUpgrades.crashCymbal,
                metronome: {
                    tier: window.clicker.upgrades.metronome.tier,
                    cost: window.clicker.upgrades.metronome.cost
                }
            };
        }

        if (window.clicker && window.clicker.rewards) {
            saveData.rewards = window.clicker.rewards;
        }

        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        } catch (error) {
            return;
        }
    }

    /*
        Purpose: Refreshes all game views that depend on core state.
        Parameters: None.
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

    /*
        Purpose: Starts or replaces the auto-click timer with a new interval.
        Parameters:
            intervalMs (number): Timer interval in milliseconds (0 or less disables timer).
    */
    function setAutoTimer(intervalMs) {
        if (state.autoTimerId !== null) {
            clearInterval(state.autoTimerId);
        }

        state.autoTimerId = null;
        state.autoIntervalMs = intervalMs;

        if (intervalMs > 0) {
            state.autoTimerId = setInterval(function () {
                state.beats += state.clickValue;
                updateMaxBeatsEver();
                refreshGame();
                saveGame();
            }, intervalMs);
        }
    }

    /*
        Purpose: Plays one random snare sound effect when the user clicks.
        Parameters: None.
    */
    function playRandomSnare() {
        if (state.isMuted) {
            return;
        }

        const snare = new Audio(snareSounds[Math.floor(Math.random() * snareSounds.length)]);
        snare.volume = 0.45;
        snare.play().catch(function () {
            return;
        });
    }

    /*
        Purpose: Handles manual click input, applies resource gain, and updates game state/UI.
        Parameters: None.
    */
    function handleClick() {
        if (window.clicker.music && window.clicker.music.ensurePlaying) {
            window.clicker.music.ensurePlaying();
        }

        playRandomSnare();
        state.totalClicks += 1;
        state.beats += state.clickValue;
        updateMaxBeatsEver();
        refreshGame();
        saveGame();
    }

    /*
        Purpose: Shows or hides the help panel.
        Parameters: None.
    */
    function toggleHelp() {
        elements.helpPanel.classList.toggle("hidden");
    }

    /*
        Purpose: Toggles global audio mute state and updates music volume.
        Parameters: None.
    */
    function toggleMute() {
        state.isMuted = !state.isMuted;
        if (window.clicker.music && window.clicker.music.setMuted) {
            window.clicker.music.setMuted(state.isMuted);
        }
        updateDisplay();
        saveGame();
    }

    /*
        Purpose: Performs a prestige reset when requirement is met, keeping prestige level and audio settings.
        Parameters: None.
    */
    function doPrestige() {
        const newPrestigeLevel = state.prestigeLevel + 1;
        const prestigeSave = {
            core: {
                beats: 0,
                maxBeatsEver: 0,
                prestigeLevel: newPrestigeLevel,
                clickValue: 1,
                totalClicks: 0,
                totalUpgradesPurchased: 0,
                isMuted: state.isMuted
            },
            shop: null,
            rewards: []
        };

        isPrestiging = true;
        if (state.autoTimerId !== null) {
            clearInterval(state.autoTimerId);
            state.autoTimerId = null;
        }

        try {
            localStorage.clear();
            localStorage.setItem(SAVE_KEY, JSON.stringify(prestigeSave));
        } catch (error) {
            isPrestiging = false;
            return;
        }

        if (state.isMuted) {
            window.location.reload();
            return;
        }

        const prestigeSound = new Audio(prestigeSoundPath);
        let didReload = false;

        function reloadNow() {
            if (didReload) {
                return;
            }
            didReload = true;
            window.location.reload();
        }

        prestigeSound.volume = 0.6;
        prestigeSound.addEventListener("ended", reloadNow);
        setTimeout(reloadNow, 2500);
        prestigeSound.play().catch(function () {
            reloadNow();
        });
    }

    /*
        Purpose: Handles prestige button clicks and checks if the player is eligible to prestige.
        Parameters: None.
    */
    function handlePrestige() {
        if (state.beats < PRESTIGE_REQUIREMENT) {
            return;
        }

        doPrestige();
    }

    elements.clickButton.addEventListener("click", handleClick);
    elements.helpButton.addEventListener("click", toggleHelp);
    elements.muteButton.addEventListener("click", toggleMute);
    elements.prestigeButton.addEventListener("click", handlePrestige);

    window.clicker = {
        state: state,
        elements: elements,
        updateDisplay: updateDisplay,
        setAutoTimer: setAutoTimer,
        saveGame: saveGame,
        loadedData: loadedData
    };

    window.addEventListener("beforeunload", saveGame);
    updateMaxBeatsEver();
    updateDisplay();
});
