export function appendPgBaseData(pageNo) {
  const countriesPerPage = 20;
  const dataStart = (pageNo - 1) * countriesPerPage;
  const dataEnd = pageNo * countriesPerPage - 1;

  const baseData = JSON.parse(sessionStorage.getItem("baseData"));
  
  const pageData = new DocumentFragment();
  for (let i = dataStart; i <= dataEnd; i++) {
    const country = baseData[i];
    const dataPoint = document.createElement('li');
    dataPoint.innerHTML = `
      <a>
        <div class="country-flag-wrapper">
          <img src="${country.flags.svg}" alt=""/>
        </div>
        <div class="country-name">${country.name.common}</div>
      </a>
    `;
    pageData.append(dataPoint);
  }
  document.getElementById('countries-list').append(pageData);
}
