"use strict";

// prevents base data fetch when browser is refreshed in the same session
if (sessionStorage.getItem("baseData")) return;

(async () => {
  let message;
  try {
    const response = await fetch('https://restcountries.com/v3.1/independent?status=true&fields=name,flags');
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    sessionStorage.setItem("baseData", JSON.stringify(data));
    message = 'success';
  } catch (err) {
    message = err.message;
    console.log(err);
  } finally { // notify homepage of data fetch completion
    setTimeout(() => document.getElementById("content").dispatchEvent(
      new CustomEvent('fetch', {detail: message})
      ), 0);
  }
})();

//console.log(JSON.parse(sessionStorage.getItem("baseData")));