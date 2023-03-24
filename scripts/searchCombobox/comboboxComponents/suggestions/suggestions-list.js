import { findCountrySuggestions } from "./countries.js";
import { removeVisualFocus, handleKeypressAddVisualFocus, handlePointerDisplayVisualFocus } from "./visual-focus.js";

function getSuggestionsListRef(node) {
  const suggestionsWrapper = node.getRootNode().lastElementChild;
  const suggestionsListIsClosed = suggestionsWrapper.hasAttribute('hidden');
  const suggestionsList = suggestionsWrapper.lastElementChild;
  return [suggestionsList, suggestionsListIsClosed];
}

function createSuggestedOptions(suggestionsArray) {
  const suggestedOptions = new DocumentFragment();
  for (let i = 0; i < suggestionsArray.length; i++) {
    const suggestedOption = document.createElement('li');
    suggestedOption.id = `option-${i+1}`;
    suggestedOption.setAttribute('role', 'option');
    suggestedOption.setAttribute('aria-selected', 'false');
    suggestedOption.textContent = suggestionsArray[i];
    // added to each suggested option instead of suggestions list to prevent scrollbar from triggering visual focus
    suggestedOption.addEventListener('pointerenter', handlePointerDisplayVisualFocus);
    suggestedOption.addEventListener('pointerleave', handlePointerDisplayVisualFocus);
    // pointerdown and pointerup instead of click evt to prevent combobox input losing focus
    suggestedOption.addEventListener('pointerdown', (evt) => {
      evt.preventDefault(); // prevents suggested option from gaining focus
    });
    suggestedOption.addEventListener('pointerup', (evt) => {
      handleSuggestionsListClick(evt.target); // to support WCAG 2.5.2
    });
    suggestedOptions.append(suggestedOption);
  }
  return suggestedOptions;
}

function openSuggestionsList(suggestionsList, suggestionsArray, comboboxInput) {
  const suggestionsWrapper = suggestionsList.parentElement;
  suggestionsList.append(createSuggestedOptions(suggestionsArray));
  suggestionsWrapper.removeAttribute('hidden');
  comboboxInput.setAttribute('aria-expanded', 'true');
  comboboxInput.setAttribute('aria-controls', suggestionsList.id);
  setTimeout(() => suggestionsWrapper.previousElementSibling.dispatchEvent(
    new CustomEvent('announce', {
      detail: `${suggestionsArray.length} suggestion${suggestionsArray.length > 1 ? 's' : ''} available`
    })
  ), 0);
}

function modifySuggestionsList(suggestionsList, suggestionsArray, comboboxInput) {
  const suggestionsWrapper = suggestionsList.parentElement;
  suggestionsWrapper.setAttribute('hidden', 'true');
  /*
   * redirects "focus" to combobox input, if a suggested option, about to be removed, has visual focus
   * thus resetting the currently focused option (to null) and removing combobox input aria-activedescendant
   * attribute
   */
  comboboxInput.hasAttribute('aria-activedescendant') && removeVisualFocus(comboboxInput);
  while (suggestionsList.childElementCount > 0) suggestionsList.lastElementChild.remove();
  suggestionsList.append(createSuggestedOptions(suggestionsArray));
  suggestionsWrapper.removeAttribute('hidden');
  setTimeout(() => suggestionsWrapper.previousElementSibling.dispatchEvent(
    new CustomEvent('announce', {
      detail: `${suggestionsArray.length} suggestion${suggestionsArray.length > 1 ? 's' : ''} available`
    })
  ), 0);
}

function closeSuggestionsList(suggestionsList, comboboxInput) {
  const suggestionsWrapper = suggestionsList.parentElement;
  suggestionsWrapper.setAttribute('hidden', 'true');
  comboboxInput.hasAttribute('aria-activedescendant') && removeVisualFocus(comboboxInput);
  while (suggestionsList.childElementCount > 0) suggestionsList.lastElementChild.remove();
  comboboxInput.setAttribute('aria-expanded', 'false');
  comboboxInput.removeAttribute('aria-controls');
  setTimeout(() => suggestionsWrapper.previousElementSibling.dispatchEvent(
    new CustomEvent('announce', {detail: ''})
  ), 0);
}

function handleSuggestionsListDisplay(comboboxInput) {
  const [suggestionsList, suggestionsListIsClosed] = getSuggestionsListRef(comboboxInput);
  const suggestionsArray = findCountrySuggestions(comboboxInput.value);
  if (suggestionsArray.length === 0) { // no suggested countries
    !suggestionsListIsClosed && closeSuggestionsList(suggestionsList, comboboxInput);
  } else {
    (
      suggestionsListIsClosed ?
      openSuggestionsList(suggestionsList, suggestionsArray, comboboxInput) :
      modifySuggestionsList(suggestionsList, suggestionsArray, comboboxInput)
    )
  }
}

function handleSuggestionsListClick(selectedOption, triggerMutationObserver = true) {
  const selectedValue = selectedOption.textContent;
  const comboboxInput = selectedOption.getRootNode().getElementById('combobox-input');
  comboboxInput.value = selectedValue; // sets search value rendered in the DOM
  if (triggerMutationObserver) {
    // distinguishes programmatic search value mutation from mutation triggered by user input
    comboboxInput.setAttribute('data-programmatic-value-mutation', 'true');
    comboboxInput.setAttribute('value', comboboxInput.value); // triggers mutation observer
  }
}

function handleSuggestionsListKeyDown(evt) {
  const comboboxInput = evt.target;
  const [suggestionsList, suggestionsListIsClosed] = getSuggestionsListRef(comboboxInput);
  const pressedKey = evt.key;
  switch (pressedKey) {
    case 'ArrowDown':
    case 'ArrowUp':
      if (!suggestionsListIsClosed) {
        evt.preventDefault();
        handleKeypressAddVisualFocus(pressedKey, suggestionsList, comboboxInput);
      }
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Home':
    case 'End':
      comboboxInput.hasAttribute('aria-activedescendant') && removeVisualFocus(comboboxInput);
      break;
    case 'Escape':
      (
        suggestionsListIsClosed ?
        comboboxInput.nextElementSibling.click() : // click clear button
        closeSuggestionsList(suggestionsList, comboboxInput)
      )
      break;
    case 'Tab': {
      const selectedOptionId = comboboxInput.getAttribute('aria-activedescendant');
      if (selectedOptionId !== null) {
        handleSuggestionsListClick(suggestionsList.querySelector(`#${selectedOptionId}`), false);
        // manually sets host's value attribute to input's value since mutation observer isn't triggered
        comboboxInput.getRootNode().host.value = comboboxInput.value;
      }
    }
      break;
    case 'Enter': {
      const selectedOptionId = comboboxInput.getAttribute('aria-activedescendant');
      if (selectedOptionId === null) {
        !suggestionsListIsClosed && closeSuggestionsList(suggestionsList, comboboxInput);
        // manually dispatches submit event coz input elements in shadow dom don't
        comboboxInput.getRootNode().host.dispatchEvent(new Event('submit'));
      } else {
        handleSuggestionsListClick(suggestionsList.querySelector(`#${selectedOptionId}`));
      }
    }
      break;
  }
}

export { getSuggestionsListRef, closeSuggestionsList, handleSuggestionsListDisplay, handleSuggestionsListKeyDown };
