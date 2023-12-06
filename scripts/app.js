import { appendPgBaseData } from "./page-data.js";
import { SearchCombobox } from "./searchCombobox/index.js";

customElements.define('search-combobox', SearchCombobox);

const [searchForm] = document.forms;
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  // currentTarget to account for submit event dispatched on combobox
  const combobox = evt.currentTarget.firstElementChild;
  const searchValue = combobox.value;
  let validatedSearchValue = '';
  if (searchValue.length > 0) {
    validatedSearchValue = ( // normalize() for são tomé and príncipe
      searchValue.normalize("NFC").toLowerCase().split(' ')
      .map((word) => word.replace(/[^a-z\u00e3\u00e9\u00ed]/g, '')).join(' ')
    );
  }
  if (validatedSearchValue.length === 0 || !isSovereignCountry(validatedSearchValue)) {
    //TODO: fix isSovereignCountry use to validate search value
    combobox.error = searchValue; // ensures error text exactly reflects user input
  } else {
    location.assign(`./details.html#${validatedSearchValue}`);
  }
  /*
   * as submit events dont bubble, event handling in the capturing phase ensures that this event handler
   * is triggered ffg submit event dispatch on combobox
   */
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
  if (evt.detail === 'success') {
    appendPgBaseData(1);
    document.querySelector('.content').removeAttribute('hidden'); // displays page content
  } else {
    const errorMsg = document.createElement('div');
    errorMsg.classList.add('fetch-error');
    errorMsg.innerHTML = `<p>
    There was a problem loading the page. ${evt.detail}
    </p>`;
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
