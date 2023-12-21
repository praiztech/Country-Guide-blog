"use strict";

(async () => {
  let fetchDetails = {};
  try {
    if (!sessionStorage.getItem("baseData")) { // prevents base data fetch when browser is refreshed in the same session
      const response = await fetch('https://restcountries.com/v3.1/independent?status=true&fields=name,altSpellings,flags');
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      const collator = Intl.Collator('ro', {sensitivity: 'base'});
      data.sort((a, b) => collator.compare(a.name.common, b.name.common));
      fetchDetails.data = data;
    }
    fetchDetails.status = 'success';
  } catch (err) {
    fetchDetails.status = err.message;
    console.log(err);
  } finally { // notify homepage of data fetch completion
    if (document.readyState !== "complete") { // homepage is still loading
      document.addEventListener("readystatechange", (evt) => {
        evt.target.readyState === "complete" && dispatchFetchEvent(fetchDetails);
      });
    } else {
      dispatchFetchEvent(fetchDetails);
    }
  }
})();

function dispatchFetchEvent(fetchDetails) {
  document.querySelector(".content").dispatchEvent(
    new CustomEvent('fetch', {detail: fetchDetails})
  );
}
