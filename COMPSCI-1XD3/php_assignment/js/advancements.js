/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Tracks Whiplash advancements, displays unlock messages, and reports the session achievement count for leaderboard submission.
*/

window.addEventListener("load", function () {
    if (!window.clicker) {
        return;
    }

    const state = window.clicker.state;
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
        { name: "Sidewalk Serenade", description: "Reach 100 total beats.", unlocked: false, check: function () { return state.peakBeats >= 100; } },
        { name: "Bar Gig", description: "Reach 1,000 total beats.", unlocked: false, check: function () { return state.peakBeats >= 1000; } },
        { name: "Theater Debut", description: "Reach 10,000 total beats.", unlocked: false, check: function () { return state.peakBeats >= 10000; } },
        { name: "TV Performance", description: "Reach 100,000 total beats.", unlocked: false, check: function () { return state.peakBeats >= 100000; } },
        { name: "International Tour", description: "Reach 1,000,000 total beats.", unlocked: false, check: function () { return state.peakBeats >= 1000000; } },
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
            name: "Polyrhythm",
            description: "Upgrade the metronome to tier 4.",
            unlocked: false,
            check: function () {
                return window.clicker.upgrades && window.clicker.upgrades.metronome.tier >= 4;
            }
        }
    ];

    /**
     * Renders the unlocked advancement badges and prestige badges in the sidebar.
     *
     * @returns {void} No value is returned.
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

    /**
     * Displays a temporary advancement message to the player.
     *
     * @param {string} rewardName The name of the newly unlocked advancement.
     * @returns {void} No value is returned.
     */
    function showRewardMessage(rewardName) {
        rewardMessage.textContent = "Congratulations! Advancement unlocked: " + rewardName;
        rewardMessage.classList.remove("hidden");

        clearTimeout(messageTimerId);
        messageTimerId = setTimeout(function () {
            rewardMessage.classList.add("hidden");
        }, 3000);
    }

    /**
     * Checks all advancement conditions and unlocks any newly satisfied rewards.
     *
     * @returns {void} No value is returned.
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

        if (unlockedAny) {
            renderRewardBadges();

            if (window.clicker.updateDisplay) {
                window.clicker.updateDisplay();
            }
        }
    }

    /**
     * Counts the unlocked achievements for the current session, including prestige badges.
     *
     * @returns {number} The total number of unlocked session badges.
     */
    function getRewardCount() {
        const unlockedRewardCount = rewards.filter(function (reward) {
            return reward.unlocked;
        }).length;

        return unlockedRewardCount + state.prestigeLevel;
    }

    /**
     * Populates the help panel with the reward names and descriptions.
     *
     * @returns {void} No value is returned.
     */
    function populateHelpRewards() {
        helpRewardList.innerHTML = rewards
            .map(function (reward) {
                return "<li><strong>" + reward.name + "</strong>: " + reward.description + "</li>";
            })
            .join("")
            + "<li><strong>Prestige Badge</strong>: Earn one badge each time you prestige.</li>";
    }

    window.clicker.checkRewards = checkRewards;
    window.clicker.getRewardCount = getRewardCount;

    populateHelpRewards();
    renderRewardBadges();
});
