<?php
$roll1 = rand(1, 7);
$roll2 = rand(1, 7);
$roll3 = rand(1, 7);

$message = "No win this time.";
if ($roll1 === $roll2 && $roll2 === $roll3) {
    $message = "Jackpot!";
} elseif ($roll1 === $roll2 || $roll1 === $roll3 || $roll2 === $roll3) {
    $message = "You win!";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Slot Machine</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Slot Machine</h1>

    <div class="slots">
        <img src="images/fruit/<?= $roll1 ?>.png">
        <img src="images/fruit/<?= $roll2 ?>.png">
        <img src="images/fruit/<?= $roll3 ?>.png">
    </div>

    <p><?= $message ?></p>

    <a href="slot.php">Spin Again</a>
</body>
</html>