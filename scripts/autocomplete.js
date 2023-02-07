export { handlePointerVisualFocus, handleKeypressVisualFocus };

const searchInputElem = document.getElementById('search-input');
const suggestionsList = document.getElementById('combobox-listbox');
let lastFocusedElem, currFocusedElem;

function handlePointerVisualFocus() { //remember to cleanup with removeEventListener
  for (let suggestedOption of suggestionsList.children) { //add to options to prevent scrollbar triggering visual focus
    suggestedOption.addEventListener('pointerenter', (evt) => {
      if (!evt.isPrimary) return; //ensures single pointer interaction on multi-touch devices
      addVisualFocus(evt.target);
    });
  }

  //moves visual focus out of suggestions list when no pointer on suggestions list
  suggestionsList.addEventListener('pointerleave', (evt) => { 
    if (!evt.isPrimary) return;
    removeVisualFocus();
  });
}

function handleKeypressVisualFocus(evt) {
  if (evt.repeat) return; //prevents multiple keydown handling on a long-key-press
  switch (evt.key) {
    case 'ArrowDown':
      evt.preventDefault();
      if (!currFocusedElem) {
        addVisualFocus(suggestionsList.firstElementChild);
      } else {
        const nextElem = currFocusedElem.nextElementSibling;
        nextElem ? addVisualFocus(nextElem) : removeVisualFocus();
      }
      break;
    case 'ArrowUp':
      evt.preventDefault();
      if (currFocusedElem) { //if no option currently has visual focus, do nothing
        const precedingElem = currFocusedElem.previousElementSibling;
        precedingElem ? addVisualFocus(precedingElem) : removeVisualFocus();
      }
      break;
  }
};

//adds the visual focus indicator to the suggestions list
function addVisualFocus(elem2Focus) {
  lastFocusedElem = currFocusedElem;
  currFocusedElem = elem2Focus;
  lastFocusedElem && lastFocusedElem.setAttribute('aria-selected', 'false');
  searchInputElem.setAttribute('aria-activedescendant', currFocusedElem.id);
  currFocusedElem.setAttribute('aria-selected', 'true');
  //if there's an invisible scrolled-out part of the suggestions list, handle its scrolling into view
  suggestionsList.scrollHeight > suggestionsList.clientHeight && handleSuggestionsListScrolling();
}

//removes the visual focus indicator from the suggestions list
function removeVisualFocus() {
  searchInputElem.setAttribute('aria-activedescendant', "");
  currFocusedElem.setAttribute('aria-selected', 'false');
}

function handleSuggestionsListScrolling() {}
