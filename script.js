const prevOperationDiv = document.querySelector("#previous");
const currOperationDiv = document.querySelector("#current");

const clearBtn = document.querySelector("#clear");
const invertBtn = document.querySelector("#invert");
const percentBtn = document.querySelector("#percent");
const operatorBtns = document.querySelectorAll(".operator");
const digitBtns = document.querySelectorAll(".digit");

let currOperator = "";
let firstOperand = "";
let secondOperand = "";

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  return operator(a, b);
}

function getOperatorFunction(operatorChar) {
  if (operatorChar === "+") {
    return add;
  } else if (operatorChar === "−") {
    return subtract;
  } else if (operatorChar === "×") {
    return multiply;
  } else {
    return divide;
  }
}

function getCurrentExpression() {
  if (firstOperand === "") {
    return "0";
  }
  return `${firstOperand}${currOperator}${secondOperand}`;
}

function updateDisplay() {
  prevOperationDiv.textContent = "";
  currOperationDiv.textContent = getCurrentExpression();
  clearBtn.textContent = currOperationDiv.textContent === "0" ? "AC" : "C";
}

function performOperation(nextOperator) {
  const firstOperandNum = parseFloat(firstOperand);
  const secondOperandNum = parseFloat(secondOperand);
  const operator = getOperatorFunction(currOperator);

  if (isNaN(firstOperandNum) || isNaN(secondOperandNum)) {
    const prevOperation = `${firstOperand}${currOperator}${secondOperand}`;
    prevOperationDiv.textContent = prevOperation;
    currOperationDiv.textContent = "Syntax Error";
    clearBtn.textContent = "AC";
    return;
  }

  const prevOperation = getCurrentExpression();
  const result = operate(operator, firstOperandNum, secondOperandNum);
  const finalResult = Math.round(result * 1e7) / 1e7;

  currOperator = nextOperator === "=" ? "" : nextOperator;
  firstOperand = `${finalResult}`;
  secondOperand = "";

  prevOperationDiv.textContent = prevOperation;
  currOperationDiv.textContent = getCurrentExpression();
  clearBtn.textContent = currOperator === "" ? "AC" : "C";
}

function handleClear(e) {
  if (e.target.textContent == "AC") {
    currOperator = "";
    firstOperand = "";
    secondOperand = "";
  } else if (secondOperand !== "") {
    secondOperand = secondOperand.slice(0, -1);
  } else if (currOperator !== "") {
    currOperator = "";
  } else {
    firstOperand = firstOperand.slice(0, -1);
  }
  updateDisplay();
}

function handleInvert() {
  if (secondOperand !== "" && secondOperand.startsWith("-")) {
    secondOperand = secondOperand.slice(1);
  } else if (secondOperand !== "" && secondOperand !== "0") {
    secondOperand = `-${secondOperand}`;
  } else if (currOperator === "" && firstOperand.startsWith("-")) {
    firstOperand = firstOperand.slice(1);
  } else if (currOperator === "" && firstOperand !== "") {
    firstOperand = firstOperand === "0" ? firstOperand : `-${firstOperand}`;
  }
  updateDisplay();
}

function handlePercent() {
  if (firstOperand === "" || (currOperator !== "" && secondOperand === "")) {
    return;
  } else if (secondOperand === "") {
    const firstOperandNum = parseFloat(firstOperand);
    firstOperand = `${0.01 * firstOperandNum}`;
  } else {
    const secondOperandNum = parseFloat(secondOperand);
    secondOperand = `${0.01 * secondOperandNum}`;
  }
  updateDisplay();
}

function handleOperator(operatorChar) {
  if (firstOperand !== "" && secondOperand !== "") {
    performOperation(operatorChar);
  } else {
    if (firstOperand === "") {
      firstOperand += "0";
    }
    if (operatorChar !== "=") {
      currOperator = operatorChar;
    }
    updateDisplay();
  }
}

function handleDigit(digit) {
  if (currOperator === "" && digit === ".") {
    firstOperand = firstOperand === "" ? "0" : firstOperand;
    firstOperand += firstOperand.includes(".") ? "" : digit;
  } else if (digit === ".") {
    secondOperand = secondOperand === "" ? "0" : secondOperand;
    secondOperand += secondOperand.includes(".") ? "" : digit;
  } else if (currOperator === "") {
    firstOperand = firstOperand === "0" ? "" : firstOperand;
    firstOperand += digit;
  } else {
    secondOperand = secondOperand === "0" ? "" : secondOperand;
    secondOperand += digit;
  }
  updateDisplay();
}

clearBtn.addEventListener("click", handleClear);

invertBtn.addEventListener("click", handleInvert);

percentBtn.addEventListener("click", handlePercent);

operatorBtns.forEach((operatorBtn) => {
  operatorBtn.addEventListener("click", () => {
    handleOperator(operatorBtn.textContent);
  });
});

digitBtns.forEach((digitBtn) => {
  digitBtn.addEventListener("click", () => {
    handleDigit(digitBtn.textContent);
  });
});
