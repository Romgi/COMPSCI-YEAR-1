<?php
declare(strict_types=1);

require_once "connect.php";

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

function buildAvailableOptions(array $poll): array
{
    $available = [];

    for ($optionNumber = 1; $optionNumber <= 4; $optionNumber++) {
        $column = "option{$optionNumber}";
        $value = $poll[$column] ?? null;

        if ($value !== null && trim((string) $value) !== "") {
            $available[] = "Option {$optionNumber}: {$value}";
        }
    }

    return $available;
}

$statusClass = "status-error";
$statusHeading = "Vote not recorded";
$messages = [];
$details = [];
$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method !== "POST") {
    $messages[] = "This page only accepts POST submissions from the vote form.";
} else {
    $pollId = filter_input(
        INPUT_POST,
        "pollid",
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
    );
    $option = filter_input(
        INPUT_POST,
        "option",
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1, "max_range" => 4]]
    );

    if ($pollId === null) {
        $messages[] = "No poll ID was submitted.";
    } elseif ($pollId === false) {
        $messages[] = "Poll ID must be a whole number greater than 0.";
    }

    if ($option === null) {
        $messages[] = "No option was submitted.";
    } elseif ($option === false) {
        $messages[] = "Option must be 1, 2, 3, or 4.";
    }

    if ($messages === []) {
        $voteColumns = [
            1 => "vote1",
            2 => "vote2",
            3 => "vote3",
            4 => "vote4",
        ];
        $optionColumns = [
            1 => "option1",
            2 => "option2",
            3 => "option3",
            4 => "option4",
        ];

        try {
            $dbh = connectToPollDatabase();

            $checkCommand = "SELECT `ID`, `title`, `question`, `option1`, `option2`, `option3`, `option4`
                             FROM `poll`
                             WHERE `ID` = ?";
            $checkStmt = $dbh->prepare($checkCommand);
            $checkStmt->execute([$pollId]);
            $poll = $checkStmt->fetch();

            if ($poll === false) {
                $messages[] = "Poll ID {$pollId} does not exist.";
            } else {
                $details[] = "Poll: " . $poll["title"];
                $details[] = "Question: " . $poll["question"];

                $selectedOptionColumn = $optionColumns[$option];
                $selectedVoteColumn = $voteColumns[$option];
                $selectedOptionText = $poll[$selectedOptionColumn];

                if ($selectedOptionText === null || trim((string) $selectedOptionText) === "") {
                    $messages[] = "Poll {$pollId} exists, but option {$option} is not available for that poll.";

                    $availableOptions = buildAvailableOptions($poll);
                    if ($availableOptions !== []) {
                        $details[] = "Available options: " . implode(" | ", $availableOptions);
                    }
                } else {
                    $updateCommand = sprintf(
                        "UPDATE `poll` SET `%s` = `%s` + 1 WHERE `ID` = ?",
                        $selectedVoteColumn,
                        $selectedVoteColumn
                    );
                    $updateStmt = $dbh->prepare($updateCommand);
                    $success = $updateStmt->execute([$pollId]);

                    if (!$success) {
                        $messages[] = "The database rejected the vote update.";
                    } elseif ($updateStmt->rowCount() !== 1) {
                        $messages[] = "The vote query ran, but no poll row was updated.";
                    } else {
                        $countCommand = sprintf(
                            "SELECT `%s` FROM `poll` WHERE `ID` = ?",
                            $selectedVoteColumn
                        );
                        $countStmt = $dbh->prepare($countCommand);
                        $countStmt->execute([$pollId]);
                        $newVoteCount = $countStmt->fetchColumn();

                        $statusClass = "status-success";
                        $statusHeading = "Vote recorded";
                        $messages[] = "Your vote for poll {$pollId}, option {$option}, was recorded.";
                        $details[] = "Chosen option: {$selectedOptionText}";

                        if ($newVoteCount !== false) {
                            $details[] = "Option {$option} now has {$newVoteCount} vote(s).";
                        }
                    }
                }
            }
        } catch (Throwable $e) {
            $messages[] = "Database error: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vote Result</title>
</head>

<body>
    <main>
        <section>
            <p>COMPSCI 1XD3 Lab 10.1</p>
            <h1><?php echo h($statusHeading); ?></h1>

            <div>
                <?php foreach ($messages as $message): ?>
                    <p><?php echo h($message); ?></p>
                <?php endforeach; ?>
            </div>

            <?php if ($details !== []): ?>
                <div>
                    <?php foreach ($details as $detail): ?>
                        <p><?php echo h($detail); ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <p>
                <a href="index.php">Try another vote</a>
            </p>
        </section>
    </main>
</body>

</html>
