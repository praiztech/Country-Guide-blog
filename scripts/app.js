import loadSearchedPage from "./search.js";
import { handlePointerVisualFocus } from "./autocomplete.js";
import handleKeyPress from "./keyboard.js";

const [searchForm] = document.forms;
const searchInputElem = searchForm.elements.searchInput;

searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  let searchValue = evt.target.elements.searchInput.value;
  let sanitizedSearchValue = searchValue.normalize("NFC").toLowerCase().split(' ').map(word => word.replace(
    /[^a-z\u00e3\u00e9\u00ed]/g, '')).join(' '); //normalize() for são tomé and príncipe
  loadSearchedPage(sanitizedSearchValue);
});

//ensures search label is only visible when the search input is blank
searchInputElem.addEventListener('input', (evt) => {
  const {value: searchValue, labels: [searchLabel]} = evt.target;
  if (searchValue === '') {
    !searchLabel.hasAttribute('data-visible') && searchLabel.setAttribute('data-visible', 'true');
  } else {
    searchLabel.hasAttribute('data-visible') && searchLabel.removeAttribute('data-visible');
  }
});

searchInputElem.addEventListener('focus', handlePointerVisualFocus); //change to input subsequently?

document.addEventListener('keydown', handleKeyPress);

/*
let response = await fetch('https://restcountries.com/v3.1/all');
let country = 'uk'; //check name.common, altSpellings.includes() to identify specific country from multiple results
//check with congo, guinea and sudan
let response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
let details = await response.json();
console.log(country);
console.log(details);
*/
document.querySelector('.content').removeAttribute('hidden'); //make page visible