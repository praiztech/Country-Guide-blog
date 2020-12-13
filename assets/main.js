 const operations = {
  '\u002b': function(a, b) {
    return a + b;
  },
  '\u2212': function(a, b) {
    return a - b;
  },
  '\u00d7': function(a, b) {
    return a * b;
  },
  '\u00f7': function(a, b) {
    return a / b;
  }
};

const idArr = ["A1", "A2", "A3", "A4", "A5", "A6", "A7"];
const pressedValue = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '=', 'Enter', 'Backspace', 'Delete', 'Del'];
let keyMap = {}; // determines if consecutive keydown and keyup events have occurred
let input = '';
let result = '';
let displayy;
let currOperand = '';
let isOperandCounter4SixOrMore = false; 
//if true, specifies that an operand is currently being computed and the total number of operands is >= 6
let currFontSize = 'big'; //stores the font-size state of the input fields


//Polyfill to support Nodelist.forEach() in IE9+ and Edge
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

document.addEventListener('DOMContentLoaded', eventListenerr, false); //for IE9 support

function eventListenerr() {
  document.addEventListener('keydown', processKeyInput, false);
  document.addEventListener('keyup', processKeyInput, false);
  document.getElementById('delete').addEventListener('click', clearAllAndInput, false);
  document.getElementById('backspace').addEventListener('click', backSpace, false);
  document.querySelectorAll('.inputt').forEach(function(item) {
    item.addEventListener('click', processClick, false);
  });
  document.getElementById('equals').addEventListener('click', calculateAndShowResult, false);
}

function reduceFontSize() {
  document.querySelectorAll('#input-display > div').forEach(function(item) {
    item.style.fontSize = '0.7em';
  });
}

function enlargeFontSize() {
  document.querySelectorAll('#input-display > div').forEach(function(item) {
    item.style.fontSize = '0.85em';
  });
}

function clearAll(idArr) {
  idArr.forEach(function(item) {
    document.getElementById(item).textContent = '';
  })
  if (result !== '') { //if (result !== '') rather than if (result), to account for when result equals 0
    document.getElementById("outputt").textContent = '';
  }
}

function clearAllAndInput() {
  clearAll(idArr);
  input = '';
  currOperand = '';
  result = '';
  if (currFontSize === 'small') {
    enlargeFontSize();
    currFontSize = 'big';
  }
}

function createInputArr() {
  let inputArr = [];
  if (input) {
    let inputted; //needed to determine if there's a value after the last operator
    let indexx = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] in operations && i > indexx && input[i - 1] !== 'e') { 
        //2nd condition to address negative operands, 3rd condition to address exponential operands
        inputArr.push(input.slice(indexx, i));
        inputArr.push(input[i]);
        indexx = i + 1;
        inputted = input.slice(indexx);
      }
    }
    if (inputted !== '') {
      inputArr.push(input.slice(indexx)); //adds the value after the last operator if there's one
    }
  }
  return inputArr;
}

function shiftInputValues(inputArr, position, countt) {
  document.getElementById(idArr[countt]).textContent = inputArr[position + 1];
  countt++;
  document.getElementById(idArr[countt]).textContent = inputArr[position];
  countt++;
  return countt;
}

function backSpace() {
  if (input) {
    let computedLen, countt;
    
    if (input[input.length - 1] in operations && currOperand === '') {  
      clearAll(idArr);
      input = input.slice(0, input.length - 1);
      let inputArr = createInputArr();
      computedLen = inputArr.length;
      countt = 0;
      let indexx;
      for (let i = computedLen - 1; i >= 0; i--) {
        if (inputArr[i] in operations && countt < 6) {
          indexx = i;
          countt = shiftInputValues(inputArr, i, countt);
        }
      }
      if (computedLen <= 7) {
        document.getElementById(idArr[countt]).textContent = inputArr[0];
      } else {
        document.getElementById(idArr[countt]).textContent = inputArr[indexx - 1];
      }
      currOperand = inputArr[computedLen - 1];
      if (computedLen > 6) {
        isOperandCounter4SixOrMore = true; 
        // so that when values overflow the input fields and an operator is removed, numbers can be added to the operand at idArr[0] i.e,the operand preceding the deleted operator, provided the operand's length is less than 8 or 9
      } 
    } else {
      let inputArr = createInputArr();
      computedLen = inputArr.length; //note that here inputArr includes the value to be removed
      let clrIndex = inputArr.length - 1;
      let clrIndexLen = inputArr[clrIndex].length;
      if (clrIndexLen > 1) {
        input = input.slice(0, input.length - 1);
        inputArr[clrIndex] = inputArr[clrIndex].slice(0, clrIndexLen - 1);
        if (currFontSize === 'small') {
          let enlargeFont = true;
          for (let j = 0; j < computedLen; j++) {
            if (inputArr[j].length > 7) {
              enlargeFont = false;
              break;
            }
          }
          if (enlargeFont) {
            enlargeFontSize();
            currFontSize = 'big';
          }
        }
        document.getElementById(idArr[0]).textContent = inputArr[clrIndex];
        currOperand = inputArr[clrIndex];
        if (computedLen > 6) {
          isOperandCounter4SixOrMore = true; 
          //so that when values overflow the input fields, numbers can be added to the same operand from which a value was removed, provided the operand's length is less than 8 or 9
        }
      } else {
        input = input.slice(0, input.length - 1);
        currOperand = '';
        isOperandCounter4SixOrMore = false;
        //so that when values overflow the input fields, numbers aren't added to the operator at idArr[0] i.e, the operator preceding the deleted operated, since isOperandCounter4SixOrMore would have previously been assigned the value true
        
        clearAll(idArr);
        if (input) {
          document.getElementById(idArr[0]).textContent = inputArr[clrIndex - 1]; //starts after operand to be removed
          countt = 1; //begins at idArr[1] since idArr[0] has just been filled
          for (let k = clrIndex - 2; k >= 0; k--) {
            if (inputArr[k] in operations && countt < 6) {
              countt = shiftInputValues(inputArr, k, countt);
            }
          }
          if (computedLen <= 7) {
            document.getElementById(idArr[countt]).textContent = inputArr[0];
          }
        }
      }
    }
  }  
}

