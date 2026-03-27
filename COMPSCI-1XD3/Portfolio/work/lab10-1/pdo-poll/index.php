<?php
declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDO Poll Vote</title>
</head>

<body>
    <main>
        <section>
            <p>COMPSCI 1XD3 Lab 10.1</p>
            <h1>PDO Poll Vote</h1>
            <p>
                Enter a poll ID and choose an option number. This version is intentionally
                simple: it records a vote using PDO and reports exactly what happened.
            </p>

            <form action="vote.php" method="POST">
                <label for="pollid">Poll ID</label>
                <input type="number" name="pollid" id="pollid" min="1" step="1" required>

                <label for="option">Option</label>
                <select name="option" id="option" required>
                    <option value="">Choose one</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                </select>

                <button type="submit">Submit Vote</button>
            </form>
        </section>
    </main>
</body>

</html>
