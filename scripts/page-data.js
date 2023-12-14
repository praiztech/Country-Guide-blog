export function appendPgBaseData(page) {
  const countriesPerPage = 20;
  let dataStart = (page - 1) * countriesPerPage;
  let dataEnd = page * countriesPerPage - 1;

  const baseData = JSON.parse(sessionStorage.getItem("baseData"));
  const lastDataIndex = baseData.length - 1;
  if (lastDataIndex < dataEnd) {
    dataEnd = lastDataIndex;
  } 
  
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
  // not hardcoding no of pages coz base data length can change
  return Math.ceil(baseData.length / countriesPerPage);
}
