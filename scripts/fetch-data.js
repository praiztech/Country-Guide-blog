"use strict";

(async () => {
  let fetchDetails = {
    data: {}
  };
  try {
    switch (location.pathname) {
      case '/details.html':
        await fetchCountryData(fetchDetails);
        fetchDetails.path = 'details';
        break;
      default: //homepage
        // prevent base data fetch when browser is refreshed or a different page is loaded in the same session
        if (sessionStorage.getItem("baseData") === null) await fetchBaseData(fetchDetails);
        fetchDetails.path = 'home';
        break;
    }
    fetchDetails.status = 'success';
  } catch (err) {
    fetchDetails.status = err.message;
    console.log(err);
  } finally { // notify relevant page of data fetch completion
    if (document.readyState !== "complete") { // page still loading
      document.addEventListener("readystatechange", (evt) => {
        evt.target.readyState === "complete" && dispatchFetchEvent(fetchDetails);
      });
    } else {
      dispatchFetchEvent(fetchDetails);
    }
  }
})();

async function fetchBaseData(fetchDetails) {
  const response = await fetch('https://restcountries.com/v3.1/independent?status=true&fields=name,altSpellings,flags,cca3');
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const data = await response.json();
  const collator = Intl.Collator('ro', {sensitivity: 'base'});
  data.sort((a, b) => collator.compare(a.name.common, b.name.common));
  fetchDetails.data.base = data;
}

async function fetchCountryData(fetchDetails) {
  // base data reqd 2 display country data so fetch base data if country page is accessed directly
  // say, from a bookmark
  if (sessionStorage.getItem("baseData") === null) fetchBaseData(fetchDetails);

  const country = decodeURIComponent(location.hash.slice(1));
  const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  fetchDetails.data.country = await response.json();
}

function dispatchFetchEvent(fetchDetails) {
  document.querySelector(".content").dispatchEvent(
    new CustomEvent('fetch', {detail: fetchDetails})
  );
}
