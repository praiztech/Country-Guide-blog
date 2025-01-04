// sets currently focused option
function handleCurrOptionFocus(comboboxInput, option2Focus = null) {
  const currFocusedcurrOptionId = comboboxInput.getAttribute(
    "aria-activedescendant"
  );
  if (currFocusedcurrOptionId !== null) {
    comboboxInput
      .getRootNode()
      .getElementById(currFocusedcurrOptionId)
      .setAttribute("aria-selected", "false");
  }
  if (option2Focus === null) {
    comboboxInput.removeAttribute("aria-activedescendant");
  } else {
    option2Focus.setAttribute("aria-selected", "true");
    comboboxInput.setAttribute("aria-activedescendant", option2Focus.id);
  }
}

function handleSuggestionsListScrolling(currFocusedOption) {
  const suggestionsList = currFocusedOption.parentElement,
    currFocusedOptionTop = currFocusedOption.offsetTop,
    currFocusedOptionBottom =
      currFocusedOptionTop + currFocusedOption.offsetHeight,
    suggestionsListFullHeight = suggestionsList.scrollHeight,
    suggestionsListVisibleHeight = suggestionsList.clientHeight,
    suggestionsListTop = suggestionsList.scrollTop,
    suggestionsListVisibleBottom =
      suggestionsListTop + suggestionsListVisibleHeight; // micro-optimization?
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
  handleSuggestionsListScrolling(option2Focus);
}

function setKeyPressOption2Focus(
  currOptionId,
  defaultFocusOption,
  altFocusOption,
  endOption
) {
  if (currOptionId !== null) {
    const currFocusedOption = endOption.parentElement.querySelector(
      `#${currOptionId}`
    );
    if (currFocusedOption !== endOption) {
      return currFocusedOption[defaultFocusOption];
    }
  }
  return altFocusOption;
}

function handleKeypressAddVisualFocus(key, suggestionsList, comboboxInput) {
  const currFocusedOptionId = comboboxInput.getAttribute(
    "aria-activedescendant"
  );
  let option2Focus;
  switch (key) {
    case "ArrowDown":
      {
        /*
         * if there's no currently focused option or the currently focused option is the last on the list, set visual focus * on the first option else set visual focus on the option ffg the currently focused option
         */
        const defaultFocusOption = "nextElementSibling";
        option2Focus = setKeyPressOption2Focus(
          currFocusedOptionId,
          defaultFocusOption,
          suggestionsList.firstElementChild,
          suggestionsList.lastElementChild
        );
      }
      break;
    case "ArrowUp":
      {
        /*
         * if there's no currently focused option or the currently focused option is the first on the list, set visual focus
         * on the last option else set visual focus on the option b4 the currently focused option
         */
        const defaultFocusOption = "previousElementSibling";
        option2Focus = setKeyPressOption2Focus(
          currFocusedOptionId,
          defaultFocusOption,
          suggestionsList.lastElementChild,
          suggestionsList.firstElementChild
        );
      }
      break;
  }
  addVisualFocus(comboboxInput, option2Focus);
}

function handlePointerDisplayVisualFocus(evt) {
  if (!evt.isPrimary) return; // ensures single pointer interaction on multi-touch devices
  const comboboxInput = evt.target
    .getRootNode()
    .getElementById("combobox-input");
  switch (evt.type) {
    case "pointerenter":
      addVisualFocus(comboboxInput, evt.target);
      break;
    case "pointerleave":
      removeVisualFocus(comboboxInput);
      break;
  }
}

export {
  removeVisualFocus,
  handleKeypressAddVisualFocus,
  handlePointerDisplayVisualFocus,
};
