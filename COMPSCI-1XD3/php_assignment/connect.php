<?php
declare(strict_types=1);

/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Connects to the course database with PDO.
*/

/**
 * Connects to the database.
 *
 * @return PDO The database connection.
 */
function getDb(): PDO
{
    $host = "localhost";
    $db = "graydj1_db";
    $user = "graydj1_local";
    $pass = ")wt_xR:e";
    $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";

    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}
