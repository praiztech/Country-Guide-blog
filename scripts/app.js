import { loadSearchedCountry, SearchCombobox } from "./searchCombobox/index.js";

customElements.define('search-combobox', SearchCombobox);

const [searchForm] = document.forms;
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  // currentTarget to account for manually dispatched submit event
  let searchValue = evt.currentTarget.firstElementChild.value;
  if (searchValue.length > 0) {
    searchValue = ( // normalize() for são tomé and príncipe
      searchValue.normalize("NFC").toLowerCase().split(' ')
      .map((word) => word.replace(/[^a-z\u00e3\u00e9\u00ed]/g, '')).join(' ')
    );
  }
  loadSearchedCountry(searchValue);
}, true); // capturing phase as submit event doesn't bubble

/*
let response = await fetch('https://restcountries.com/v3.1/all');
let country = 'uk'; //check name.common, altSpellings.includes() to identify specific country from multiple results
//check with congo, guinea and sudan
let response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
let details = await response.json();
console.log(country);
console.log(details);
*/

// remember in errortxt.js
document.querySelector('.content').removeAttribute('hidden'); // displays page