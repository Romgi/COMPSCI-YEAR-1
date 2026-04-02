<?php
declare(strict_types=1);

/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Saves a game result and shows simple stats plus a top 5 leaderboard.
*/

require_once __DIR__ . "/common.php";

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";
$errors = [];
$email = "";
$player = false;
$my = false;
$top = [];
$done = filter_input(INPUT_GET, "done", FILTER_VALIDATE_INT) === 1;

if ($method === "POST") {
    $email = trim((string) (filter_input(INPUT_POST, "email", FILTER_DEFAULT) ?? ""));
    $beats = (int) (filter_input(INPUT_POST, "final_beats", FILTER_DEFAULT) ?? 0);
    $total = (int) (filter_input(INPUT_POST, "lifetime_beats", FILTER_DEFAULT) ?? 0);
    $clicks = (int) (filter_input(INPUT_POST, "total_clicks", FILTER_DEFAULT) ?? 0);
    $upgrades = (int) (filter_input(INPUT_POST, "total_upgrades", FILTER_DEFAULT) ?? 0);
    $prestige = (int) (filter_input(INPUT_POST, "prestige_level", FILTER_DEFAULT) ?? 0);
    $ach = (int) (filter_input(INPUT_POST, "achievements_unlocked", FILTER_DEFAULT) ?? 0);
    $seconds = (int) (filter_input(INPUT_POST, "session_seconds", FILTER_DEFAULT) ?? 0);

    if ($email === "") {
        $errors[] = "No email was sent.";
    }

    if ($errors === []) {
        try {
            $db = getDb();
            $player = getPlayer($db, $email);

            if ($player !== false) {
                addResult($db, [
                    "email" => $email,
                    "beats" => $beats,
                    "total_beats" => $total,
                    "clicks" => $clicks,
                    "upgrades" => $upgrades,
                    "prestige" => $prestige,
                    "achievements" => $ach,
                    "seconds" => $seconds,
                ]);

                header("Location: leaderboard.php?email=" . rawurlencode($email) . "&done=1");
                exit;
            } else {
                $errors[] = "That player does not exist.";
            }
        } catch (Throwable $e) {
            $errors[] = "Database error: " . $e->getMessage();
        }
    }
}

if ($method !== "POST") {
    $email = trim((string) (filter_input(INPUT_GET, "email", FILTER_DEFAULT) ?? ""));
}

if ($errors === [] && $email !== "") {
    try {
        $db = getDb();
        $player = getPlayer($db, $email);

        if ($player === false) {
            $errors[] = "That player does not exist.";
        } else {
            $my = getMyStats($db, $email);
            $top = getTop($db);
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
    <title>Whiplash | Leaderboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <main class="page-shell">
        <?php if ($errors !== [] || $player === false): ?>
            <div class="layout auth-layout">
                <section class="column main-column">
                    <p class="kicker">RHYTHM PRESSURE SIM</p>
                    <h1>Whiplash</h1>
                    <p class="subtitle">Leaderboard error</p>

                    <div class="status-card status-error">
                        <h2>Unable to load leaderboard</h2>
                        <?php foreach ($errors as $error): ?>
                            <p><?php echo h($error); ?></p>
                        <?php endforeach; ?>
                    </div>

                    <div class="page-actions">
                        <?php if ($email !== ""): ?>
                            <a class="button-link" href="play.php?email=<?php echo rawurlencode($email); ?>">Back to Play</a>
                        <?php endif; ?>
                        <a class="button-link secondary" href="index.php">Back to Sign In</a>
                    </div>
                </section>
            </div>
        <?php else: ?>
            <div class="layout leaderboard-layout">
                <section class="column main-column">
                    <p class="kicker">RHYTHM PRESSURE SIM</p>
                    <h1>Whiplash</h1>
                    <p class="subtitle">Leaderboard and player stats</p>
                    <p class="player-tag">Player: <?php echo h($player["email"]); ?></p>

                    <?php if ($done): ?>
                        <div class="status-card status-success">
                            <h2>Run recorded</h2>
                            <p>Your game was saved.</p>
                        </div>
                    <?php endif; ?>

                    <h2>Your Stats</h2>
                    <div class="summary-grid">
                        <article class="stat-tile">
                            <p class="stat-label">Sessions</p>
                            <p class="stat-value"><?php echo h((string) ((int) ($my["games"] ?? 0))); ?></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Average Beats</p>
                            <p class="stat-value"><?php echo h(number_format((float) ($my["avg_beats"] ?? 0), 1)); ?></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Best Beats</p>
                            <p class="stat-value"><?php echo h((string) ((int) ($my["best_beats"] ?? 0))); ?></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Lifetime Beats</p>
                            <p class="stat-value"><?php echo h((string) ((int) ($my["life_beats"] ?? 0))); ?></p>
                        </article>
                        <article class="stat-tile">
                            <p class="stat-label">Total Clicks</p>
                            <p class="stat-value"><?php echo h((string) ((int) ($my["total_clicks"] ?? 0))); ?></p>
                        </article>
                    </div>
                </section>

                <aside class="column side-column">
                    <h2>Top 5 Players</h2>
                    <p class="inline-note">Ranking is based on lifetime beats.</p>

                    <div class="table-wrap">
                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Total Beats</th>
                                    <th>Best Beats</th>
                                    <th>Sessions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($top as $i => $row): ?>
                                    <tr>
                                        <td><?php echo h((string) ($i + 1)); ?></td>
                                        <td><?php echo h($row["email"]); ?></td>
                                        <td><?php echo h((string) ((int) $row["life_beats"])); ?></td>
                                        <td><?php echo h((string) ((int) $row["best_beats"])); ?></td>
                                        <td><?php echo h((string) ((int) $row["games"])); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                    <div class="page-actions">
                        <a class="button-link" href="play.php?email=<?php echo rawurlencode($email); ?>">Play Again</a>
                        <a class="button-link secondary" href="index.php">Sign Out</a>
                    </div>
                </aside>
            </div>
        <?php endif; ?>
    </main>
</body>

</html>
