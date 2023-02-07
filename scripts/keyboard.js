import { handleKeypressVisualFocus } from "./autocomplete.js";

export default function handleKeyPress(evt) {
  if (!document.getElementById('combobox-listbox').hasAttribute('hidden') &&
      (document.activeElement === document.getElementById('search-input'))) {
        handleKeypressVisualFocus(evt);
      }
}
