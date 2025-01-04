import { appendHomepageData } from "./homepage-data.js";
import { appendCountryData } from "./country-data.js";
import { SearchCombobox } from "./searchCombobox/index.js";

customElements.define("search-combobox", SearchCombobox);

const [searchForm] = document.forms;
searchForm.addEventListener(
  "submit",
  (evt) => {
    evt.preventDefault();

    /*
     * as submit events dont bubble, event handling in the capturing phase ensures that this event handler
     * is triggered ffg submit event dispatch on combobox; currentTarget used 4 same reason
     */
    const combobox = evt.currentTarget.firstElementChild;
    const searchValue = combobox.value;
    const normalizedSearchValue =
      searchValue &&
      searchValue
        .normalize("NFC")
        .toLowerCase()
        .split(" ")
        .map((word) => word.replace(/[^a-z\u00e3\u00e9\u00ed]/g, ""))
        .join(" ");
    const validatedSearchValue =
      normalizedSearchValue && validatedCountryName(normalizedSearchValue);
    if (!validatedSearchValue) {
      combobox.error = searchValue; // ensures error text exactly reflects user input
    } else {
      switch (location.pathname) {
        case "/details.html":
          // not searching for the country currently displayed
          if (
            decodeURIComponent(location.hash.slice(1)) !== validatedSearchValue
          ) {
            location.hash = validatedSearchValue;
          }
          break;
        default: //searching from homepage
          location.assign(`./details.html#${validatedSearchValue}`);
          break;
      }
    }

    function validatedCountryName(countryName) {
      const baseData = JSON.parse(sessionStorage.getItem("baseData"));
      for (const country of baseData) {
        if (
          country.name.common.toLowerCase() === countryName ||
          country.name.official.toLowerCase() === countryName ||
          country.altSpellings.slice(1).includes(
            countryName
              .split(" ")
              .map((word) =>
                ["and", "of", "the"].includes(word)
                  ? word
                  : `${word[0].toUpperCase() + word.slice(1)}`
              )
              .join(" ")
          )
        )
          return country.name.common; // ensures consistency with homepage countries list
      }
      return false;
    }
  },
  true
);

/*
 * used evt handling instead of HTML coz
 * #fragment are used to designate the website pages and define each page title
 * and the skip link #fragment messes with this paging format
 */
document.querySelector("a.skip-link").addEventListener("click", (evt) => {
  evt.preventDefault();
  document.querySelector("h1").focus();
});

document.querySelector(".content").addEventListener("fetch", (evt) => {
  if (evt.detail.status === "success") {
    const storedData = sessionStorage.getItem("baseData");
    const baseData =
      storedData === null ? evt.detail.data.base : JSON.parse(storedData);
    switch (evt.detail.path) {
      case "home":
        const page = location.hash === "" ? 1 : location.hash.slice(5);
        appendHomepageData(page, baseData);
        document.querySelector(".content").removeAttribute("hidden"); // display content
        break;
      case "details":
        appendCountryData(baseData, evt.detail.data.country);
        document.querySelector(".content").removeAttribute("hidden");
        break;
    }
    if (storedData === null)
      sessionStorage.setItem("baseData", JSON.stringify(baseData));
  } else {
    const errorMsg = document.createElement("div");
    errorMsg.classList.add("fetch-error");
    errorMsg.innerHTML = `
    <p>There was a problem loading the page. ${evt.detail.status}</p>
    `;
    evt.target.replaceWith(errorMsg);
  }
});
