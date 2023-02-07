//check if dark mode is activated as OS/UA preference
let defaultTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.getElementById(defaultTheme).click(); //synchronise screen reader output with theme widget appearance

document.querySelector('.theme-widget').addEventListener('change', (evt) => {
  let newTheme = evt.target.value;
  document.documentElement.setAttribute('data-theme', newTheme);
});
