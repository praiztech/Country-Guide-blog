export function appendPgBaseData(page) {
  const countriesPerPage = 20;
  const baseData = JSON.parse(sessionStorage.getItem("baseData"));
  const lastDataIndex = baseData.length - 1;
  const lastPage = Math.ceil(baseData.length / countriesPerPage);
  const currPage = Number(page); // ensures next page computation is addition not concatenation
  if (isNaN(currPage) || currPage > lastPage) currPage = 1; // if page in url doesn't exist, load root page

  let dataStart = (currPage - 1) * countriesPerPage;
  let dataEnd = currPage * countriesPerPage - 1;
  if (lastDataIndex < dataEnd) dataEnd = lastDataIndex;
  
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
  
  const currPageLink = document.getElementById('curr-page');
  currPageLink.href = `#page${currPage}`;
  currPageLink.lastElementChild.textContent = currPage;
  document.getElementById('prev-page').href = `#page${currPage-1}`;
  document.getElementById('next-page').href = `#page${currPage+1}`;

  // not hardcoding last page incase base data length changes
  return lastPage;
}
