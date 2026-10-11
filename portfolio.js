const themeButton = document.getElementById('theme');
const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'light' ? 'Dark theme' : 'Light theme';
  themeButton.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
}

let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));

function textNode(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function tagList(values) {
  return values.map(value => textNode('span', value));
}

function preview(project) {
  const image = document.createElement('img');
  image.src = project.image;
  image.alt = project.alt;
  image.loading = 'lazy';
  Object.assign(image.style, {
    display: 'block', width: '100%', height: '165px', objectFit: 'cover', objectPosition: 'top',
    border: '1px solid var(--line)', borderRadius: '10px', marginBottom: '20px', background: 'var(--bg)'
  });
  return image;
}

function showProject(project) {
  dialogContent.replaceChildren();
  dialogContent.append(textNode('p', project.label, 'eyebrow'), textNode('h2', project.name), textNode('p', project.detail));
  const tags = textNode('div', '', 'tags');
  tags.append(...tagList(project.tags));
  dialogContent.append(tags);
  const links = textNode('div', '', 'actions');
  for (const [href, label] of [[project.url, 'View repository'], [project.demo, 'See screenshots']]) {
    if (!href) continue;
    const link = textNode('a', label, 'button');
    link.href = href;
    links.append(link);
  }
  dialogContent.append(links);
  dialog.showModal();
}

document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

fetch('projects.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load projects');
    return response.json();
  })
  .then(projects => {
    const grid = document.getElementById('project-grid');
    const filters = document.getElementById('filters');
    const categories = [['all', 'All'], ...[...new Set(projects.map(project => project.category))].map(value => [value, value[0].toUpperCase() + value.slice(1)])];
    let active = 'all';

    function render() {
      const visible = projects.filter(project => active === 'all' || project.category === active);
      grid.replaceChildren(...visible.map(project => {
        const card = textNode('article', '', 'project-card');
        const tags = textNode('div', '', 'tags');
        tags.append(...tagList(project.tags));
        const button = textNode('button', 'Explore project');
        button.setAttribute('aria-label', 'Explore ' + project.name);
        button.addEventListener('click', () => showProject(project));
        card.append(preview(project), textNode('p', project.label, 'eyebrow'), textNode('h3', project.name), textNode('p', project.text), tags, button);
        return card;
      }));
      document.getElementById('project-count').textContent = visible.length + ' projects shown';
    }

    for (const [value, label] of categories) {
      const button = textNode('button', label);
      button.type = 'button';
      button.dataset.filter = value;
      button.setAttribute('aria-pressed', String(value === active));
      button.addEventListener('click', () => {
        active = value;
        for (const sibling of filters.querySelectorAll('button')) sibling.setAttribute('aria-pressed', String(sibling === button));
        render();
      });
      filters.append(button);
    }
    render();
  })
  .catch(() => {
    document.getElementById('project-grid').textContent = 'Projects could not load. Please refresh, or use the GitHub profile link below.';
  });
