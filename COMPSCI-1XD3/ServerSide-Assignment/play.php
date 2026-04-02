<?php
declare(strict_types=1);

/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Shows the Whiplash game page for one player.
*/

require_once __DIR__ . "/common.php";

$errors = [];
$player = false;
$email = trim((string) (filter_input(INPUT_GET, "email", FILTER_DEFAULT) ?? ""));

if ($email === "") {
    $errors[] = "No email was sent.";
} elseif (!goodEmail($email)) {
    $errors[] = "The email format is not valid.";
} else {
    try {
        $db = getDb();
        $player = getPlayer($db, $email);

        if ($player === false) {
            $errors[] = "That player does not exist.";
        }
    } catch (Throwable $e) {
        $errors[] = "Database error: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whiplash | Play</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <main class="page-shell">
        <?php if ($errors !== [] || $player === false): ?>
            <div class="layout auth-layout">
                <section class="column main-column">
                    <p class="kicker">RHYTHM PRESSURE SIM</p>
                    <h1>Whiplash</h1>
                    <p class="subtitle">Game access error</p>

                    <div class="status-card status-error">
                        <h2>Unable to start the game</h2>
                        <?php foreach ($errors as $error): ?>
                            <p><?php echo h($error); ?></p>
                        <?php endforeach; ?>
                    </div>

                    <div class="page-actions">
                        <a class="button-link secondary" href="index.php">Back to Sign In</a>
                    </div>
                </section>
            </div>
        <?php else: ?>
            <div class="layout">
                <section class="column main-column">
                    <p class="kicker">RHYTHM PRESSURE SIM</p>
                    <h1>Whiplash</h1>
                    <p class="subtitle">Not quite my tempo...</p>

                    <div class="stats-grid">
                        <article class="stat-tile">
                            <p class="stat-label">Beats</p>
                            <p class="stat-value"><span id="beatsDisplay">0</span></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Run Total</p>
                            <p class="stat-value"><span id="runTotalDisplay">0</span></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Click Value</p>
                            <p class="stat-value"><span id="clickValueDisplay">1</span></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Auto Rate</p>
                            <p class="stat-value"><span id="autoRateDisplay">0.0</span> <small>beats/sec</small></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Upgrades in Play</p>
                            <p class="stat-value"><span id="upgradeCountDisplay">0</span></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Run Time</p>
                            <p class="stat-value"><span id="sessionTimeDisplay">0s</span></p>
                        </article>
                        <article class="stat-tile stat-tile-wide">
                            <p class="stat-label">Prestige Level</p>
                            <p class="stat-value"><span id="prestigeDisplay">0</span></p>
                        </article>
                    </div>

                    <div class="meter-wrap">
                        <p class="meter-label">Progress to next peak of <span id="meterGoalDisplay">100</span> beats</p>
                        <div class="meter">
                            <div id="resourceMeterFill" class="meter-fill"></div>
                        </div>
                    </div>

                    <button id="clickButton" class="click-button" type="button">
                        <img src="images/drum.png" alt="">
                        <span>Tap the Drum</span>
                    </button>

                    <div class="action-row">
                        <button id="muteButton" class="mute-button" type="button">Mute: Off</button>
                        <button id="prestigeButton" class="prestige-button" type="button" disabled>Prestige (Need 100,000 beats)</button>
                    </div>
                </section>

                <section class="column side-column">
                    <div class="session-panel">
                        <p class="player-tag">Player: <?php echo h($player["email"]); ?></p>
                    </div>

                    <h2>Shop</h2>
                    <div class="shop-list">
                        <button id="drumsticksBtn" class="upgrade-button" type="button" disabled>
                            <img class="upgrade-icon" src="images/DrumSticks.png" alt="">
                            <span id="drumsticksLabel">Drumsticks (Cost: 15)</span>
                        </button>
                        <p class="owned-line">Owned: <span id="drumsticksCount">0</span></p>

                        <button id="snareDrumBtn" class="upgrade-button" type="button" disabled>
                            <img class="upgrade-icon" src="images/SnareDrum.png" alt="">
                            <span id="snareDrumLabel">Snare Drum (Cost: 70)</span>
                        </button>
                        <p class="owned-line">Owned: <span id="snareDrumCount">0</span></p>

                        <button id="bassDrumBtn" class="upgrade-button" type="button" disabled>
                            <img class="upgrade-icon" src="images/BassDrum.png" alt="">
                            <span id="bassDrumLabel">Bass Drum (Cost: 220)</span>
                        </button>
                        <p class="owned-line">Owned: <span id="bassDrumCount">0</span></p>

                        <button id="hiHatBtn" class="upgrade-button" type="button" disabled>
                            <img class="upgrade-icon" src="images/HiHat.png" alt="">
                            <span id="hiHatLabel">Hi Hat (Cost: 900)</span>
                        </button>
                        <p class="owned-line">Owned: <span id="hiHatCount">0</span></p>

                        <button id="crashCymbalBtn" class="upgrade-button" type="button" disabled>
                            <img class="upgrade-icon" src="images/CrashCymbal.png" alt="">
                            <span id="crashCymbalLabel">Crash Cymbal (Cost: 3200)</span>
                        </button>
                        <p class="owned-line">Owned: <span id="crashCymbalCount">0</span></p>

                        <button id="metronomeBtn" class="upgrade-button" type="button" disabled>
                            <img class="upgrade-icon" src="images/Metronome.png" alt="">
                            <span id="metronomeLabel">Metronome - Start Auto Clicks (Cost: 400)</span>
                        </button>
                        <p class="owned-line">Tier: <span id="metronomeTierDisplay">0</span></p>
                    </div>

                    <h2>Advancements</h2>
                    <div id="rewardMessage" class="reward-message hidden"></div>
                    <div id="rewardList" class="reward-list"></div>

                    <button id="helpButton" class="help-button" type="button">Help</button>
                    <div id="helpPanel" class="help-panel hidden">
                        <h3>How to Play</h3>
                        <p>Click the drum to gain beats. Buy upgrades to improve click power and auto clicking.</p>
                        <h3>Upgrades</h3>
                        <ul id="helpUpgradeList"></ul>
                        <h3>Advancements</h3>
                        <ul id="helpRewardList"></ul>
                    </div>

                    <form id="quitForm" class="quit-form" action="leaderboard.php" method="post">
                        <input type="hidden" name="email" value="<?php echo h($player["email"]); ?>">
                        <input type="hidden" id="finalBeatsInput" name="final_beats" value="0">
                        <input type="hidden" id="lifetimeBeatsInput" name="lifetime_beats" value="0">
                        <input type="hidden" id="totalClicksInput" name="total_clicks" value="0">
                        <input type="hidden" id="totalUpgradesInput" name="total_upgrades" value="0">
                        <input type="hidden" id="prestigeLevelInput" name="prestige_level" value="0">
                        <input type="hidden" id="achievementCountInput" name="achievements_unlocked" value="0">
                        <input type="hidden" id="sessionSecondsInput" name="session_seconds" value="0">

                        <button id="quitButton" class="quit-button" type="submit">Quit and View Leaderboard</button>
                    </form>

                    <div class="page-actions compact-actions">
                        <a class="button-link secondary" href="index.php">Change Player</a>
                    </div>
                </section>
            </div>

            <script src="js/increment.js"></script>
            <script src="js/music.js"></script>
            <script src="js/shop.js"></script>
            <script src="js/advancements.js"></script>
        <?php endif; ?>
    </main>
</body>

</html>
