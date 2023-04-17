"use strict";
(function() {
  const page = decodeURIComponent(location.hash.slice(1));
  if (page === '') {
    document.title = 'Where in the World?';
  } else {
    const parentPage = location.pathname;
    switch (parentPage) {
      case '/404.html':
        document.title = 'Page Not Found - Where in the World?';
        break;
      case '/details.html':
        const prefix = (
          page.split(' ').map(
            (word) => ['and', 'of', 'the'].includes(word) ? word : `${word[0].toUpperCase() + word.slice(1)}`
            ).join(' ')
        );
        document.title = `${prefix} - Where in the World?`;
        break;
      default: //index.html
        document.title = `Page ${page.slice(4)} - Where in the World?`;
        break;
    }
  }
})();
