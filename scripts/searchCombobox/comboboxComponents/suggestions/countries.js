const sovereignCountries = ['afghanistan', 'albania', 'algeria', 'andorra', 'angola', 'antigua and barbuda', 'argentina',
'armenia', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium',
'belize', 'benin', 'bhutan', 'bolivia', 'bosnia and herzegovina', 'botswana', 'brazil', 'brunei', 'bulgaria', 
'burkina faso', 'burundi', 'cambodia', 'cameroon', 'canada', 'cape verde', 'central african republic', 'chad', 'chile', 
'china', 'colombia', 'comoros', 'costa rica', 'croatia', 'cuba', 'cyprus', 'czechia', 
'democratic republic of the congo', 'denmark', 'djibouti', 'dominica', 'dominican republic', 'ecuador', 'egypt', 
'el salvador', 'equatorial guinea', 'eritrea', 'estonia', 'eswatini', 'ethopia', 'fiji', 'finland', 'france', 'gabon', 
'gambia', 'georgia', 'germany', 'ghana', 'greece', 'grenada', 'guatemala', 'guinea', 'guinea-bissau', 
'guyana','haiti', 'honduras', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'isreal', 
'italy', 'ivory coast', 'jamaica', 'japan', 'jordan', 'kazakhstan', 'kenya', 'kiribati', 'kuwait', 'kyrgyzstan', 'laos', 
'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'madagascar', 'malawi', 
'malaysia', 'maldives', 'mali', 'malta', 'marshall islands', 'mauritania', 'mauritius', 'mexico', 'micronesia', 
'moldova', 'monaco', 'mongolia', 'montenegro', 'morocco', 'mozambique', 'myanmar', 'namibia', 'nauru', 'nepal', 
'netherlands', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'north korea', 'north macedonia', 'norway', 'oman', 
'pakistan', 'palau', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'poland', 'portugal', 'qatar', 
'republic of the congo', 'romania', 'russia', 'rwanda', 'saint kitts and nevis', 'saint lucia', 
'saint vincent and the grenadines', 'samoa', 'san marino', 'são tomé and príncipe', 'saudi arabia', 'senegal', 'serbia', 
'seychelles', 'sierra leone', 'singapore', 'slovakia', 'slovenia', 'solomon islands', 'somalia', 'south africa', 
'south korea', 'south sudan', 'spain', 'sri lanka', 'sudan', 'suriname', 'sweden', 'switzerland', 'syria', 'tajikistan', 
'tanzania', 'thailand', 'timor-leste', 'togo', 'tonga', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 
'tuvalu', 'uganda', 'ukraine', 'united arab emirates', 'united kingdom', 'united states of america', 'uruguay', 
'uzbekistan', 'vanuatu', 'vatican city', 'venezuela', 'vietnam', 'yemen', 'zambia', 'zimbabwe'];

const altCountryNames = ['burma', 'congo', 'congo-brazzaville', 'congo-kinshasa', 'czech', 'czech republic', 'dr congo', 
'great britain', 'holy see', 'republic of the gambia', 'republic of the sudan', 'sao tome and principe', 'swaziland', 
'uk', 'united states', 'usa', 'vatican city state'];

function capitalizeCountryName(countryName, descriptors = ['and', 'of', 'the']) {
  return (
    countryName.split(' ').map((word) => descriptors.includes(word) ? word : `${word[0].toUpperCase() + word.slice(1)}`)
    .join(' ')
  );
}

function getCountryMatches(searchValue) {
  /*
   * if search value has non-ascii characters, only match country names that include the non-ascii characters
   * eg if search value is 'sã', only include 'são tomé and príncipe' in matched countries
   * otherwise, matched country names should include both country names with ascii and non-ascii characters
   * eg if search value is 'sa' include both 'são tomé and príncipe' and 'saudi arabia' in matched countries
   */
  const searchValuehasNonAscii = [...searchValue].some((char) => char.codePointAt(0) > 127);
  const collator = searchValuehasNonAscii ? Intl.Collator() : Intl.Collator('ro', {sensitivity: 'base'});
  const matchedCountries = [];
  let matchStart = false;

  // uses for...of instead of array.reduce() to allow conditional iteration exit
  for (const countryName of sovereignCountries) {
    // collator.compare() instead of string.startswith() to account for non-ascii characters eg in são tomé and príncipe
    if (collator.compare(searchValue, countryName.slice(0, searchValue.length)) === 0) {
      const capitalizedCountryName = capitalizeCountryName(countryName);
      matchedCountries.push(capitalizedCountryName);
      if (!matchStart) matchStart = true; // first match
    } else {
      if (matchStart) break; // no more country name to match
    }
  }
  return matchedCountries;
}

function findCountrySuggestions(searchValue) {
  let suggestedCountries = [];
  if (searchValue.length > 0) {
    suggestedCountries = getCountryMatches(searchValue.normalize("NFC").toLowerCase());
  }
  return suggestedCountries;
}

function isSovereignCountry(searchValue) {
  return (sovereignCountries.includes(searchValue) || altCountryNames.includes(searchValue));
}

export { findCountrySuggestions, isSovereignCountry };
