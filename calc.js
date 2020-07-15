String.prototype.swap = function (atPosition, pasteCharacter) {
    let arr = this.split('');
    arr[atPosition] = pasteCharacter;
    return arr.join('');
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
        switch (operation) {
            case "=":
                this.typeOperation(operation);
                this.typedFormula.pop()
                try {
                    let onp = this.toONP(this.typedFormula);
                    var outcome = this.getValueOfONP(onp);
                }
                catch (e) {
                    alert(e.message);
                }
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
                this.typedFormula.push('(');
                this.openTags++;
                this.updateDisplay(this.secondaryDisplay, this.typedFormula.join(''));
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
        if (operation != null)
            this.typedFormula.push(operation);
        this.updateDisplay(this.secondaryDisplay, this.typedFormula.join(''));

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
        let queue = [];
        formula.reverse();
        while (formula.length > 0) {
            let current = formula.pop();
            // console.log(`Formula: ${formula} \n Stack:${stack} \n Queue:${queue}`);
            //alert();
            if (typeof current === "number")
                queue.push(current);
            else if (current === '(')
                stack.push('(');
            else if (current === ')') {
                let elem;
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
                    isOperator(topElem) &&
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
        console.log(queue);
        return queue;
    }

    getValueOfONP(onp) {
        let stack = [];
        onp.reverse();
        while (onp.length > 0) {
            console.log(stack);
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