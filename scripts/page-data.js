export function appendPgBaseData(page) {
  const countriesPerPage = 20;
  const dataStart = (page - 1) * countriesPerPage;
  const dataEnd = page * countriesPerPage - 1;

  const baseData = JSON.parse(sessionStorage.getItem("baseData"));
  
  const pageData = new DocumentFragment();
  for (let i = dataStart; i <= dataEnd; i++) {
    const country = baseData[i];
    const dataPoint = document.createElement('li');
    dataPoint.innerHTML = `
      <a href=/details.html#${country.name.common.replaceAll(' ', '').toLowerCase()}>
        <div class="country-flag-wrapper">
          <img src="${country.flags.svg}" alt=""/>
        </div>
        <div class="country-name">${country.name.common}</div>
      </a>
    `;
    pageData.append(dataPoint);
  }
  const countriesList = document.getElementById('countries-list');
  while (countriesList.childElementCount > 0) countriesList.lastElementChild.remove();
  countriesList.append(pageData);
}
