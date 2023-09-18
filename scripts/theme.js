const themeToggleButton = document.querySelector('button.theme-toggle');

//checks if dark mode is activated as OS/UA preference
const defaultThemeIsDark = matchMedia('(prefers-color-scheme: dark)').matches;
//synchronises screen reader output with default theme widget appearance
themeToggleButton.setAttribute('aria-pressed', defaultThemeIsDark);

themeToggleButton.addEventListener('click', (evt) => { // flip theme
  const target = evt.currentTarget;
  const newThemeIsDark = !(target.getAttribute('aria-pressed') === 'true');
  target.setAttribute('aria-pressed', newThemeIsDark);
  document.documentElement.setAttribute('data-theme', newThemeIsDark ? 'dark' : 'light');
});
