export function appendCountryData(baseData, countryData) {
  const [country] =
    countryData.length === 1
      ? countryData
      : countryData.filter(
          (dataPt) =>
            dataPt.name.common === decodeURIComponent(location.hash.slice(1))
        );
  const countryBreadcrumbLink = document.querySelector(
    'a[aria-current="page"]'
  );
  countryBreadcrumbLink.href = `/details.html#${country.name.common}`;
  countryBreadcrumbLink.textContent = country.name.common;
  const countryDetails = document.createElement("article");
  countryDetails.innerHTML = `
    <h1 tabindex="-1">${country.name.common}</h1>
    <div class="country">
      <img 
      src="${country.flags.svg}" 
      alt="The flag of ${country.name.common}." />
      <div class="country-data">
        <div class="flag-description">
          <button class="description-toggle" type="button" aria-expanded="false">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <use href="/images/icons.svg#arrowIcon" />
            </svg>
            <span>Flag Description</span>
          </button>
          <div class="description-panel">
            <p>${country.flags.alt}</p>
          </div>
        </div>
        <div class="details">
          <p>Region: ${country.region}</p>
          <p>Sub-region: ${country.subregion}</p>
          <p>Capital: ${country.capital[0]}</p>
          <p>Population: ${Number(country.population).toLocaleString()}</p>
          <p>Language(s): ${Object.values(country.languages).join(", ")}</p>
          <p>Currency: ${setCurrency(country.currencies)}</p>
          ${setBorderCountries(baseData, country.borders)}
        </div>
      </div>
    </div>
  `;
  countryDetails.addEventListener("click", (evt) => {
    const flagDescBtnClicked = evt.target.closest("button.description-toggle");
    if (flagDescBtnClicked) {
      const toggleFlagDesc = !(
        flagDescBtnClicked.getAttribute("aria-expanded") === "true"
      );
      flagDescBtnClicked.setAttribute("aria-expanded", toggleFlagDesc);
    }
  });
  document.querySelector("main").append(countryDetails);
}

function setCurrency(countryCurrency) {
  const currency = countryCurrency[Object.keys(countryCurrency)[0]];
  return currency.symbol === undefined
    ? `${currency.name}`
    : `${currency.name} - ${currency.symbol}`;
}

function setBorderCountries(baseData, borderCountriesCode) {
  if (borderCountriesCode === undefined) return "";
  const borderCountriesLink = baseData.reduce((countriesLinkArray, country) => {
    if (borderCountriesCode.includes(country.cca3)) {
      countriesLinkArray.push(
        `<a href=/details.html#${encodeURIComponent(
          country.name.common
        )} class="text">${country.name.common}</a>`
      );
    }
    return countriesLinkArray;
  }, []);
  return `<p>Border Countries: ${borderCountriesLink.join(", ")}</p>`;
}
