/*
    Names: Charles Chen and Jonathan Graydon
    Date Modified: Feb 26, 2026
    File Description: Tracks advancements, shows advancement messages, renders badges, and persists advancement unlock state.
*/

window.addEventListener("load", function () {
    if (!window.clicker) {
        return;
    }

    const state = window.clicker.state;
    const loadedData = window.clicker.loadedData;
    const saveGame = window.clicker.saveGame;
    const helpRewardList = document.getElementById("helpRewardList");
    const rewardList = document.getElementById("rewardList");
    const rewardMessage = document.getElementById("rewardMessage");

    let messageTimerId = null;

    const rewards = [
        { name: "5, 6, and", description: "Reach click value 5.", unlocked: false, check: function () { return state.clickValue >= 5; } },
        { name: "Slightly Rushing", description: "Reach click value 12.", unlocked: false, check: function () { return state.clickValue >= 12; } },
        { name: "Slightly Dragging", description: "Reach click value 30.", unlocked: false, check: function () { return state.clickValue >= 30; } },
        { name: "On My Time", description: "Reach click value 75.", unlocked: false, check: function () { return state.clickValue >= 75; } },
        { name: "Locked In", description: "Reach click value 150.", unlocked: false, check: function () { return state.clickValue >= 150; } },

        { name: "Sidewalk Serenade", description: "Reach 100 total beats.", unlocked: false, check: function () { return state.beats >= 100; } },
        { name: "Bar Gig", description: "Reach 1,000 total beats.", unlocked: false, check: function () { return state.beats >= 1000; } },
        { name: "Theater Debut", description: "Reach 10,000 total beats.", unlocked: false, check: function () { return state.beats >= 10000; } },
        { name: "TV Performance", description: "Reach 100,000 total beats.", unlocked: false, check: function () { return state.beats >= 100000; } },
        { name: "International Tour", description: "Reach 1,000,000 total beats.", unlocked: false, check: function () { return state.beats >= 1000000; } },
        { name: "Global Sensation", description: "Reach 10,000,000 total beats.", unlocked: false, check: function () { return state.beats >= 10000000; } },
        { name: "Historic Performance", description: "Reach 100,000,000 total beats.", unlocked: false, check: function () { return state.beats >= 100000000; } },

        {
            name: "Start Counting",
            description: "Upgrade the metronome to tier 1.",
            unlocked: false,
            check: function () {
                return window.clicker.upgrades && window.clicker.upgrades.metronome.tier >= 1;
            }
        },
        {
            name: "Double Time Swing",
            description: "Upgrade the metronome to tier 2.",
            unlocked: false,
            check: function () {
                return window.clicker.upgrades && window.clicker.upgrades.metronome.tier >= 2;
            }
        },
        {
            name: "Triple Time",
            description: "Upgrade the metronome to tier 3.",
            unlocked: false,
            check: function () {
                return window.clicker.upgrades && window.clicker.upgrades.metronome.tier >= 3;
            }
        },
        {
            name: "Polyrhytm",
            description: "Upgrade the metronome to tier 4.",
            unlocked: false,
            check: function () {
                return window.clicker.upgrades && window.clicker.upgrades.metronome.tier >= 4;
            }
        }
    ];

    /*
        Purpose: Copies current advancement unlock states to the global save object.
        Parameters: None.
    */
    function syncRewardsForSave() {
        window.clicker.rewards = rewards.map(function (reward) {
            return { name: reward.name, unlocked: reward.unlocked };
        });
    }

    /*
        Purpose: Restores unlocked advancements from previously saved data.
        Parameters: None.
    */
    function restoreRewardsFromSave() {
        const unlockedNames = new Set();

        if (!loadedData || !Array.isArray(loadedData.rewards)) {
            return;
        }

        loadedData.rewards.forEach(function (savedReward) {
            if (savedReward.unlocked) {
                unlockedNames.add(savedReward.name);
            }
        });

        rewards.forEach(function (reward) {
            reward.unlocked = unlockedNames.has(reward.name);
        });
    }

    /*
        Purpose: Renders unlocked advancements as badge elements in the advancements area.
        Parameters: None.
    */
    function renderRewardBadges() {
        const regularBadges = rewards
            .filter(function (reward) { return reward.unlocked; })
            .map(function (reward) { return "<span class='reward-badge'>" + reward.name + "</span>"; })
            .join("");

        let prestigeBadges = "";
        for (let level = 1; level <= state.prestigeLevel; level += 1) {
            prestigeBadges += "<span class='reward-badge prestige-badge'>Prestige " + level + "</span>";
        }

        rewardList.innerHTML = regularBadges + prestigeBadges;
    }

    /*
        Purpose: Displays a temporary congratulation message for a newly unlocked advancement.
        Parameters:
            name (string): The advancement name to show in the message.
    */
    function showRewardMessage(name) {
        rewardMessage.textContent = "Congratulations! Advancement unlocked: " + name;
        rewardMessage.classList.remove("hidden");

        clearTimeout(messageTimerId);
        messageTimerId = setTimeout(function () {
            rewardMessage.classList.add("hidden");
        }, 3000);
    }

    /*
        Purpose: Checks all advancement conditions, unlocks newly met ones, and updates UI/save state.
        Parameters: None.
    */
    function checkRewards() {
        let unlockedAny = false;

        rewards.forEach(function (reward) {
            if (!reward.unlocked && reward.check()) {
                reward.unlocked = true;
                showRewardMessage(reward.name);
                unlockedAny = true;
            }
        });

        syncRewardsForSave();
        renderRewardBadges();

        if (unlockedAny) {
            saveGame();
        }
    }

    /*
        Purpose: Populates the help panel with a list of all advancements and descriptions.
        Parameters: None.
    */
    function populateHelpRewards() {
        helpRewardList.innerHTML = rewards
            .map(function (reward) {
                return "<li><strong>" + reward.name + "</strong>: " + reward.description + "</li>";
            })
            .join("")
            + "<li><strong>Prestige Badge</strong>: Earn one gold advancement each time you prestige.</li>";
    }

    restoreRewardsFromSave();
    syncRewardsForSave();
    window.clicker.checkRewards = checkRewards;

    populateHelpRewards();
    renderRewardBadges();
    saveGame();
});
