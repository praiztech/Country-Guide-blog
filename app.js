const rootElem = document.documentElement;

document.addEventListener('DOMContentLoaded', () => {
  let theme = localStorage.getItem('theme');
  if (theme === null) {
    //check if dark mode is activated as OS/platform preference
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.getElementById(theme).checked = true;
  rootElem.className = theme;
});

const themeSwitch = document.querySelector('[role="radiogroup"]');

themeSwitch.addEventListener('pointerenter', highlightCtrls);
themeSwitch.addEventListener('pointerleave', highlightCtrls);
themeSwitch.addEventListener('change', () => {
  let theme = document.querySelector('input[name="theme"]:checked').value;
  rootElem.className = theme;
  
  //save user theme choice
  try {
    localStorage.setItem('theme', theme);
  } catch {}
});

const shtcutOpenBtn = document.querySelector('.shtcut-open-btn');

shtcutOpenBtn.addEventListener('pointerenter', highlightCtrls);
shtcutOpenBtn.addEventListener('pointerleave', highlightCtrls);
shtcutOpenBtn.addEventListener('click', showShortcut);

function highlightCtrls(evt) {
  if (!evt.isPrimary) return; //ensure single pointer interaction on multi-touch devices 
  switch (evt.type) {
    case 'pointerenter':
      evt.currentTarget.classList.add('enter');
      break;
    case 'pointerleave':
      evt.currentTarget.classList.remove('enter');
      if (evt.currentTarget === document.activeElement || 
          evt.currentTarget.contains(document.activeElement)) { //for theme switch
        let focusedElem = document.activeElement;
        focusedElem.blur(); //remove focus style, when added on pointer devices by btn click
      }
      break;
  }
}

function showShortcut() {
  document.body.insertAdjacentHTML('beforeend', 
  `<div id="shortcut" role="dialog" aria-modal="true" aria-labelledby="modal-title" class="shortcut" tabindex="-1">
  <h2 id="modal-title">Keyboard Shortcuts <span class="at-only">Dialog</span></h2>
  <p>You can use corresponding keys on the keyboard to activate buttons in the calculator. <span class="at-only">For example,</span><span aria-hidden="true">E.g.,</span> press <kbd class="key">1</kbd> on the keyboard to activate <span class="key">1</span> in the calculator.</p>
  <p><strong>Note!</strong> To activate <span class="key">×</span> calculator button, press <kbd class="key">*</kbd> on the keyboard. To activate <span class="key">÷</span> calculator button, press <kbd class="key">/</kbd>. To activate <span class="at-only">backspace</span><span aria-hidden="true" class="key">&#9003;</span> calculator button, press <kbd class="key">backspace</kbd> or <kbd class="key">delete</kbd>. To activate <span class="key">CLEAR</span> calculator button, press <kbd class="key">clear</kbd> or <kbd class="key">C</kbd>.</p>
  <button type="button" class="shtcut-cloz-btn">Close</button>
  </div>`);

  //for screen readers that dont support aria-modal
  const pgContent = document.querySelector('.content');
  pgContent.setAttribute('aria-hidden', 'true');
  pgContent.inert = true;

  let overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const shortcut = document.getElementById('shortcut');
  shortcut.before(overlay);

  requestAnimationFrame(() => { //ensure shortcut is in DOM b4 performing these actions
    const shtcutClozBtn = document.querySelector('.shtcut-cloz-btn');
    shtcutClozBtn.addEventListener('pointerenter', highlightCtrls);
    shtcutClozBtn.addEventListener('pointerleave', highlightCtrls);
    shtcutClozBtn.addEventListener('click', (evt) => {
      handleShtcutClicks();
      if (!evt.detail) { //check that click was from keyboard
      shtcutOpenBtn.focus(); //move focus to shtcut open btn 2 orient keyboard and screen reader users
      }
    });
    overlay.addEventListener('click', () => {
      handleShtcutClicks();
    });
    shortcut.addEventListener('keydown', (evt) => {
      if (evt.repeat) return; //prevent multiple keydown handling on a long-key-press: for users with limited fine-motor control
      switch (evt.key) {
        case 'Escape':
          handleShtcutClicks();
          shtcutOpenBtn.focus();
          break;
        case 'Tab':
          evt.preventDefault();
          shtcutClozBtn.focus(); //trapped focus
          break;
      }
    });
    shortcut.focus();
  });

  function handleShtcutClicks() {
    shortcut.remove();
    overlay.remove();
    pgContent.removeAttribute('aria-hidden');
    pgContent.removeAttribute('inert');
  }
}

const keypad = document.querySelector('.keypad');

keypad.addEventListener('keydown', handleKeypadPress);
keypad.addEventListener('keyup', handleKeypadPress);

const keypadBtns = keypad.querySelectorAll(':scope > button');

keypadBtns.forEach((btn) => {
  btn.addEventListener('pointerenter', highlightCtrls);
  btn.addEventListener('pointerleave', highlightCtrls);
  btn.addEventListener('click', processClick);
});

//visually depicts button click for keyboard users
function handleKeypadPress(evt) { 
  switch (evt.type) {
    case 'keydown':
      if (evt.repeat) return;
      if (evt.key === 'Enter' || evt.key === ' ') {
        document.activeElement.classList.add('active');
      }
      break;
    case 'keyup':
      if (evt.key === 'Enter' || evt.key === ' ') {
        document.activeElement.classList.remove('active');
      }
      break;
  }
}

const output = document.querySelector('output');
const srOutput = output.querySelector('span.at-only');
const visibleOutput = output.querySelector('span.visible');

const operators = ['*', '/', '+', '-']
const invalid1stOperands = ['*', '/', '+', '%'];
let computation = [],
    computationResult = null,
    computeData = '',
    dataCount = 0,
    dataFont = 'big',
    resultFont = 'big',
    backspaced = false,
    permittedInput = null,
    operatorFilled,
    operandIndex,
    lastDisplayed;

function processClick(evt) {
  let val = evt.currentTarget.dataset.key;
  switch (val) {
    case 'Backspace':
      backSpace();
      break;
    case 'Clear':
      resetCalculator();
      break;
    case '=':
      computeAndShowResult();
      break;
    default:
      identifyAndProcessInput(val);
      break;
  }
}

function identifyAndProcessInput(val) {
  if (computationResult !== null) { //preceding click was to calculate result and the result is still displayed
    if (lastDisplayed === 'ERROR!') return; //calculator must be reset after error result b4 data input is permissible
    identifyInputOnResult(val);
  } else if (backspaced) {
    identifyInputAfterBackspace(val);
  } else {
    identifyInputDefaults(val);
  }

  processInput(val);
}

function identifyInputOnResult(val) {
  if (operators.includes(val)) {
    //ensures that last displayed result is modified to a format appropriate 4 display in a data field
    lastDisplayed = processResultAsInput(); 
    if ((lastDisplayed.length >= 5 && dataFont === 'big') || 
        (lastDisplayed.length < 5 && dataFont === 'small')
        ) resizeDataFont();
    permittedInput = 'operator';
  } else {
    if (dataFont === 'small') resizeDataFont(); //change to its default value
    permittedInput = 'operand';
    operandIndex = 1;
  }

  clearData();
  visibleOutput.textContent = '';
  computationResult = null;
  dataCount = 0;
  if (resultFont === 'small') resizeResultFont();
  backspaced = false; //incase data was deleted just b4 result computation
}

function processResultAsInput() {
  computeData = computationResult.toString(); //result is used 'as-is' in computation bt modified 4 display
  operatorFilled = false;
  
  if (lastDisplayed.length <= 9) return lastDisplayed;
  
  let decimalIndex = lastDisplayed.indexOf('.');
  if (decimalIndex > -1 || decimalIndex <= 6) { //6 to allow 4 at least one digit after '.' in non-exponential values
    //8 instead of 9 so '…' can be appended
    return (lastDisplayed.indexOf('e') === -1) ? (lastDisplayed.slice(0, 8 - lastDisplayed.length) + '…') : truncResultStr(lastDisplayed, 8, true);
  } else { //eg 9000000000, 1234567.912345
    let expResult = computationResult.toExponential();
    return (expResult.length <= 9) ? expResult : truncResultStr(expResult, 8, true);
  }
}

function truncResultStr(resultStr, strLimit, resultAsInput=false) {
  let extraDigits = resultStr.length - strLimit;
  let decimalHalf = resultStr.slice(0, resultStr.indexOf('e'));
  let truncDecimalHalf = decimalHalf.slice(0, decimalHalf.length - extraDigits);
  if (truncDecimalHalf.endsWith('.')) truncDecimalHalf.slice(0, -1); //discard trailing '.'
  if (resultAsInput) truncDecimalHalf += '…';
  return resultStr.replace(decimalHalf, truncDecimalHalf);
}

function resizeDataFont() {
  //getComputedStyle ensures that initial declaration in stylesheet can also be retrieved
  const rootPropVal = propName => getComputedStyle(rootElem).getPropertyValue(propName).trim();
  const rootStyle = rootElem.style;
  rootStyle.setProperty('--data-base-font-size', 
                        (rootPropVal('--data-base-font-size') === '1.95rem') ? '1.25rem' : '1.95rem');
  rootStyle.setProperty('--data-sec-font-size',
                        (rootPropVal('--data-sec-font-size') === '2.25rem') ? '1.5rem' : '2.25rem');
  rootStyle.setProperty('--data-big-font-size',
                        (rootPropVal('--data-big-font-size') === '2.75rem') ? '1.95rem' : '2.75rem');
  dataFont = (dataFont === 'big') ? 'small' : 'big';
}

function clearData() {
  let counter = (dataCount <= 7) ? dataCount : 7;
  for (let i = 1; i <= counter; i++) {
    document.getElementById(i).textContent = '';
  } 
}

function identifyInputAfterBackspace(val) {
  backspaced = false;

  //if backspace b4 current input cleared visible output, current input must be a char of the type deleted ie permitted input doesnt change
  if ((permittedInput === 'operand' && operandIndex === 1) ||
      (permittedInput === 'operator' && !operatorFilled)
    ) return;
  
  identifySubsequentInputs(val);
}

function identifySubsequentInputs(val) {
  if (computeData === '-') {
    permittedInput = 'operand'; //disallow an operator after an operand dt contains only '-'
  } else {
    permittedInput = operators.includes(val) ? 'operator' : 'operand';
  }
}

function identifyInputDefaults(val) {
  if (permittedInput === null) { //first click to enter computation data
    srOutput.textContent = '';
    permittedInput = 'operand';
    operandIndex = 1;
  } else if (permittedInput === 'operator' && operatorFilled) { //last displayed char is an operator
    permittedInput = 'operand';
    operandIndex = 1;
  } else if (permittedInput === 'operand' && operandIndex !== 1) { //last displayed char is an operand
    identifySubsequentInputs(val);
  }
}

function processInput(val) {
  switch (permittedInput) {
    case 'operand':
      if (operandIndex === 1) {
        show1stOperand(val);
      } else {
        showNextOperand(val);
      }
      break;
    case 'operator':
      showOperator(val);
      break;
  }
}

function show1stOperand(val) {
  if (invalid1stOperands.includes(val)) return;

  if (dataCount) movePrevData();

  let firstOperand;
  if (val === '.') {
    firstOperand = '0.';
    operandIndex = 3;
  } else {
    firstOperand = val;
    operandIndex = 2;
  }
  showVal(firstOperand);
  operatorFilled = false;
}

function showNextOperand(val) {
  if ((operators.includes(val)) ||
      (computeData.length === 9) || //an operand should have 9 chars max
      (computeData.endsWith('%')) || //disallow any value after '%'
      (computeData === '-' && val === '%') ||
      (computeData.endsWith('.') && val === '%') ||
      (computeData.includes('.') && val === '.') ||
      (computeData === '0' && val === '0')
    ) return;
  
  let nxtOperand;
  if (computeData === '-' && val === '.') {
    nxtOperand = '0.';
    operandIndex = 4;
  } else if (computeData === '0' && Number.isInteger(+val)) { //replace '0' with integer
    computeData = ''; //discard '0'
    nxtOperand = val;
    operandIndex = 2; 
  } else {
    nxtOperand = val;
    operandIndex += 1;
  }
  if (computeData.length === 5 && dataFont === 'big') resizeDataFont();
  showVal(nxtOperand);
}

function showOperator(val) {
  if (!operators.includes(val)) return; 

  if (computeData.endsWith('.')) {
    computeData = computeData.slice(0, -1); //discard trailing '.'
    lastDisplayed = computeData;
  }
  movePrevData();
  showVal(val);
  operatorFilled = true;
}

function showVal(value) {
  let displayVal;
  if (backspaced) {
    computeData = displayVal = value;
  } else {
    computeData += value;
    switch (permittedInput) {
      case 'operand':
        displayVal = computeData;
        break;
      case 'operator':
        displayVal = setOperatorSymbol(value);
        break;
    }
  }
  visibleOutput.textContent = displayVal;
  lastDisplayed = displayVal;
}

function setOperatorSymbol(symbol) {
  switch (symbol) {
    case '*':
      return '×';
    case '/':
      return '÷';
    default:
      return symbol;
  }
}

function movePrevData() {
  if (computeData === '') return; //data has been deleted

  if (dataCount) shiftPrevData();
  document.getElementById('1').textContent = lastDisplayed;
  computation.push(computeData);
  computeData = ''; //allows subsequent concatenation of clicked values
  dataCount += 1;
}

function shiftPrevData() {
  let counter = (dataCount <= 6) ? dataCount : 6;
  for (let i = counter; i > 0; i--) {
    document.getElementById(i+1).textContent = document.getElementById(i).textContent;
  }
}

function backSpace() {
  if ((computeData === '') || //no data to delete
    (computationResult !== null) //a computation result is being displayed
    ) return; 

  backspaced = true;
  if (permittedInput === 'operand') {
    operandIndex = (operandIndex === 1) ? 1 : computeData.endsWith('0.') ? operandIndex - 2 : operandIndex - 1;
    if (operandIndex <= 6 && dataFont === 'small') resizeDataFont();
  } else {
    operatorFilled = false;
  }
  let editedVal;
  if (computeData.endsWith('0.')) {
    editedVal = computeData.slice(0, -2);
  } else {
    editedVal = computeData.slice(0, -1);
  }
  showVal(editedVal);
}

function computeAndShowResult() {
  if ((computationResult !== null) || 
      (computation.length < 2) || //2 instead of 3 coz data would be added subsequently by movePrevData
      operators.includes(computeData) //ie last data input was an operator or an operand dt contains only '-'
    ) return; 
  
  if (computeData.endsWith('.')) { 
    computeData = computeData.slice(0, -1); //discard trailing '.' in last data (operand) input
    lastDisplayed = computeData;
  }
  movePrevData();
  findAndCalculate('*', '/');
  findAndCalculate('+', '-');
  computationResult = computation[0];
  
  let displayVal;
  switch (computationResult) {
    case Infinity:
      displayVal = '∞';
      break;
    case -Infinity:
      displayVal = '-∞';
      break;
    default:
      if (Number.isNaN(computationResult)) {
        displayVal = 'ERROR!';
      } else {
        let resultStr = computationResult.toString();
        displayVal = (resultStr.length <= 9) ? resultStr : approxResult(resultStr);
      }
      break;
  }

  clearData();
  if (displayVal.length >= 10 && resultFont === 'big') resizeResultFont();
  visibleOutput.textContent = displayVal;
  lastDisplayed = displayVal;
  computation = [];
}

function findAndCalculate(operator1, operator2) {
  let startIndex = computation.findIndex((elem, index) => {
    if (index % 2 === 0) return false; //operators are at odd-numbered indices
    return (elem === operator1 || elem === operator2);
  });

  if (startIndex === -1) return;

  for (let i = startIndex; i < computation.length-1; i += 2) {
    if (computation[i] === operator1 || computation[i] === operator2) {
      let computed = calculate(computation[i-1], computation[i], computation[i+1]);
      computation.splice(i-1, 3, computed);
      i -= 2; //move index to account 4 deleted data
    }
  }
}

function calculate(operand1, operator, operand2) {
  let op1 = (typeof(operand1) === 'number') ? operand1 : operand1.endsWith('%') ? operand1.slice(0,-1)/100 : +operand1;
  let op2 = (typeof(operand2) === 'number') ? operand2 : operand2.endsWith('%') ? operand2.slice(0,-1)/100 : +operand2;
  switch (operator) {
    case '*':
      return op1 * op2;
    case '/':
      return op1 / op2;
    case '+':
      return op1 + op2;
    case '-':
      return op1 - op2;
  }
}

function approxResult(resultStr) {
  if ((resultStr.length <= 14) && 
      (resultStr.indexOf('e') === -1)
    ) return resultStr; //eg 1234567.91234, 123456789123, -123456789123, -123.456789123
  
  let expResult = computationResult.toExponential();
  let exponent = expResult.slice(expResult.indexOf('e') + 2); //+2 to exclude 'e+'/'e-'
  
  //4 instead of 5 so dt the decimal component, ie '.3' in -1.3e+6789, can (at a minimum) be replaced with '…' if subsequently used as computation input
  if (exponent.length > 4) return 'ERROR!'; //calculator has reached its computation limits
  
  if (expResult.length > 14) expResult = truncResultStr(expResult, 14); //eg -9.234567e+1234
  
  return expResult;
}

function resizeResultFont() {
  const rootPropVal = propName => getComputedStyle(rootElem).getPropertyValue(propName).trim();
  const rootStyle = rootElem.style;
  rootStyle.setProperty('--output-base-font-size', 
                        (rootPropVal('--output-base-font-size') === '4.95rem') ? '3.75rem' : '4.95rem');
  rootStyle.setProperty('--output-sec-font-size',
                        (rootPropVal('--output-sec-font-size') === '5.75rem') ? '4.75rem' : '5.75rem');
  resultFont = (resultFont === 'big') ? 'small' : 'big';
}

function resetCalculator() {
  if (permittedInput === null) return; //calculator has already been reset

  clearData();
  visibleOutput.textContent = '';
  srOutput.textContent = 'No Output';
  computationResult = null;
  computeData = ''; //for cases when a reset is done during data input
  permittedInput = null;
  dataCount = 0;
  backspaced = false;
  if (dataFont === 'small') resizeDataFont();
  if (resultFont === 'small') resizeResultFont();
}

document.addEventListener('keydown', handleShtcutKeys);
document.addEventListener('keyup', handleShtcutKeys);

const shtcutKeys = ['0','1','2','3','4','5','6','7','8','9','.','%','+','-','*','/','=','Backspace','Delete','Clear','C','c'];
let lastPressedKey, currKey;

function handleShtcutKeys(evt) {
  //prevent key presses targeted at specific keypad btns from (bubbling up and) activating this keyboard shortcut evt handler
  if (keypad.contains(evt.target) ||
     !shtcutKeys.includes(evt.key)
    ) return;

  switch (evt.type) {
    case 'keydown':
      if (evt.repeat) return;
      let pressedKey;
      switch (evt.key) {
        case 'C':
        case 'c':
          pressedKey = 'Clear';
          break;
        case 'Delete':
          pressedKey = 'Backspace';
          break;
        default:
          pressedKey = evt.key;
          break;
      }
      for (let btn of keypadBtns) { //used for..of instead of forEach to ensure search ends when btn is found
        if (btn.dataset.key === pressedKey) {
          evt.preventDefault();
          currKey = btn;
          if (lastPressedKey) lastPressedKey.classList.remove('enter');
          currKey.classList.add('enter');
          currKey.classList.add('active');
          break;
        }
      }
      break;
    case 'keyup':
      currKey.classList.remove('active');
      currKey.click();
      lastPressedKey = currKey;
      currKey = null; //pressed key has been processed
      break;
  }
}
