import { appendHomepageData } from "./homepage-data.js";

window.addEventListener("hashchange", (evt) => {
  const [parentPath, pagePath] = evt.newURL.split("#");
  switch (parentPath.includes("/details.html")) {
    case true:
      location.reload();
      break;
    case false:
      // pagePath can be '' when navigating from a later/country page to first 'homepage' page
      const page = pagePath === "" ? 1 : pagePath.slice(4);
      // coz currPage may not be same as page
      const currPage = appendHomepageData(
        page,
        JSON.parse(sessionStorage.getItem("baseData"))
      );
      const pageTitle = `Page ${currPage} - Where in the World?`;
      document.title = pageTitle;
      document.getElementById("title-announcer").textContent = pageTitle;
      break;
  }
  window.scrollTo(0, 0);
  document.querySelector(".content").focus();
});