function operatorShift(val, counter) {
  if (counter <= 7) {
    for (let i = counter - 1; i >= 2; i--) {
      document.getElementById(idArr[i]).textContent = document.getElementById(idArr[i-1]).textContent.replace(/[\t\n\r ]+/g, '');
    }
    let A1 = document.getElementById(idArr[0]).textContent.replace(/[\t\n\r ]+/g, '');
    if ((A1.indexOf('-') > -1 && A1.length >= 2) || (A1.indexOf('-') === -1 && A1.length >= 1)) {
      document.getElementById(idArr[1]).textContent = A1;
      document.getElementById(idArr[0]).textContent = val;
    } else {
      val = '';
    }
  }
  return val;
}

function showOperator(val, counter) {
  if (document.getElementById(idArr[counter++]).textContent.replace(/[\t\n\r ]+/g, '')) {
    if (counter < 7) {
      if (!(document.getElementById(idArr[counter++]).textContent.replace(/[\t\n\r ]+/g, ''))) {
        val = operatorShift(val, counter);
      } else {
        val = showOperator(val, counter);
      }
    } else if (counter === 7){
      if (!(document.getElementById(idArr[0]).textContent.replace(/[\t\n\r ]+/g, '') in operations)) {
        //so that subsequent shifting after input fields are filled, do not allow consecutive inputs of operators
        val = operatorShift(val, counter);
      } else {
        val = '';
      }
    }
  } else { //so that while there are still empty input fields, operators can't be inputted if the preceeding field isn't filled by an operand
    val = '';
  }
  return val;
}

function populateEmptyA1(val, counter) {
  if (val === '\u2212') {
    val = '-'; //coz Number() can't convert numbers preceded by '\u2212'
  } else {
    if (val === '\u002e') {
      val = '0' + val;
    }
  }
  for (let i = counter - 1; i > 0; i--) {
      document.getElementById(idArr[i]).textContent = document.getElementById(idArr[i-1]).textContent.replace(/[\t\n\r ]+/g, '');
    }
  document.getElementById(idArr[0]).textContent = val;
  return val;
}

function addOperandToA1(val) {
  if (!(val in operations)) {
    if (val === '\u002e') {
      if (currOperand.indexOf('\u002e') === -1) {
        if (currOperand === '-') {
          val = '0' + val;
        }
        document.getElementById(idArr[0]).textContent += val;
      } else {
        val = '';
      }
    } else {
      if (currOperand === '0') {
        if (val !== '0') {
          input = input.slice(0, input.length - 1);
          currOperand = ''; //val will be added subsequently by getAndShowValue()
          document.getElementById(idArr[0]).textContent = val;
        } else {
          val = '';
        }
      } else {
        document.getElementById(idArr[0]).textContent += val;
      }
    }
  } else {
    val = '';
  }
  return val;
}

function showOperand(val, counter) {
  if (counter < 6) {
    if (!(document.getElementById(idArr[counter++]).textContent.replace(/[\t\n\r ]+/g, ''))) {
      val = populateEmptyA1(val, counter);
    } else {
      if (!(document.getElementById(idArr[counter++]).textContent.replace(/[\t\n\r ]+/g, ''))) {
        val = addOperandToA1(val);
      } else {
        val = showOperand(val, counter);
      }
    }
  } else if (counter === 6){
    if (!isOperandCounter4SixOrMore) {
      counter++;
      val = populateEmptyA1(val, counter);
      isOperandCounter4SixOrMore = true;
    } else {
      val = addOperandToA1(val);
    }
  }
  return val;
}

