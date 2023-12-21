import { appendPgBaseData } from "./page-data.js";

window.addEventListener('hashchange', (evt) => {
  const page = evt.newURL.split('#')[1].slice(4);
  // coz currPage may not be same as page
  const currPage = appendPgBaseData(page, JSON.parse(window.sessionStorage.getItem("baseData")));
  const pgTitle = `Page ${currPage} - Where in the World?`;
  document.title = pgTitle;
  document.getElementById('title-announcer').textContent = pgTitle;
  window.scrollTo(0, 0);
  document.querySelector('.content').focus();
});