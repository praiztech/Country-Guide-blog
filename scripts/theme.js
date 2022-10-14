(function syncWidget2DefaultTheme() {
  //check if dark mode is activated as OS/UA preference
  let defaultTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.getElementById(defaultTheme).click(); //synchronises theme widget with OS/UA preference
})();

document.querySelector('.theme-widget').addEventListener('change', () => {
  let newTheme = document.querySelector('input[name="theme"]:checked').value;
  document.documentElement.setAttribute('data-theme', newTheme);
});
