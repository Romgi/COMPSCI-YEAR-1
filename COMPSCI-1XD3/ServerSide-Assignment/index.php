<?php
declare(strict_types=1);

/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Displays the Whiplash login form so returning and new players can enter the PHP assignment.
*/

$todayDate = (new DateTimeImmutable("today"))->format("Y-m-d");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whiplash | Sign In</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body class="login-page">
    <main class="page-shell">
        <div class="layout auth-layout">
            <section class="column main-column">
                <p class="kicker">RHYTHM PRESSURE SIM</p>
                <h1>Whiplash</h1>
                <p class="subtitle">Server-side assignment edition.</p>
                <p class="hero-copy">
                    Sign in with your email address and birth date.
                </p>

                <form id="loginForm" class="auth-form" action="login.php" method="post">
                    <div class="field">
                        <label for="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            maxlength="255"
                            autocomplete="email"
                            pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)+"
                            placeholder="terence.fletcher@whiplash.com"
                            required>
                        <p id="emailFeedback" class="field-feedback" aria-live="polite"></p>
                    </div>

                    <div class="field">
                        <label for="birth_date">Birth Date</label>
                        <input
                            type="date"
                            id="birth_date"
                            name="birth_date"
                            min="1900-01-01"
                            max="<?php echo htmlspecialchars($todayDate, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8"); ?>"
                            autocomplete="bday"
                            required>
                        <p class="field-note">The assignment uses birth date as the intentionally insecure password.</p>
                    </div>

                    <button type="submit">Continue to Login</button>
                </form>
            </section>

        </div>
    </main>

    <script src="js/login.js"></script>
</body>

</html>
