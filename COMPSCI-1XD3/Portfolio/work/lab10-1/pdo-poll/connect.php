<?php
declare(strict_types=1);

function connectToPollDatabase(): PDO
{
    if (!extension_loaded("pdo_mysql")) {
        throw new RuntimeException("The PDO MySQL extension is not enabled in PHP.");
    }

    $host = "localhost";
    $dbName = "graydj1_db";
    $username = "graydj1_local";
    $password = ")wt_xR:e";

    $dsn = "mysql:host={$host};dbname={$dbName};charset=utf8mb4";

    return new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}