function processClick() {
  let nodeList = this.childNodes;
  let val = '';
  nodeList.forEach(function(elem) {
    val += elem.textContent.replace(/[\t\n\r ]+/g, ''); //removes whitespaces
  })
  getAndShowValue(val);
}

function getAndShowValue(val) {
  if (window.outerWidth >= 360) { //coz operand range won't work for devices with a width of less than 360
    if (result !== '') {
      clearAll(idArr);
      if (result !== 'ERROR!' && val in operations) {
        if (result.toString().length > 7 && currFontSize === 'big') {
          reduceFontSize();
          currFontSize = 'small';
        } else if (result.toString().length <= 7 && currFontSize === 'small') {
          enlargeFontSize();
          currFontSize = 'big';
        }
        document.getElementById(idArr[0]).textContent = displayy;
        input += result;
        currOperand = result;
      }
      result = '';
    }
    
    let counter = 0;
    if (val in operations && currOperand !== '' && currOperand !== '-') {
      //2nd and 3rd conditions ensure that the preceding value isn't an operator
      if (currOperand[currOperand.length - 1] === '\u002e') {
        document.getElementById(idArr[0]).textContent = currOperand + '0'; 
        //adds 0 to preceding operand if it has no number after the decimal point
        input += '0';
      }
      currOperand = '';
      isOperandCounter4SixOrMore = false;
      //so that when all input fields are filled, numbers inputted after an operator are displayed on the subsequent input field i.e, they are not appended to the operator
      val = showOperator(val, counter);

    } else if ((val === '\u2212') || (!(val in operations))) {
      if ((currOperand[0] === '-' && currOperand.indexOf('\u002e') > -1 && currOperand.length < 11)
      || (currOperand[0] === '-' && currOperand.length < 10)
      || (currOperand.indexOf('\u002e') > -1 && currOperand.length < 10)
      || (currOperand.length < 9)) {
        if (currOperand.length === 7 && currFontSize === 'big') {
          //7 coz when a decimal point is added to an operand of length 7, its length grows to 9 not 8 coz 0 will be automatically added after the decimal point, if an operator is inputted subsequently ie 7 is applicable whether there's a decimal point or not 
          reduceFontSize();
          currFontSize = 'small';
        }
        val = showOperand(val, counter);
        currOperand += val;
      } else {
        val = '';
      }
    } else {
      val = '';
    }
    input += val;
  }
}

function calculate(inputArr, operator1, operator2) {
  let computed;
  for (let i = 0; i < inputArr.length; i++) {
    if (inputArr[i] === operator1 || inputArr[i] === operator2) {
      computed = operations[inputArr[i]](+inputArr[i - 1], +inputArr[i + 1]);
      inputArr.splice(i - 1, 3, computed);
      i--;
    }
  }
}

function calculateAndShowResult() {
  if (result === '') { //if (result === '') rather than if (!result), to account for when result equals 0
    let inputArr = createInputArr();
    if ((inputArr.length >= 3) && (inputArr.length % 2)) {
      if (inputArr.indexOf('\u00d7') > -1 || inputArr.indexOf('\u00f7') > -1) {
        calculate(inputArr, '\u00d7', '\u00f7');
      }
      if (inputArr.indexOf('\u002b') > -1 || inputArr.indexOf('\u2212') > -1) {
        calculate(inputArr, '\u002b', '\u2212');
      }
      if (inputArr.length === 1) {
        result = inputArr[0];
        if (result.toString().length > 13) {
          displayy = result.toExponential();
          if (displayy.length > 10) {
            displayy = result.toExponential(7);
          }
        } else if (result === Infinity) {
          displayy = '∞';
        } else if (result === -Infinity) {
          displayy = '-∞';
        } else if (isNaN(result)) {
          displayy = 'ERROR!';
        } else {
          displayy = result;
        }
        document.getElementById("outputt").textContent = displayy;
        input = '';
        currOperand = '';
      }
    }
  }
}

function processKeyInput(e) {
  let val;
  e = e || event; // for IE
  keyMap[e.key] = e.type === 'keydown';
  if (keyMap[e.key] === false) { // on keyup
    if (e.key === '/' || e.key === 'Divide') {
      val = '\u00f7';
    } else if (e.key === '*' || e.key === 'Multiply') {
      val = '\u00d7';
    } else if (e.key === '-' || e.key === 'Subtract') {
      val = '\u2212';
    } else if (e.key === '+' || e.key === 'Add') {
      val = '\u002b';
    } else if (pressedValue.indexOf(e.key) > -1) {
      val = e.key;
    } else {
      val = '';
    }
    if (val) {
      if (val === 'Delete' || val === 'Del') {
        clearAllAndInput();
      } else if (val === 'Backspace') {
        backSpace();
      } else if ((val === '=') || (val === 'Enter')) {
        calculateAndShowResult();
      } else {
        getAndShowValue(val);
      }
    }
    keyMap = {};
  }
}

