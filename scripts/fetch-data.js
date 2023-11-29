"use strict";
(async () => {
    let response = await fetch('https://restcountries.com/v3.1/independent?status=true&fields=name,flags');
    let data = await response.json();
    sessionStorage.setItem("countryData", JSON.stringify(data));
})();
// implement error handling
//console.log(JSON.parse(sessionStorage.getItem("countryData")));