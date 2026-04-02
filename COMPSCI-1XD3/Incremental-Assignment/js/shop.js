/*
    Names: Charles Chen and Jonathan Graydon
    Date Modified: Feb 26, 2026
    File Description: Handles upgrade purchasing, shop UI updates, and restoring upgrade state from save data.
*/

window.addEventListener("load", function () {
    if (!window.clicker) {
        return;
    }

    const state = window.clicker.state;
    const updateDisplay = window.clicker.updateDisplay;
    const setAutoTimer = window.clicker.setAutoTimer;
    const saveGame = window.clicker.saveGame;
    const loadedData = window.clicker.loadedData;

    const clickUpgradeKeys = ["drumsticks", "snareDrum", "bassDrum", "hiHat", "crashCymbal"];

    const upgrades = {
        drumsticks: { count: 0, cost: 15, growth: 1.55, gain: 1, name: "Drumsticks" },
        snareDrum: { count: 0, cost: 70, growth: 1.65, gain: 3, name: "Snare Drum" },
        bassDrum: { count: 0, cost: 220, growth: 1.75, gain: 8, name: "Bass Drum" },
        hiHat: { count: 0, cost: 900, growth: 1.85, gain: 20, name: "Hi Hat" },
        crashCymbal: { count: 0, cost: 3200, growth: 1.95, gain: 55, name: "Crash Cymbal" },
        metronome: { tier: 0, cost: 400, growth: 3.1, intervals: [0, 1000, 600, 350, 200] }
    };

    const elements = {
        buttons: {
            drumsticks: document.getElementById("drumsticksBtn"),
            snareDrum: document.getElementById("snareDrumBtn"),
            bassDrum: document.getElementById("bassDrumBtn"),
            hiHat: document.getElementById("hiHatBtn"),
            crashCymbal: document.getElementById("crashCymbalBtn"),
            metronome: document.getElementById("metronomeBtn")
        },
        labels: {
            drumsticks: document.getElementById("drumsticksLabel"),
            snareDrum: document.getElementById("snareDrumLabel"),
            bassDrum: document.getElementById("bassDrumLabel"),
            hiHat: document.getElementById("hiHatLabel"),
            crashCymbal: document.getElementById("crashCymbalLabel"),
            metronome: document.getElementById("metronomeLabel")
        },
        counts: {
            drumsticks: document.getElementById("drumsticksCount"),
            snareDrum: document.getElementById("snareDrumCount"),
            bassDrum: document.getElementById("bassDrumCount"),
            hiHat: document.getElementById("hiHatCount"),
            crashCymbal: document.getElementById("crashCymbalCount")
        },
        metronomeTierDisplay: document.getElementById("metronomeTierDisplay"),
        helpUpgradeList: document.getElementById("helpUpgradeList")
    };

    /*
        Purpose: Runs common update tasks after any successful upgrade purchase.
        Parameters: None.
    */
    function refreshAfterPurchase() {
        updateDisplay();
        updateShopDisplay();
        if (window.clicker.checkRewards) {
            window.clicker.checkRewards();
        }
        saveGame();
    }

    /*
        Purpose: Loads saved upgrade values and restores metronome auto timer state.
        Parameters: None.
    */
    function restoreShopFromSave() {
        if (!loadedData || !loadedData.shop) {
            return;
        }

        clickUpgradeKeys.forEach(function (key) {
            const saved = loadedData.shop[key];
            if (!saved) {
                return;
            }

            upgrades[key].count = Math.max(0, parseInt(saved.count, 10) || 0);
            upgrades[key].cost = Math.max(1, Number(saved.cost) || upgrades[key].cost);
        });

        if (!loadedData.shop.metronome) {
            return;
        }

        const maxTier = upgrades.metronome.intervals.length - 1;
        upgrades.metronome.tier = Math.min(maxTier, Math.max(0, parseInt(loadedData.shop.metronome.tier, 10) || 0));
        upgrades.metronome.cost = Math.max(1, Number(loadedData.shop.metronome.cost) || upgrades.metronome.cost);

        if (upgrades.metronome.tier > 0) {
            setAutoTimer(upgrades.metronome.intervals[upgrades.metronome.tier]);
        }
    }

    /*
        Purpose: Updates all shop button labels, counts, and enabled/disabled states.
        Parameters: None.
    */
    function updateShopDisplay() {
        clickUpgradeKeys.forEach(function (key) {
            const upgrade = upgrades[key];
            elements.counts[key].textContent = upgrade.count;
            elements.labels[key].textContent = upgrade.name + " (Cost: " + Math.floor(upgrade.cost) + ")";
            elements.buttons[key].disabled = state.beats < upgrade.cost;
        });

        elements.metronomeTierDisplay.textContent = upgrades.metronome.tier;

        if (upgrades.metronome.tier >= upgrades.metronome.intervals.length - 1) {
            elements.labels.metronome.textContent = "Metronome - Maxed";
            elements.buttons.metronome.disabled = true;
            return;
        }

        if (upgrades.metronome.tier === 0) {
            elements.labels.metronome.textContent = "Metronome - Start Auto Clicks (Cost: "
                + Math.floor(upgrades.metronome.cost) + ")";
        } else {
            elements.labels.metronome.textContent = "Metronome - Speed Up Auto (Cost: "
                + Math.floor(upgrades.metronome.cost) + ")";
        }

        elements.buttons.metronome.disabled = state.beats < upgrades.metronome.cost;
    }

    /*
        Purpose: Purchases one click-value upgrade by key.
        Parameters:
            key (string): Upgrade key name for any click-value upgrade.
    */
    function buyClickUpgrade(key) {
        const upgrade = upgrades[key];

        if (state.beats < upgrade.cost) {
            return;
        }

        state.beats -= upgrade.cost;
        state.clickValue += upgrade.gain;
        state.totalUpgradesPurchased += 1;
        upgrade.count += 1;
        upgrade.cost = Math.ceil(upgrade.cost * upgrade.growth);

        refreshAfterPurchase();
    }

    /*
        Purpose: Purchases metronome tier upgrades and updates auto-click speed.
        Parameters: None.
    */
    function buyMetronome() {
        if (state.beats < upgrades.metronome.cost
            || upgrades.metronome.tier >= upgrades.metronome.intervals.length - 1) {
            return;
        }

        state.beats -= upgrades.metronome.cost;
        state.totalUpgradesPurchased += 1;
        upgrades.metronome.tier += 1;
        upgrades.metronome.cost = Math.ceil(upgrades.metronome.cost * upgrades.metronome.growth);
        setAutoTimer(upgrades.metronome.intervals[upgrades.metronome.tier]);

        refreshAfterPurchase();
    }

    /*
        Purpose: Populates the help panel with a static list of all available upgrades.
        Parameters: None.
    */
    function populateHelpUpgrades() {
        elements.helpUpgradeList.innerHTML =
            "<li><strong>Drumsticks</strong>: Increase click value by +1.</li>"
            + "<li><strong>Snare Drum</strong>: Increase click value by +3.</li>"
            + "<li><strong>Bass Drum</strong>: Increase click value by +8.</li>"
            + "<li><strong>Hi Hat</strong>: Increase click value by +20.</li>"
            + "<li><strong>Crash Cymbal</strong>: Increase click value by +55.</li>"
            + "<li><strong>Metronome</strong>: Starts auto clicks, then speeds them up.</li>";
    }

    clickUpgradeKeys.forEach(function (key) {
        elements.buttons[key].addEventListener("click", function () {
            buyClickUpgrade(key);
        });
    });
    elements.buttons.metronome.addEventListener("click", buyMetronome);

    window.clicker.upgrades = upgrades;
    window.clicker.updateShopDisplay = updateShopDisplay;

    restoreShopFromSave();
    populateHelpUpgrades();
    updateShopDisplay();
    saveGame();
});
