import {
  hideClearButton,
  handleClearButtonVisibility,
  handlePointerDisplayClearButton,
  handleSearchLabelVisibility,
} from "./comboboxComponents/search-box.js";
import {
  getSuggestionsListRef,
  closeSuggestionsList,
  handleSuggestionsListDisplay,
  handleSuggestionsListKeyDown,
} from "./comboboxComponents/suggestions/suggestions-list.js";

export class SearchCombobox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const shadowStyles = document.createElement("style");
    shadowStyles.textContent = `
    :host {
      position: relative; /* allows positioning of error text and suggestions list */
    }

    :host *, :host *::before, :host *::after {
      box-sizing: border-box;
      background: transparent;
      outline: none;
      margin: 0;
      padding: 0;
      border: 0;
    }

    :host *[data-visually-hidden] {
      position: absolute;
      width: 1px;
      height: auto;
      margin: 0;
      border: 0;
      padding: 0;
      clip-path: inset(50%);
      overflow: hidden;
      white-space: nowrap;
    }

    :host *[hidden] {
      display: none !important;
    }

    :host ol {
      list-style-type: none;
    }

    :host svg {
      display: inline-block;
      width: 100%;
      height: 100%
    }
    
    .search-box {
      width: 100%;
      height: 100%;
      position: relative; /* allows positioning of input controls */
    }
    
    .search-box:focus-within {
      outline: 0.1rem solid var(--search-focus);
    }
    
    .search-box label {
      padding-left: calc(var(--search-widget-vertical-spacing) * 0.5);
      letter-spacing: 0.12rem;
      word-spacing: 0.16rem;
      opacity: 1;
    }
    
    /* prevents search label from obscuring search value */
    .search-box label:not([data-visible]) {
      opacity: 0.0001;
    }
    
    .search-box .input-controls {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      align-items: center; /* to support WCAG 1.4.4 on a 320px wide viewport */
    }
    
    .input-controls input {
      width: calc(100% - var(--search-btn-size));
      flex: 1 1 auto;
      padding-left: calc(var(--search-widget-vertical-spacing) * 0.5);
      font-size: calc(var(--base-font-size) * 1.25);
      color: inherit;
      /* 
       * it appears that every non-replaced element within an absolutely positioned flex container must have a
       * defined width, only then does a flex of auto or 1 work correctly
       */
    }
    
    .input-controls button {
      width: var(--search-btn-size);
      height: var(--search-btn-size);
      color: inherit;
      cursor: pointer;
    }
    
    /* ensures custom properties cascade into svg from <use> */
    .input-controls .clear-icon {
      --icon-color: currentColor;
    }

    #error-txt.display, #error-txt.display::before {
      --error-arrow-width: 1.2rem;
      --error-arrow-height: 1.2rem;
      --error-arrow-bg: var(--search-bg);
    }

    #error-txt.display {
      position: absolute;
      top: calc(100% + var(--search-widget-vertical-spacing) + var(--error-arrow-height));
      left: 0;
      background-color: var(--search-bg);
      color: var(--error-txt);
      padding: calc(var(--base-spacing) * 0.4);
      box-shadow: 0 0 var(--error-arrow-height) var(--elem-border);
      border: 0.1rem solid transparent;
      border-radius: 0.2rem;
      z-index: 5;
    }

    #error-txt.display::before {
      content: "";
      position: absolute;
      left: 10%;
      top: 0;
      transform: translateY(-100%);
      width: var(--error-arrow-width);
      height: var(--error-arrow-height);
      background-color: var(--error-arrow-bg);
      clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    @media screen and (forced-colors: active) {
      #error-txt.display {
        border-color: CanvasText;
      }

      #error-txt.display::before {
        background-color: CanvasText;
      }
    }
    
    .suggestions {
      position: absolute;
      top: calc(100% + var(--search-widget-vertical-spacing));
      left: 0;
      min-width: max-content;
      width: 50vw;
      max-height: 70vh;
      background-color: var(--search-bg);
      border: 0.1rem solid var(--elem-border);
      border-radius: 0.2rem;
      z-index: 5;
      display: flex;
      flex-direction: column;
    }
    
    .suggestions [role="listbox"] {
      flex: 1 1 auto;
      overflow: auto;
      scroll-behavior: smooth;
      position: relative; /* makes listbox container the nearest positioned ancestor of option elements - reqd in scroll mgt - to make option elements' offset-top relative to listbox container */
    }
    
    .suggestions h2, .suggestions [role="option"] {
      font-size: calc(var(--base-font-size) * 1.25);
      padding: calc(var(--search-widget-vertical-spacing) * 0.5) calc(var(--search-widget-horizontal-spacing) * 0.5);
      border-bottom: 0.1rem solid var(--elem-border);
    }

    @media screen and (max-width: 23.375em) {
      .suggestions [role="option"] {
        font-size: var(--base-font-size);
      }
    }
    
    .suggestions [role="option"]:last-child {
      border-bottom: none;
    }

    .suggestions [aria-selected] {
      cursor: default;
    }

    .suggestions [aria-selected="true"] {
      outline: 0.1rem solid var(--search-focus);
      outline-offset: -0.4rem;
    }
    `;

    const searchBox = document.createElement("div");
    searchBox.classList.add("search-box");

    const searchLabel = document.createElement("label");
    searchLabel.setAttribute("for", "combobox-input");
    searchLabel.setAttribute("data-visible", "true");
    searchLabel.textContent = "Search for a country";

    const inputBox = document.createElement("div");
    inputBox.classList.add("input-controls");
    inputBox.addEventListener("pointerenter", handlePointerDisplayClearButton);
    inputBox.addEventListener("pointerleave", handlePointerDisplayClearButton);
    inputBox.addEventListener("focusout", (evt) => {
      // handles combobox exit
      const target = evt.currentTarget;
      if (target.contains(evt.relatedTarget)) return;
      const {
        firstElementChild: comboboxInput,
        lastElementChild: clearButton,
      } = target;
      const [suggestionsList, suggestionsListIsClosed] =
        getSuggestionsListRef(target);
      !suggestionsListIsClosed &&
        closeSuggestionsList(suggestionsList, comboboxInput);
      !clearButton.hasAttribute("hidden") && hideClearButton(clearButton);
    });
    inputBox.innerHTML = `
      <input role="combobox" id="combobox-input" type="text" name="comboboxInput" aria-expanded="false" autocomplete="off" aria-autocomplete="list" spellcheck="false">
      <button type="button" tabindex="-1" hidden>
        <!--role="none" to prevent multiple virtual cursor stops on NVDA-->
        <span role="none" data-visually-hidden>Clear Search Entry</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <use href="/images/icons.svg#clearIcon" class="clear-icon"/>
        </svg>
      </button>
    `;
    const comboboxInput = inputBox.firstElementChild;
    comboboxInput.addEventListener("focus", (evt) => {
      const target = evt.target;
      // the side effects of clear btn focusing combobox input on search value removal is handled by mutation observer
      if (target.parentElement.contains(evt.relatedTarget)) return;
      handleClearButtonVisibility(target);
      // if aria-invalid is present, error txt is displayed instead
      if (!target.hasAttribute("aria-invalid"))
        handleSuggestionsListDisplay(target);
    });
    comboboxInput.addEventListener("input", (evt) => {
      const target = evt.target;
      if (target.hasAttribute("aria-invalid")) {
        // triggers error txt removal
        target
          .getRootNode()
          .getElementById("error-txt")
          .dispatchEvent(
            new CustomEvent("errordisplay", {
              detail: "none",
            })
          );
      }
      target.setAttribute("value", target.value); // triggers search value mutation observer
    });

    comboboxInput.addEventListener("keydown", (evt) => {
      // !evt.repeat to prevent multiple keydown handling on a long-key-press
      if (!evt.repeat) handleSuggestionsListKeyDown(evt);
    });

    // resolves circular dependency btw search-box.js and suggestions-list.js
    const searchValueObserver = new MutationObserver((mutations) => {
      const [searchValueMutation] = mutations;
      const mutationTarget = searchValueMutation.target;
      handleSearchLabelVisibility(mutationTarget);
      handleClearButtonVisibility(mutationTarget);
      if (mutationTarget.hasAttribute("data-programmatic-value-mutation")) {
        mutationTarget.removeAttribute("data-programmatic-value-mutation");
        const [suggestionsList] = getSuggestionsListRef(mutationTarget);
        closeSuggestionsList(suggestionsList, mutationTarget);
        const {
          scrollWidth: mutationTargetScrollWidth,
          value: { length: valueLength },
        } = mutationTarget;
        if (
          mutationTargetScrollWidth > mutationTarget.parentElement.clientWidth
        ) {
          // mutation target scrollWidth to ensure input's value is scrolled to the max
          mutationTarget.scrollLeft = mutationTargetScrollWidth;
        }
        mutationTarget.setSelectionRange(valueLength, valueLength);
      } else {
        handleSuggestionsListDisplay(mutationTarget);
      }
      mutationTarget.getRootNode().host.value = mutationTarget.value; // sets combobox value attribute to input's value
    });
    searchValueObserver.observe(comboboxInput, {
      attributes: true,
      attributeFilter: ["value"],
    });

    searchBox.append(...[searchLabel, inputBox]);

    const errorText = document.createElement("p");
    errorText.id = "error-txt";
    errorText.addEventListener("errordisplay", (evt) => {
      const target = evt.target;
      const shadowNode = target.getRootNode();
      const comboboxInput = shadowNode.getElementById("combobox-input");
      const errorValue = evt.detail;
      if (errorValue === "none") {
        target.classList.remove("display");
        while (target.hasChildNodes()) target.lastChild.remove();
        comboboxInput.removeAttribute("aria-invalid");
        comboboxInput.removeAttribute("aria-describedby");
        shadowNode.host.error = errorValue;
      } else {
        const hiddenErrorText = document.createElement("span");
        hiddenErrorText.setAttribute("data-visually-hidden", "true");
        hiddenErrorText.textContent = "Error! ";
        const errorMsg =
          errorValue.length > 0
            ? `No result found for: ${errorValue}`
            : `Enter a country's name to search`;
        target.append(...[hiddenErrorText, errorMsg]);
        target.classList.add("display");
        comboboxInput.setAttribute("aria-invalid", "true");
        comboboxInput.setAttribute("aria-describedby", target.id);
        comboboxInput.focus();
      }
    });

    const suggestionsNotifier = document.createElement("span");
    suggestionsNotifier.setAttribute("aria-live", "polite");
    suggestionsNotifier.setAttribute("aria-atomic", "true");
    suggestionsNotifier.setAttribute("data-visually-hidden", "true");
    suggestionsNotifier.addEventListener("announce", (evt) => {
      evt.target.textContent = evt.detail;
    });

    const suggestionsWrapper = document.createElement("div");
    suggestionsWrapper.classList.add("suggestions");
    suggestionsWrapper.innerHTML = `
      <h2 id="suggestions-heading" aria-hidden="true">Suggestions</h2>
      <ol role="listbox" id="combobox-listbox" aria-labelledby="suggestions-heading"></ol>
    `;
    suggestionsWrapper.setAttribute("hidden", "hidden");

    this.shadowRoot.append(
      ...[
        shadowStyles,
        searchBox,
        errorText,
        suggestionsNotifier,
        suggestionsWrapper,
      ]
    );
  }

  // getter and setter keep combobox properties and attributes in sync
  set value(searchValue) {
    this.setAttribute("value", searchValue);
  }

  get value() {
    return this.getAttribute("value");
  }

  set error(errorValue) {
    this.setAttribute("error", errorValue);
  }

  get error() {
    return this.getAttribute("error");
  }

  connectedCallback() {
    this.setAttribute("value", "");
    this.setAttribute("error", "none");
  }

  static get observedAttributes() {
    return ["error"];
  }

  attributeChangedCallback(attr, _, newValue) {
    if (newValue !== "none") {
      // triggers error txt display
      this.shadowRoot
        .getElementById("error-txt")
        .dispatchEvent(new CustomEvent("errordisplay", { detail: newValue }));
    }
  }
}
