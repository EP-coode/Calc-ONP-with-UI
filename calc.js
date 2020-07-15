String.prototype.swap = function (atPosition, pasteCharacter) {
    let arr = this.split('');
    arr[atPosition] = pasteCharacter;
    return arr.join('');
}

class Calculator {
    constructor(formulaDisplay, typingDisplay) {
        this.currentNumber = "0";
        this.typedFormula = [];
        this.mainDisplay = document.getElementById("main_display");
        this.secondaryDisplay = document.getElementById("secondary_display");
        this.updateDisplay(this.mainDisplay, this.currentNumber);
    }

    buttonPressed(operation) {
        switch (operation) {
            case "=":
                console.log("equals");
                break;
            case "AC":
                console.log("all clear");
                break;
            case "+":
                console.log("sum");
                break;
            case "-":
                console.log("dif");
                break;
            case "*":
                console.log("mul");
                break;
            case "/":
                console.log("div");
                break;
            case ".":
                console.log("dot");
                break;
            case ")":
                console.log("close");
                break;
            case ")":
                console.log("open");
                break;
            default:
                if (!isNaN(Number.parseInt(operation))) {

                    if (this.currentNumber.length > 0 && this.currentNumber[0] === "0")
                        this.currentNumber = this.currentNumber.swap(0, operation);
                    else
                        this.currentNumber += operation;
                    this.updateDisplay(this.mainDisplay, this.currentNumber);
                }
                break;
        }
    }

    updateDisplay(display, toDisp) {
        display.innerHTML = toDisp;
    }

    toONP(formula) {

    }

    getValueOfONP(onp) {

    }
}

// loading DOM references
var calc = (function () {
    var calculator = new Calculator();
    const inputs = document.getElementsByClassName("calc__input");
    console.log(inputs);
    for (let inp of inputs) {
        let operation = inp.innerHTML;
        inp.onclick = (function (operation) {
            return () => {
                calculator.buttonPressed(operation);
            }
        })(operation);
    }
    return calculator;
})();


