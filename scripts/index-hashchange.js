import { appendPgBaseData } from "./page-data.js";

window.addEventListener('hashchange', (evt) => {
  const [, pgUrl] = evt.newURL.split('#');
  const page = pgUrl.slice(4);
  const [currPage, ] = appendPgBaseData(page); // coz currPage may not be same as page
  const pgTitle = `Page ${currPage} - Where in the World?`;
  document.title = pgTitle;
  document.getElementById('title-announcer').textContent = pgTitle;
  window.scrollTo(0, 0);
  document.querySelector('.content').focus();
});