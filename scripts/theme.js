const themeToggleButton = document.querySelector('button.theme-toggle');

//checks if dark mode is activated as OS/UA preference
const defaultTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//synchronises screen reader output with theme widget appearance
themeToggleButton.setAttribute('aria-pressed', defaultTheme === 'dark' ? 'true' : 'false');

themeToggleButton.addEventListener('click', (evt) => { // flip theme
  const target = evt.currentTarget;
  const newThemeIsDark = !(target.getAttribute('aria-pressed') === 'true');
  target.setAttribute('aria-pressed', newThemeIsDark ? 'true' : 'false');
  document.documentElement.setAttribute('data-theme', newThemeIsDark ? 'dark' : 'light');
});
