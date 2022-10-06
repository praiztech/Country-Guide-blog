"use strict";
let page = location.hash;
if (page) {
  document.title = (location.pathname.startsWith('/details.html') ?
                    `${page.charAt(1).toUpperCase()}${page.slice(2)} - PRAIZTECH` :
                    `Page ${page.slice(-1)} - Where in the World? - PRAIZTECH`); 
} else {
  document.title = 'Page 1 - Where in the World? - PRAIZTECH';
}