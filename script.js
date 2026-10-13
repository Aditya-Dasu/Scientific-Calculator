// Find the calculator controls so their buttons can receive click behavior.
const numbers = document.querySelectorAll(".number");
const control = document.querySelector(".control");
const operators = document.querySelectorAll(".operator");
const display = document.querySelector(".display");
const EqualsButton = document.querySelector(".equals-button");

// Number clicks replace the starting value or append another digit.
numbers.forEach((number) => {
number.addEventListener("click", () => {
// Start fresh when the display is zero or contains an earlier error.
if (
display.textContent === "0" ||
display.textContent === "Invalid" ||
display.textContent === "Error"
) {
display.textContent = number.dataset.value;
} else {
display.textContent += number.dataset.value;
}
});
});

// The clear button resets the display to zero.
control.addEventListener("click", () => {
display.textContent = "0";
});

// Operator clicks append the selected arithmetic operator.
operators.forEach((operator) => {
operator.addEventListener("click", () => {
const value = operator.dataset.value;

// Start a new expression after an earlier error before appending the operator.
    if (
        display.textContent === "Invalid" ||
        display.textContent === "Error"
    ) {
        display.textContent = "0";
    }

    display.textContent += value;
});

});

// Equals tokenizes the display and evaluates the expression.
EqualsButton.addEventListener("click", () => {
const str = display.textContent;
// Match decimal numbers and arithmetic operators; the escaped dot means a decimal point.
const tokens = str.match(/\d*\.?\d+|[+/*-]/g);

// Reject expressions containing characters the tokenizer did not recognize.
if (!tokens || tokens.join("") !== str) {
    display.textContent = "Invalid";
    return;
}

// Require an odd number of tokens: numbers alternate with operators.
if (
    tokens.length === 0 ||
    tokens.length % 2 === 0
) {
    display.textContent = "Error";
    return;
}

// Calculate multiplication and division first to preserve arithmetic order.
for (let i = 0; i < tokens.length; i++) {
    // Process this token when it is multiplication or division.
    if (tokens[i] === "*" || tokens[i] === "/") {
        // Reject an operator that has no number on either side.
        if (i === 0 || i === tokens.length - 1) {
            display.textContent = "Error";
            return;
        }

        const left = Number(tokens[i - 1]);
        const right = Number(tokens[i + 1]);

        // Reject invalid operands and division by zero.
        if (
            !Number.isFinite(left) ||
            !Number.isFinite(right) ||
            (tokens[i] === "/" && right === 0)
        ) {
            display.textContent = "Error";
            return;
        }

        let result;

        // Apply the selected multiplication or division.
        switch (tokens[i]) {
            case "*":
                result = left * right;
                break;
            case "/":
                result = left / right;
                break;
        }

        // Reject a result that is not a finite number.
        if (!Number.isFinite(result)) {
            display.textContent = "Error";
            return;
        }

        // Replace the operator and its two operands with their result.
        tokens.splice(i - 1, 3, String(result));
        i--;
    }
}

// Calculate addition and subtraction after multiplication and division.
for (let i = 0; i < tokens.length; i++) {
    // Process this token when it is addition or subtraction.
    if (tokens[i] === "+" || tokens[i] === "-") {
        // Reject an operator that has no number on either side.
        if (i === 0 || i === tokens.length - 1) {
            display.textContent = "Error";
            return;
        }

        const left = Number(tokens[i - 1]);
        const right = Number(tokens[i + 1]);

        // Reject operands that are not finite numbers.
        if (
            !Number.isFinite(left) ||
            !Number.isFinite(right)
        ) {
            display.textContent = "Error";
            return;
        }

        let result;

        // Apply the selected addition or subtraction.
        switch (tokens[i]) {
            case "+":
                result = left + right;
                break;
            case "-":
                result = left - right;
                break;
        }

        // Reject a result that is not a finite number.
        if (!Number.isFinite(result)) {
            display.textContent = "Error";
            return;
        }

        // Replace the operator and its two operands with their result.
        tokens.splice(i - 1, 3, String(result));
        i--;
    }
}

// Convert the final remaining token to the answer.
const answer = Number(tokens[0]);

// Show the answer if calculation left exactly one finite number.
if (tokens.length === 1 && Number.isFinite(answer)) {
    display.textContent = String(answer);
} else {
    display.textContent = "Error";
}

});
