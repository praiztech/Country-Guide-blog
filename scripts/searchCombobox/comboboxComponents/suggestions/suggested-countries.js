export function findCountrySuggestions(searchValue) {
  /*
   * if search value has non-ascii characters, only match country names that include the non-ascii characters
   * eg if search value is 'sã', only include 'são tomé and príncipe' in matched countries
   * otherwise, matched country names should include both country names with ascii and non-ascii characters
   * eg if search value is 'sa' include both 'são tomé and príncipe' and 'saudi arabia' in matched countries
   */
  const searchValuehasNonAscii = [...searchValue].some((char) => char.codePointAt(0) > 127);
  const collator = searchValuehasNonAscii ? Intl.Collator() : Intl.Collator('ro', {sensitivity: 'base'});
  const suggestedCountries = [];
  let matchStart = false;

  // uses for...of instead of array.reduce() to allow conditional iteration exit
  const baseData = JSON.parse(sessionStorage.getItem("baseData"));
  for (const country of baseData) {
    const countryName = country.name.common;
    // collator.compare() instead of string.startswith() to account for non-ascii characters eg in são tomé and príncipe
    if (collator.compare(searchValue, countryName.toLowerCase().slice(0, searchValue.length)) === 0) {
      suggestedCountries.push(countryName);
      if (!matchStart) matchStart = true; // first match
    } else {
      if (matchStart) break; // no more country name to match
    }
  }
  return suggestedCountries;
}
