/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Manages Whiplash shop upgrades, button states, and the prestige reset for upgrade data.
*/

window.addEventListener("load", function () {
    if (!window.clicker) {
        return;
    }

    const state = window.clicker.state;
    const updateDisplay = window.clicker.updateDisplay;
    const setAutoTimer = window.clicker.setAutoTimer;

    const clickUpgradeKeys = ["drumsticks", "snareDrum", "bassDrum", "hiHat", "crashCymbal"];

    const upgradeDefaults = {
        drumsticks: { cost: 15, growth: 1.55, gain: 1, name: "Drumsticks" },
        snareDrum: { cost: 70, growth: 1.65, gain: 3, name: "Snare Drum" },
        bassDrum: { cost: 220, growth: 1.75, gain: 8, name: "Bass Drum" },
        hiHat: { cost: 900, growth: 1.85, gain: 20, name: "Hi Hat" },
        crashCymbal: { cost: 3200, growth: 1.95, gain: 55, name: "Crash Cymbal" },
        metronome: { cost: 400, growth: 3.1, intervals: [0, 1000, 600, 350, 200] }
    };

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

    /**
     * Refreshes all UI that depends on a successful upgrade purchase.
     *
     * @returns {void} No value is returned.
     */
    function refreshAfterPurchase() {
        updateDisplay();
        updateShopDisplay();

        if (window.clicker.checkRewards) {
            window.clicker.checkRewards();
        }
    }

    /**
     * Updates the shop labels, owned counts, and button enabled states.
     *
     * @returns {void} No value is returned.
     */
    function updateShopDisplay() {
        clickUpgradeKeys.forEach(function (key) {
            const upgrade = upgrades[key];
            elements.counts[key].textContent = upgrade.count.toLocaleString();
            elements.labels[key].textContent = upgrade.name + " (Cost: " + Math.floor(upgrade.cost).toLocaleString() + ")";
            elements.buttons[key].disabled = state.beats < upgrade.cost;
        });

        elements.metronomeTierDisplay.textContent = upgrades.metronome.tier.toLocaleString();

        if (upgrades.metronome.tier >= upgrades.metronome.intervals.length - 1) {
            elements.labels.metronome.textContent = "Metronome - Maxed";
            elements.buttons.metronome.disabled = true;
            return;
        }

        if (upgrades.metronome.tier === 0) {
            elements.labels.metronome.textContent = "Metronome - Start Auto Clicks (Cost: "
                + Math.floor(upgrades.metronome.cost).toLocaleString() + ")";
        } else {
            elements.labels.metronome.textContent = "Metronome - Speed Up Auto (Cost: "
                + Math.floor(upgrades.metronome.cost).toLocaleString() + ")";
        }

        elements.buttons.metronome.disabled = state.beats < upgrades.metronome.cost;
    }

    /**
     * Purchases one click-value upgrade when the player has enough beats.
     *
     * @param {string} key The key name of the selected upgrade.
     * @returns {void} No value is returned.
     */
    function buyClickUpgrade(key) {
        const upgrade = upgrades[key];

        if (state.beats < upgrade.cost) {
            return;
        }

        state.beats -= upgrade.cost;
        state.clickValue += upgrade.gain;
        state.totalUpgradesPurchased += 1;
        state.sessionUpgradesPurchased += 1;
        upgrade.count += 1;
        upgrade.cost = Math.ceil(upgrade.cost * upgrade.growth);

        refreshAfterPurchase();
    }

    /**
     * Purchases the next metronome tier and adjusts the auto-click timer.
     *
     * @returns {void} No value is returned.
     */
    function buyMetronome() {
        if (
            state.beats < upgrades.metronome.cost
            || upgrades.metronome.tier >= upgrades.metronome.intervals.length - 1
        ) {
            return;
        }

        state.beats -= upgrades.metronome.cost;
        state.totalUpgradesPurchased += 1;
        state.sessionUpgradesPurchased += 1;
        upgrades.metronome.tier += 1;
        upgrades.metronome.cost = Math.ceil(upgrades.metronome.cost * upgrades.metronome.growth);
        setAutoTimer(upgrades.metronome.intervals[upgrades.metronome.tier]);

        refreshAfterPurchase();
    }

    /**
     * Populates the help panel with the list of available upgrades.
     *
     * @returns {void} No value is returned.
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

    /**
     * Resets all upgrade counts and metronome state after a prestige.
     *
     * @returns {void} No value is returned.
     */
    function resetShopState() {
        clickUpgradeKeys.forEach(function (key) {
            upgrades[key].count = 0;
            upgrades[key].cost = upgradeDefaults[key].cost;
        });

        upgrades.metronome.tier = 0;
        upgrades.metronome.cost = upgradeDefaults.metronome.cost;
        setAutoTimer(0);
        updateShopDisplay();
    }

    clickUpgradeKeys.forEach(function (key) {
        elements.buttons[key].addEventListener("click", function () {
            buyClickUpgrade(key);
        });
    });
    elements.buttons.metronome.addEventListener("click", buyMetronome);

    window.clicker.upgrades = upgrades;
    window.clicker.updateShopDisplay = updateShopDisplay;
    window.clicker.resetShopState = resetShopState;

    populateHelpUpgrades();
    updateShopDisplay();
});
