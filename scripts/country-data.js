export function appendCountryData(baseData, countryData) {
  console.log(countryData);
  console.log(location.hash.slice(1));
  const [country] = (
    countryData.length === 1 ? 
    countryData : 
    countryData.filter((dataPt) => dataPt.name.common === decodeURIComponent(location.hash.slice(1)))
  );
  const countryDetails = document.createElement('article');
  countryDetails.innerHTML = `
    <h1 tabindex="-1">${country.name.common}</h1>
    <div class="country-flag-wrapper">
      <img src="${country.flags.svg}" alt="The flag of ${country.name.common}."/>
    </div>
    <div class="country-flag-description-wrapper">
      <div class="flag-description">
        <button type="button" aria-expanded="false" aria-controls="description-panel">
          <span>Flag Description</span>
          <svg aria-hidden="true"></svg>
        </button>
        <div id="description-panel" hidden>
          <p>${country.flags.alt}</p>
        </div>
      </div>
    </div>
    <div class="country-data">
      <p>Region: ${country.region}</p>
      <p>Sub-region: ${country.subregion}</p>
      <p>Capital: ${country.capital[0]}</p>
      <p>Population: ${country.population}</p>
      <p>Language(s): ${Object.values(country.languages).join(', ')}</p>
      <p>Currency: ${setCurrency(country.currencies)}</p>
      ${setBorderCountries(baseData, country.borders)}
    </div>
  `;
  document.querySelector('a[aria-current="page"]').textContent = country.name.common;
  document.querySelector('main').append(countryDetails);
}

function setCurrency(countryCurrency) {
  const currency = countryCurrency[Object.keys(countryCurrency)[0]];
  return currency.symbol === undefined ? `${currency.name}` : `${currency.name} - ${currency.symbol}`;
}

function setBorderCountries(baseData, borderCountriesCode) {
  if (borderCountriesCode === undefined) return '';
  const borderCountriesLink = baseData.reduce((countriesLinkArray, country) => {
    if (borderCountriesCode.includes(country.cca3)) {
      countriesLinkArray.push(
        `
        <a href=/details.html#${country.name.common.replaceAll(' ', '').toLowerCase()}>
          ${country.name.common}
        </a>
        `
      );
    }
    return countriesLinkArray;
  }, []);
  return `
    <p>Border Countries: ${borderCountriesLink.join(', ')}</p>
  `;
}
