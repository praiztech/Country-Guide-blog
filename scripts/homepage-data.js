export function appendHomepageData(page, baseData) {
  const countriesPerPage = 20;
  const lastDataIndex = baseData.length - 1;
  let lastPage = Math.ceil(baseData.length / countriesPerPage);
  let currPage = Number(page); // ensures next page computation is addition not concatenation
  if (isNaN(currPage) || currPage > lastPage) currPage = 1; // if page in url doesn't exist, load root page
  let dataStart = (currPage - 1) * countriesPerPage;
  let dataEnd =
    currPage === lastPage ? lastDataIndex : currPage * countriesPerPage - 1;

  const pageData = new DocumentFragment();
  for (let i = dataStart; i <= dataEnd; i++) {
    const country = baseData[i];
    const dataPoint = document.createElement("li");
    dataPoint.innerHTML = `
      <a href=/details.html#${encodeURIComponent(country.name.common)}>
        <img src="${country.flags.svg}" alt=""/>
        <span>${country.name.common}</div>
      </a>
    `;
    pageData.append(dataPoint);
  }
  const countriesList = document.querySelector(".countries-list");
  while (countriesList.childElementCount > 0)
    countriesList.lastElementChild.remove();
  countriesList.append(pageData);
  setPaginationLinks(currPage, lastPage);
  return currPage;
}

function setPaginationLinks(currPage, lastPage) {
  const paginationLinks = document.querySelectorAll(
    'nav[aria-label="Pagination"] a'
  );
  const firstPage = 1;
  paginationLinks.forEach((link) => {
    switch (link.firstElementChild.textContent) {
      case "First Page":
        setPageIconLink(link, currPage, firstPage, firstPage);
        break;
      case "Previous Page":
        setPageIconLink(link, currPage, currPage - 1, firstPage + 1);
        break;
      case "Next Page":
        setPageIconLink(link, currPage, currPage + 1, lastPage - 1);
        break;
      case "Last Page":
        setPageIconLink(link, currPage, lastPage, lastPage);
        break;
      default: // current page
        link.href = `#page${currPage}`;
        link.lastElementChild.textContent = currPage;
        break;
    }
  });
}

function setPageIconLink(link, currPage, linkPage, landmark) {
  let comparator =
    landmark === 1 || landmark === 2
      ? currPage <= landmark
      : currPage >= landmark;
  switch (comparator) {
    case true:
      link.removeAttribute("href");
      link.parentElement.setAttribute("hidden", "hidden");
      break;
    case false:
      link.href = `#page${linkPage}`;
      link.parentElement.removeAttribute("hidden");
      break;
  }
}
