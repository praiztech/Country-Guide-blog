"use strict";

// prevents base data fetch when browser is refreshed in the same session
if (sessionStorage.getItem("baseData")) return;

(async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/independent?status=true&fields=name,flags');
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const data = await response.json();
        sessionStorage.setItem("baseData", JSON.stringify(data));
    } catch (err) {
        sessionStorage.setItem("baseDataError", err.message);
        console.log(err);
    }
})();

//console.log(JSON.parse(sessionStorage.getItem("baseData")));