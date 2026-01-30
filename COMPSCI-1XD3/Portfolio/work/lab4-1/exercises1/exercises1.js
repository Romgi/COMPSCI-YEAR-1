function generateRandomNumber() {
    return Math.floor(Math.random() * 201) - 100;
}

function askQuestion() {
    const num1 = generateRandomNumber();
    const num2 = generateRandomNumber();
    const correctAnswer = num1 + num2;
    let userAnswer = null;
    let isCorrect = false;

    while (!isCorrect) {
        userAnswer = prompt(`What is ${num1} + ${num2}?`);

        if (userAnswer === null) {
            return false; // User cancelled
        }

        if (parseInt(userAnswer) === correctAnswer) {
            alert("Correct! Well done!");
            isCorrect = true;
        } else {
            alert("Incorrect. Try again.");
        }
    }

    return true;
}

function startQuiz() {
    let continueQuiz = true;

    while (continueQuiz) {
        const completed = askQuestion();

        if (!completed) {
            break;
        }

        continueQuiz = confirm("Would you like another question?");
    }

    document.body.innerHTML = "<h1>Goodbye! Thanks for practicing.</h1>";
}

startQuiz();