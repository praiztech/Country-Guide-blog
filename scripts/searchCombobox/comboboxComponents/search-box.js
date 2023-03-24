function clearSearchValue(evt) {
  const comboboxInput = evt.currentTarget.previousElementSibling;
  comboboxInput.value = ''; // sets search value rendered in the DOM
  // distinguishes programmatic search value mutation from mutation triggered by user input
  comboboxInput.setAttribute('data-programmatic-value-mutation', 'true');
  comboboxInput.setAttribute('value', comboboxInput.value); // triggers mutation observer
}

function showClearButton(clearButton) {
  clearButton.addEventListener('click', clearSearchValue);
  clearButton.removeAttribute('hidden');
}

function hideClearButton(clearButton) {
  clearButton.setAttribute('hidden', 'true');
  clearButton.removeEventListener('click', clearSearchValue);
}

function handleClearButtonVisibility(comboboxInput) {
  const {value: {length: searchValueLength}, nextElementSibling: clearButton} = comboboxInput;
  if (searchValueLength > 0) {
    clearButton.hasAttribute('hidden') && showClearButton(clearButton);
  } else {
    !clearButton.hasAttribute('hidden') && hideClearButton(clearButton);
  }
}

function handlePointerDisplayClearButton(evt) {
  const inputBox = evt.target;
  const focusedComboboxElement = inputBox.getRootNode().activeElement;
  if (
    // ensures single pointer interaction on multi-touch devices
    !evt.isPrimary ||
    // clear button visibility already handled by combobox input's focus and input events
    inputBox.contains(focusedComboboxElement)
  ) return;
  switch (evt.type) {
    case 'pointerenter':
      handleClearButtonVisibility(inputBox.firstElementChild);
      break;
    case 'pointerleave':
      hideClearButton(inputBox.lastElementChild);
      break;
  }
}

// makes search label transparent when a value is typed into combobox input, preventing label from obscuring typed value
function handleSearchLabelVisibility(comboboxInput) {
  const {value: {length: searchValueLength}, labels: [searchLabel]} = comboboxInput;
  if (searchValueLength > 0) {
    searchLabel.hasAttribute('data-visible') && searchLabel.removeAttribute('data-visible');
  } else {
    !searchLabel.hasAttribute('data-visible') && searchLabel.setAttribute('data-visible', 'true');
  }
}

export { hideClearButton, handleClearButtonVisibility, handlePointerDisplayClearButton, handleSearchLabelVisibility };
