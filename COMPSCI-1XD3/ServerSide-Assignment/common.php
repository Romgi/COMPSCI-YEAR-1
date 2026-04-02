<?php
declare(strict_types=1);

/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Contains simple helper functions for the Whiplash PHP pages.
*/

require_once __DIR__ . "/connect.php";

/**
 * Escapes text for HTML.
 *
 * @param string $text The text to escape.
 * @return string The escaped text.
 */
function h(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

/**
 * Checks if an email matches the assignment rule.
 *
 * @param string $email The email to check.
 * @return bool True if the email is valid.
 */
function goodEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        && preg_match('/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/', $email) === 1;
}

/**
 * Finds one player by email.
 *
 * @param PDO $db The database connection.
 * @param string $email The email to search for.
 * @return array|false The player row or false.
 */
function getPlayer(PDO $db, string $email): array|false
{
    $sql = "SELECT * FROM whiplash_players WHERE email = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email]);
    return $stmt->fetch();
}

/**
 * Adds a new player row.
 *
 * @param PDO $db The database connection.
 * @param string $email The player's email.
 * @param string $birth The player's birth date.
 * @return void No value is returned.
 */
function addPlayer(PDO $db, string $email, string $birth): void
{
    $sql = "INSERT INTO whiplash_players (email, birth_date) VALUES (?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email, $birth]);
}

/**
 * Adds a game result row.
 *
 * @param PDO $db The database connection.
 * @param array $data The result data.
 * @return void No value is returned.
 */
function addResult(PDO $db, array $data): void
{
    $sql = "INSERT INTO whiplash_results
        (email, beats, total_beats, clicks, upgrades, prestige, achievements, seconds_played, played_on)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $data["email"],
        $data["beats"],
        $data["total_beats"],
        $data["clicks"],
        $data["upgrades"],
        $data["prestige"],
        $data["achievements"],
        $data["seconds"],
    ]);
}

/**
 * Gets the current player's simple stats.
 *
 * @param PDO $db The database connection.
 * @param string $email The player's email.
 * @return array|false The stats row or false.
 */
function getMyStats(PDO $db, string $email): array|false
{
    $sql = "SELECT
        COUNT(*) AS games,
        AVG(beats) AS avg_beats,
        MAX(beats) AS best_beats,
        SUM(total_beats) AS life_beats,
        SUM(clicks) AS total_clicks
        FROM whiplash_results
        WHERE email = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email]);
    return $stmt->fetch();
}

/**
 * Gets the top five players.
 *
 * @param PDO $db The database connection.
 * @return array The top five rows.
 */
function getTop(PDO $db): array
{
    $sql = "SELECT
        email,
        SUM(total_beats) AS life_beats,
        MAX(beats) AS best_beats,
        COUNT(*) AS games
        FROM whiplash_results
        GROUP BY email
        ORDER BY life_beats DESC
        LIMIT 5";
    $stmt = $db->query($sql);
    return $stmt->fetchAll();
}
