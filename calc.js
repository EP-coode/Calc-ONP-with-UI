String.prototype.swap = function (atPosition, pasteCharacter) {
    let arr = this.split('');
    arr[atPosition] = pasteCharacter;
    return arr.join('');
}

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
        switch (operation) {
            case "=":
                this.typeOperation(operation);
                this.typedFormula.pop()
                try {
                    let onp = this.toONP(this.typedFormula);
                    let outcome = this.getValueOfONP(onp);
                }
                catch (e) {
                    alert(e.message);
                }
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
                    this.updateDisplay(this.secondaryDisplay, this.typedFormula);
                }
                break;
            case "(":
                this.typedFormula.push('(');
                this.openTags++;
                this.updateDisplay(this.secondaryDisplay, this.typedFormula);
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

    typeOperation(operation) {
        this.numberToOperation();
        if (!isNaN(parseFloat(this.typedFormula[this.typedFormula.length - 1]))) {
            if (operation != null)
                this.typedFormula.push(operation);
            this.updateDisplay(this.secondaryDisplay, this.typedFormula);
        }
        this.updateDisplay(this.mainDisplay, this.currentNumber);
    }

    numberToOperation() {
        if (this.currentNumber[this.currentNumber.length - 1] === '.')
            this.currentNumber.replace('.', '');
        if (!isNaN(Number.parseFloat(this.currentNumber)))
            this.typedFormula.push(Number.parseFloat(this.currentNumber));
        this.currentNumber = "";
    }

    updateDisplay(display, toDisp) {
        display.innerHTML = toDisp;
    }

    // puring code is realy needed
    toONP(formula) {
        function getPriority(oper) {
            if (oper === "+" || oper === "-")
                return 1;
            else
                return 2;
        }
        function isOperator(elem) {
            return (elem === "+" || elem === "-" || elem === "*" || elem === "/");
        }
        //alert("ok")
        let stack = [];
        let queue = new Queue();
        formula.reverse();
        while (formula.length > 0) {
            let current = formula.pop();
            console.log(`Formula: ${formula} \n Stack:${stack} \n Queue:${queue.storage.toString()}`);
            //alert();
            if (typeof current === "number")
                queue.enqueue(current);
            else if (current === '(')
                stack.push('(');
            else if (current === ')') {
                let elem;
                do {
                    elem = stack.pop();
                    if (elem !== '(')
                        queue.enqueue(elem);
                }
                while (elem !== '(')
            }
            else {
                var opeator1 = current;
                var priority1 = getPriority(opeator1);
                let topElem = stack[stack.length - 1];
                while (stack.length > 0 &&
                    isOperator(topElem) &&
                    getPriority(topElem) >= priority1) {
                    queue.enqueue(stack.pop());
                    console.log("pt");
                    topElem = stack[stack.length - 1];
                }
                stack.push(opeator1);
            }
        }
        while (stack.length > 0)
            queue.enqueue(stack.pop());
        console.log(queue.storage);
        return queue.storage;
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

// Imported from gitHub
// This Stack is written using the pseudoclassical pattern

// Creates the queue
var Queue = function () {
    this.storage = {};
    this.count = 0;
    this.lowestCount = 0;
}

// Adds a value to the end of the chain
Queue.prototype.enqueue = function (value) {
    // Check to see if value is defined
    if (value) {
        this.storage[this.count] = value;
        this.count++;
    }
}

// Removes a value from the beginning of the chain
Queue.prototype.dequeue = function () {
    // Check to see if queue is empty
    if (this.count - this.lowestCount === 0) {
        return undefined;
    }

    var result = this.storage[this.lowestCount];
    delete this.storage[this.lowestCount];
    this.lowestCount++;
    return result;
}

// Returns the length of the queue
Queue.prototype.size = function () {
    return this.count - this.lowestCount;
}