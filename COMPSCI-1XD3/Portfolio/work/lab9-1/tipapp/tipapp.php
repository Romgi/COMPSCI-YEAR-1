<?php
/**
 * One Page Tip Calculator
 */

// get parameters (POST)
$server = filter_input(INPUT_POST, "server", FILTER_SANITIZE_SPECIAL_CHARS);
$email1 = filter_input(INPUT_POST, "email1", FILTER_VALIDATE_EMAIL);
$email2 = filter_input(INPUT_POST, "email2", FILTER_VALIDATE_EMAIL);
$bill = filter_input(INPUT_POST, "bill", FILTER_VALIDATE_FLOAT);
$tippercent = filter_input(INPUT_POST, "tippercent", FILTER_VALIDATE_INT);
$card = filter_input(INPUT_POST, "card", FILTER_SANITIZE_SPECIAL_CHARS);

// check parameters
$paramsok = false;
$error = false;

if (
    $server !== null && $server !== "" &&
    $email1 !== null && $email1 !== false &&
    $email2 !== null && $email2 !== false &&
    $bill !== null && $bill !== false &&
    $tippercent !== null && $tippercent !== false &&
    $card !== null && $card !== ""
) {
    if ($email1 === $email2 && $bill >= 0 && $tippercent >= 0 && preg_match("/^[0-9]{16}$/", $card)) {
        $tipamount = $bill * $tippercent / 100;
        $total = $bill + $tipamount;
        $paramsok = true;
    } else {
        $error = true;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Tip Calculator</title>
    <meta charset="UTF-8">
</head>
<body>

    <h1>Tip Calculator</h1>

    <form action="tipapp.php" method="post">
        <p>
            Server Name:
            <input type="text" name="server" required>
        </p>

        <p>
            Email:
            <input type="email" name="email1" required>
        </p>

        <p>
            Confirm Email:
            <input type="email" name="email2" required>
        </p>

        <p>
            Bill Amount:
            <input type="number" name="bill" step="0.01" min="0" required>
        </p>

        <p>
            Tip %:
            <input type="number" name="tippercent" min="0" required>
        </p>

        <p>
            Credit Card:
            <input type="text" name="card" required>
        </p>

        <p>
            <input type="submit" value="Calculate">
        </p>
    </form>

    <?php
    if ($paramsok) {
        ?>
        <h2>Bill Summary</h2>
        <p>Server: <?= $server ?></p>
        <p>Email: <?= $email1 ?></p>
        <p>Bill: $<?= number_format($bill, 2) ?></p>
        <p>Tip: $<?= number_format($tipamount, 2) ?></p>
        <p>Total: $<?= number_format($total, 2) ?></p>

        <form action="tipapp.php" method="post">
            <input type="submit" value="Clear">
        </form>
        <?php
    } elseif ($error) {
        ?>
        <p>Parameter Error</p>
        <?php
    }
    ?>

</body>
</html>