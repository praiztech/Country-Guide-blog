import { appendHomepageData } from "./homepage-data.js";

window.addEventListener('hashchange', (evt) => {
  switch (location.pathname) {
    case '/details.html':
      location.reload();
      break;
    default:
      const page = evt.newURL.split('#')[1].slice(4);
      // coz currPage may not be same as page
      const currPage = appendHomepageData(page, JSON.parse(sessionStorage.getItem("baseData")));
      const pgTitle = `Page ${currPage} - Where in the World?`;
      document.title = pgTitle;
      document.getElementById('title-announcer').textContent = pgTitle;
      break;
  }
  window.scrollTo(0, 0);
  document.querySelector('.content').focus();
});
