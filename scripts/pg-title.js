"use strict";
(function() {
  let page = location.hash.slice(1);
  if (page !== '') {
    let parentPage = location.pathname;
    switch (parentPage) {
      case '/error.html':
        document.title = 'Search Error - Where in the World?';
        break;
      case '/details.html':
        document.title = `${page[0].toUpperCase() + page.slice(1)} - Where in the World?`;
        break;
      default: //index.html
        document.title = `Page ${page.slice(4)} - Where in the World?`;
        break;
    }
  } else {
    document.title = 'Where in the World?';
  }
})();
