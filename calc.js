String.prototype.swap = function (atPosition, pasteCharacter) {
    let arr = this.split('');
    arr[atPosition] = pasteCharacter;
    return arr.join('');
}

Array.prototype.lastElem = function () {
    return this[this.length - 1];
}

// todo:
// Repair validation, style etc.
class Calculator {
    constructor(formulaDisplay, typingDisplay) {
        this.currentNumber = "";
        this.typedFormula = [];
        this.closeTags = 0;
        this.openTags = 0;
        this.mainDisplay = document.getElementById("main_display");
        this.secondaryDisplay = document.getElementById("secondary_display");
        this.updateDisplay(this.mainDisplay, this.currentNumber);
    }

    buttonPressed(operation) {
        console.log(operation);
        switch (operation) {
            // backspace
            case "←":
                this.currentNumber = this.currentNumber.substr(0, this.currentNumber.length - 1);
                this.updateDisplay(this.mainDisplay, this.currentNumber)
                console.log("backspace");
                break;
            case "=":
                this.numberToOperation();
                while (this.isOperator(this.typedFormula[this.typedFormula.length - 1]))
                    this.typedFormula.pop();
                // try {
                let onp = this.toONP(this.typedFormula);
                var outcome = this.getValueOfONP(onp);
                // }
                // catch (e) {
                //     alert(e.message);
                // }
                this.currentNumber = outcome.toString();
                this.updateDisplay(this.mainDisplay, this.currentNumber);
                this.updateDisplay(this.secondaryDisplay, '');
                console.log("equals");
                break;
            case "AC":
                this.currentNumber = "";
                this.typedFormula = [];
                this.closeTags = 0;
                this.openTags = 0;
                this.updateDisplay(this.mainDisplay, '0');
                this.updateDisplay(this.secondaryDisplay, '');
                console.log("all clear");
                break;
            case "+":
                this.typeOperation(operation);
                break;
            case "-":
                this.typeOperation(operation);
                console.log("dif");
                break;
            case "*":
                this.typeOperation(operation);
                console.log("mul");
                break;
            case "/":
                this.typeOperation(operation);
                break;
            case ".":
                if (this.currentNumber.indexOf('.') < 0) {
                    if (this.currentNumber.length == 0)
                        this.currentNumber += "0";
                    this.currentNumber += '.';
                }
                this.updateDisplay(this.mainDisplay, this.currentNumber);
                console.log('dot');
                break;
            case ")":
                if (this.openTags > this.closeTags) {
                    this.typeOperation(null);
                    this.typedFormula.push(')')
                    this.closeTags++;
                    this.updateDisplay(this.secondaryDisplay, this.typedFormula.join(''));
                }
                break;
            case "(":
                console.log(this.typedFormula.lastElem());
                if (this.typedFormula.lastElem() !== ')') {
                    this.typedFormula.push('(');
                    this.openTags++;
                    this.updateDisplay(this.secondaryDisplay, this.typedFormula.join(''));
                }
                break;
            default:
                if (!isNaN(Number.parseInt(operation))) {
                    if (this.currentNumber[0] === "0" && this.currentNumber[1] !== '.')
                        this.currentNumber = this.currentNumber.swap(0, operation);
                    else
                        this.currentNumber += operation;
                    this.updateDisplay(this.mainDisplay, this.currentNumber);
                }
                break;
        }
    }

    /**Ads number visible in main display and operation to typedFormula array 
     * @param operation + - / * operation that user want to make 
    */
    typeOperation(operation) {
        // add number in display
        this.numberToOperation();
        // if operatin is allowed if last element was not an operator and allowed symbol is passed
        if (!this.isOperator(this.typedFormula.lastElem()) &&
            (this.isOperator(operation) || operation === '(' || operation === ')'))
            this.typedFormula.push(operation);

        // user display
        this.updateDisplay(this.secondaryDisplay, this.typedFormula.join(''));
    }

    /**
     * Transfer number from string visible on the display to typedFormula array
     * also cleaans display
     * trying to reppair number if its broken
     */
    numberToOperation() {
        // if dot is without succesor
        if (this.currentNumber[this.currentNumber.length - 1] === '.')
            this.currentNumber.replace('.', '');
        // push to formula if can be parsed
        if (!isNaN(Number.parseFloat(this.currentNumber)))
            this.typedFormula.push(Number.parseFloat(this.currentNumber));
        // clean type area
        this.currentNumber = "";
        // user display
        this.updateDisplay(this.mainDisplay, this.currentNumber);
    }

    /**
     * @param {*} display container that woudl play role of display
     * @param {String} toDisp this string woud be visible in defined display
     */
    updateDisplay(display, toDisp) {
        display.innerHTML = toDisp;
    }

    /** Says if this element is operator */
    isOperator(elem) {
        return (elem === "+" || elem === "-" || elem === "*" || elem === "/");
    }

    /**
     * @param {Array} formula Array of numbers and operatos that repersent the formula
     * @returns ONP version of passed formula as Array of numbers and operations
     */
    toONP(formula) {
        console.log("wejściowa formuła: " + formula);
        function getPriority(oper) {
            if (oper === "+" || oper === "-")
                return 1;
            else
                return 2;
        }
        // substitute names for js arrays
        let stack = []; // it woud contains stacked operations to cary about later
        let queue = []; // it would contain anwser 
        // we read fromula from left to right js provides only pop() method so that tric make me work less
        formula.reverse();
        // we continue it until we consider all formula elements
        while (formula.length > 0) {
            // considered element
            let current = formula.pop();
            // in ONP numbers order stays unchanged
            if (typeof current === "number")
                queue.push(current);
            else if (current === '(')
                stack.push('(');
            else if (current === ')') {
                let elem;
                // until we reach
                do {
                    elem = stack.pop();
                    if (elem !== '(')
                        queue.push(elem);
                }
                while (elem !== '(')
            }
            else {
                var opeator1 = current;
                var priority1 = getPriority(opeator1);
                let topElem = stack[stack.length - 1];
                while (stack.length > 0 &&
                    this.isOperator(topElem) &&
                    getPriority(topElem) >= priority1) {
                    queue.push(stack.pop());
                    console.log("pt");
                    topElem = stack[stack.length - 1];
                }
                stack.push(opeator1);
            }
        }
        while (stack.length > 0)
            queue.push(stack.pop());
        console.log("Wygnerowano ONP: " + queue);
        return queue;
    }

    getValueOfONP(onp) {
        let stack = [];
        onp.reverse();
        while (onp.length > 0) {
            let curr = onp.pop();
            if (typeof curr === 'number')
                stack.push(curr);
            else {
                console.log("liczę");
                let num2 = stack.pop();
                let num1 = stack.pop();
                switch (curr) {
                    case '+':
                        stack.push(num1 + num2);
                        break;
                    case '-':
                        stack.push(num1 - num2);
                        break;
                    case '/':
                        stack.push(num1 / num2);
                        break;
                    case '*':
                        stack.push(num1 * num2);
                        break;
                    default:
                        throw new Error("ERRR");
                }
            }
        }
        return stack.pop();
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