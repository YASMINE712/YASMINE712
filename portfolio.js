const themeButton = document.getElementById('theme');
const themeColor = document.querySelector('meta[name="theme-color"]');
const storageKey = 'portfolio-color-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeColor.content = isDark ? '#0e1a30' : '#f5f9ff';
}

let storedTheme;
try {
  storedTheme = localStorage.getItem(storageKey);
} catch {
  // The theme still works for this page when storage is unavailable.
}

applyTheme(storedTheme === 'dark' ? 'dark' : 'light');
themeButton.hidden = false;

themeButton.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try {
    localStorage.setItem(storageKey, nextTheme);
  } catch {
    // Keep the selected theme for this page.
  }
});
