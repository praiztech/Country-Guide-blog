"use strict";
(function() {
  try {
    const page = decodeURIComponent(location.hash.slice(1));
    if (page === '') {
      document.title = 'Where in the World?';
    } else {
      switch (location.pathname) { //parent page
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
  } catch (error) {
    document.title = 'Where in the World?';
  }
})();
