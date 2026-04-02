<?php
declare(strict_types=1);

/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Checks the login form and either adds a new player or lets an old player continue.
*/

require_once __DIR__ . "/common.php";

$title = "Unable to continue";
$box = "status-error";
$msg = [];
$links = [];
$play = "";
$email = trim((string) (filter_input(INPUT_POST, "email", FILTER_DEFAULT) ?? ""));
$birth = trim((string) (filter_input(INPUT_POST, "birth_date", FILTER_DEFAULT) ?? ""));
$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method !== "POST") {
    $msg[] = "This page only works from the sign in form.";
    $links[] = [
        "label" => "Back to Sign In",
        "href" => "index.php",
        "class" => "secondary",
    ];
} else {
    if ($email === "") {
        $msg[] = "No email was submitted.";
    } elseif (!goodEmail($email)) {
        $msg[] = "The email format is not valid.";
    }

    if ($birth === "") {
        $msg[] = "No birth date was submitted.";
    }

    if ($msg === []) {
        try {
            $db = getDb();
            $player = getPlayer($db, $email);

            if ($player === false) {
                addPlayer($db, $email, $birth);
                $title = "Welcome";
                $box = "status-success";
                $msg[] = "You are a new player.";
                $play = "play.php?email=" . rawurlencode($email);
            } elseif ($player["birth_date"] === $birth) {
                $title = "Welcome back";
                $box = "status-success";
                $msg[] = "You have been here before.";
                $play = "play.php?email=" . rawurlencode($email);
            } else {
                $msg[] = "That email is already taken.";
            }
        } catch (Throwable $e) {
            $msg[] = "Database error: " . $e->getMessage();
        }
    }

    if ($play !== "") {
        $links[] = [
            "label" => "Play Whiplash",
            "href" => $play,
            "class" => "",
        ];
    }

    $links[] = [
        "label" => "Back to Sign In",
        "href" => "index.php",
        "class" => "secondary",
    ];
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whiplash | Login Result</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <main class="page-shell">
        <div class="layout auth-layout">
            <section class="column main-column">
                <p class="kicker">RHYTHM PRESSURE SIM</p>
                <h1>Whiplash</h1>
                <p class="subtitle">Login result</p>

                <div class="status-card <?php echo h($box); ?>">
                    <h2><?php echo h($title); ?></h2>

                    <?php foreach ($msg as $line): ?>
                        <p><?php echo h($line); ?></p>
                    <?php endforeach; ?>

                    <?php if ($play !== ""): ?>
                        <p class="inline-note">Signed in as <strong><?php echo h($email); ?></strong>.</p>
                    <?php endif; ?>
                </div>

                <div class="page-actions">
                    <?php foreach ($links as $link): ?>
                        <a class="button-link <?php echo h($link["class"]); ?>" href="<?php echo h($link["href"]); ?>">
                            <?php echo h($link["label"]); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </section>

            <aside class="column side-column">
                <h2>What Happens Next</h2>
                <ul class="feature-list">
                    <li>New players are added to the players table.</li>
                    <li>Old players can go straight to the game.</li>
                    <li>When the game ends, the result is saved on the leaderboard page.</li>
                </ul>
            </aside>
        </div>
    </main>
</body>

</html>
