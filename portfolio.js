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

const filterBar = document.getElementById('project-filters');
const filterButtons = [...filterBar.querySelectorAll('[data-project-filter]')];
const projects = [...document.querySelectorAll('[data-project-topics]')];
const projectCount = document.getElementById('project-count');

function filterProjects(topic) {
  let visible = 0;
  for (const project of projects) {
    project.hidden = topic !== 'all' && !project.dataset.projectTopics.split(' ').includes(topic);
    if (!project.hidden) visible++;
  }
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.projectFilter === topic));
  }
  projectCount.textContent = `${visible} of ${projects.length} projects`;
}

function revealLinkedProject(hash) {
  const target = document.getElementById(hash.slice(1));
  if (target?.closest('[data-project-topics]')?.hidden) {
    filterProjects('all');
    return target;
  }
}

for (const button of filterButtons) {
  button.addEventListener('click', () => filterProjects(button.dataset.projectFilter));
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && !event.defaultPrevented && !event.altKey &&
      !event.ctrlKey && !event.metaKey && !event.shiftKey) {
    revealLinkedProject(link.hash);
  }
});

window.addEventListener('hashchange', () => revealLinkedProject(window.location.hash)?.scrollIntoView());

filterProjects('all');
filterBar.hidden = false;
