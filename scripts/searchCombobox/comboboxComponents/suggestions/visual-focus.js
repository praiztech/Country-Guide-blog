let currFocusedOption = null;

// sets currently focused option
function handleCurrOptionFocus(comboboxInput, option = null) {
  const lastFocusedOption = currFocusedOption;
  currFocusedOption = option;
  if (lastFocusedOption !== null) lastFocusedOption.setAttribute('aria-selected', 'false');

  if (currFocusedOption === null) {
    comboboxInput.removeAttribute('aria-activedescendant');
  } else {
    currFocusedOption.setAttribute('aria-selected', 'true');
    comboboxInput.setAttribute('aria-activedescendant', currFocusedOption.id);
  }
}

function handleSuggestionsListScrolling() {
  const 
  suggestionsList = currFocusedOption.parentElement,
  currFocusedOptionTop = currFocusedOption.offsetTop,
  currFocusedOptionBottom = currFocusedOptionTop + currFocusedOption.offsetHeight,
  suggestionsListFullHeight = suggestionsList.scrollHeight,
  suggestionsListVisibleHeight = suggestionsList.clientHeight,
  suggestionsListTop = suggestionsList.scrollTop,
  suggestionsListVisibleBottom = suggestionsListTop + suggestionsListVisibleHeight
  ; // micro-optimization?

  if (!(suggestionsListFullHeight > suggestionsListVisibleHeight)) return; // there's no scrolled-out part of the list

  // the currently focused option is hidden, at least partially, above the visible top of the suggestions list
  if (currFocusedOptionTop < suggestionsListTop) { 
    currFocusedOption.scrollIntoView(true);
  // the currently focused option is hidden, at least partially, below the visible bottom of the suggestions list
  } else if (currFocusedOptionBottom > suggestionsListVisibleBottom) {
    currFocusedOption.scrollIntoView(false);
  }
}

// removes the visual focus indicator from the suggestions list
function removeVisualFocus(comboboxInput) {
  handleCurrOptionFocus(comboboxInput);
}

// adds the visual focus indicator to the suggestions list
function addVisualFocus(comboboxInput, option2Focus) {
  handleCurrOptionFocus(comboboxInput, option2Focus);
  handleSuggestionsListScrolling();
}

function handleKeypressAddVisualFocus(key, suggestionsList, comboboxInput) {
  switch (key) {
    case 'ArrowDown':
      const firstOption = suggestionsList.firstElementChild;
      const nextOption = currFocusedOption && currFocusedOption.nextElementSibling;
      /*
       * if there's no currently focused option or the currently focused option is the last on the list, set visual focus * on the first option else set visual focus on the option ffg the currently focused option
       */
      (
        (currFocusedOption === null || nextOption === null) ?
        addVisualFocus(comboboxInput, firstOption) :
        addVisualFocus(comboboxInput, nextOption)
      );
      break;
    case 'ArrowUp':
      const lastOption = suggestionsList.lastElementChild;
      const precedingOption = currFocusedOption && currFocusedOption.previousElementSibling;
      /*
       * if there's no currently focused option or the currently focused option is the first on the list, set visual focus
       * on the last option else set visual focus on the option b4 the currently focused option
       */
      (
        (currFocusedOption === null || precedingOption === null) ?
        addVisualFocus(comboboxInput, lastOption) :
        addVisualFocus(comboboxInput, precedingOption)
      );
      break;
  }
}

function handlePointerDisplayVisualFocus(evt) {
  if (!evt.isPrimary) return; // ensures single pointer interaction on multi-touch devices
  const comboboxInput = evt.target.getRootNode().getElementById('combobox-input');
  switch (evt.type) {
    case 'pointerenter':
      addVisualFocus(comboboxInput, evt.target);
      break;
    case 'pointerleave':
      removeVisualFocus(comboboxInput);
      break;
  }
}

export { removeVisualFocus, handleKeypressAddVisualFocus, handlePointerDisplayVisualFocus };
