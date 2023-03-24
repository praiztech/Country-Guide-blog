insertErrorTxt();
window.addEventListener('hashchange', insertErrorTxt);

function insertErrorTxt() {
  const errorMsg = document.getElementById('error-msg');
  errorMsg.lastElementChild.textContent = defineErrorText(location.hash.slice(1));
  errorMsg.removeAttribute('hidden'); //ensures svg is only visible ffg text insertion
}

function defineErrorText(error) {
  switch (error) {
    case 'novalueerror':
      return `No search value was provided. Enter a country's name to search.`;
    case 'invalidvalueerror':
      return `Your search did not produce any results. Please ensure that the searched country is an independent 
      sovereign nation and its name is spelled correctly.`;
  }
}

document.querySelector('.content').removeAttribute('hidden'); // displays page
