const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const operation = document.getElementById("operation");
const result = document.getElementById("result");
const doIt = document.getElementById("doIt");

function calculate() {
    const a = parseFloat(num1.value);
    const b = parseFloat(num2.value);
    if (Number.isNaN(a) || Number.isNaN(b)) {
        result.value = "";
        return;
    }
    let value;
    switch (operation.value) {
        case "+": value = a + b; break;
        case "-": value = a - b; break;
        case "*": value = a * b; break;
        case "/": value = b === 0 ? "" : a / b; break;
        case "%": value = b === 0 ? "" : a % b; break;
        default: value = "";
    }
    result.value = value;
}

doIt.addEventListener("click", calculate);
[num1, num2, operation].forEach((el) => {
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
});

calculate();