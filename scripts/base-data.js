"use strict";

(async () => {
  let message;
  try {
    if (!sessionStorage.getItem("baseData")) { // prevents base data fetch when browser is refreshed in the same session
      const response = await fetch('https://restcountries.com/v3.1/independent?status=true&fields=name,flags');
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      const collator = Intl.Collator('ro', {sensitivity: 'base'});
      data.sort((a, b) => collator.compare(a.name.common, b.name.common));
      sessionStorage.setItem("baseData", JSON.stringify(data));
    }
    message = 'success';
  } catch (err) {
    message = err.message;
    console.log(err);
  } finally { // notify homepage of data fetch completion
    if (document.readyState !== "complete") { // homepage is still loading
      document.addEventListener("readystatechange", (evt) => {
        evt.target.readyState === "complete" && dispatchFetchEvent(message);
      });
    } else {
      dispatchFetchEvent(message);
    }
  }
})();

function dispatchFetchEvent(message) {
  document.querySelector(".content").dispatchEvent(
    new CustomEvent('fetch', {detail: message})
  );
}
