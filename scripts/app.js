import { appendPgBaseData } from "./page-data.js";
import { SearchCombobox } from "./searchCombobox/index.js";

customElements.define('search-combobox', SearchCombobox);

const [searchForm] = document.forms;
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  /*
   * as submit events dont bubble, event handling in the capturing phase ensures that this event handler
   * is triggered ffg submit event dispatch on combobox; currentTarget used 4 same reason
   */
  const combobox = evt.currentTarget.firstElementChild;
  const searchValue = combobox.value;
  const normalizedSearchValue = (
    searchValue && searchValue.normalize("NFC").toLowerCase().split(' ').map(
      (word) => word.replace(/[^a-z\u00e3\u00e9\u00ed]/g, '')
      ).join(' ')
  );
  const validatedSearchValue = (
    normalizedSearchValue && validatedCountryName(normalizedSearchValue)
  );
  (
    validatedSearchValue ?
    location.assign(`./details.html#${validatedSearchValue}`) :
    combobox.error = searchValue // ensures error text exactly reflects user input
  );

  function validatedCountryName(countryName) {
    const baseData = JSON.parse(sessionStorage.getItem("baseData"));
    for (country of baseData) {
      if (
        country.name.common.toLowerCase() === countryName ||
        country.name.official.toLowerCase() === countryName ||
        country.altSpellings.slice(1).toLowerCase() == countryName
      ) return countryName;
    }
    return false;
  }
}, true);

/*
 * used evt handling instead of HTML coz 
 * #fragment are used to designate the website pages and define each page title
 * and the skip link #fragment messes with this paging format
 */
document.querySelector('a[data-skip]').addEventListener('click', (evt) => {
  evt.preventDefault();
  document.querySelector('h1').focus();
});


document.querySelector('.content').addEventListener('fetch', (evt) => {
  if (evt.detail.status === 'success') {
    const data = JSON.parse(window.sessionStorage.getItem("baseData")) ?? evt.detail?.data;
    const page = location.hash === '' ? 1 : location.hash.slice(5);
    appendPgBaseData(page, data);
    document.querySelector('.content').removeAttribute('hidden'); // displays page content
    window.sessionStorage.setItem("baseData", JSON.stringify(data));
  } else {
    const errorMsg = document.createElement('div');
    errorMsg.classList.add('fetch-error');
    errorMsg.innerHTML = `
    <p>There was a problem loading the page. ${evt.detail.status}</p>
    `;
    evt.target.replaceWith(errorMsg);
  }
});


/*
let country = 'uk'; 
//check name.common, altSpellings.includes() to identify specific country from multiple results
//check with congo, guinea and sudan
let response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
let details = await response.json();
console.log(country);
console.log(details);
*/
