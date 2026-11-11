(() => {
  const dialog = document.createElement('dialog');
  const imageLinks = document.querySelectorAll('article a.image-link');
  if (typeof dialog.showModal !== 'function' || imageLinks.length === 0) return;

  dialog.className = 'gallery-dialog';
  dialog.setAttribute('aria-labelledby', 'gallery-dialog-title');
  dialog.innerHTML = `
    <div class="gallery-dialog-header">
      <h2 class="gallery-dialog-title" id="gallery-dialog-title"></h2>
      <button class="gallery-dialog-close" type="button" autofocus>Close</button>
    </div>
    <figure class="gallery-dialog-figure">
      <img class="gallery-dialog-image" alt="" decoding="async">
      <figcaption class="gallery-dialog-caption"></figcaption>
    </figure>
    <div class="gallery-dialog-footer">
      <div class="gallery-dialog-controls">
        <button class="gallery-dialog-step" type="button" aria-label="Previous image">Previous</button>
        <span class="gallery-dialog-position" role="status"></span>
        <button class="gallery-dialog-step" type="button" aria-label="Next image">Next</button>
      </div>
      <a class="gallery-dialog-original" target="_blank" rel="noopener"
         aria-label="Open original image in a new tab">Open original</a>
    </div>`;
  document.body.append(dialog);

  const title = dialog.querySelector('.gallery-dialog-title');
  const close = dialog.querySelector('.gallery-dialog-close');
  const image = dialog.querySelector('.gallery-dialog-image');
  const caption = dialog.querySelector('.gallery-dialog-caption');
  const position = dialog.querySelector('.gallery-dialog-position');
  const original = dialog.querySelector('.gallery-dialog-original');
  const [previous, next] = dialog.querySelectorAll('.gallery-dialog-step');

  let gallery = [];
  let index = 0;
  let trigger;

  function showImage(newIndex) {
    index = (newIndex + gallery.length) % gallery.length;
    const link = gallery[index];
    const thumbnail = link.querySelector('img');
    const description = link.closest('figure')?.querySelector('figcaption')?.textContent.trim();

    image.alt = thumbnail?.alt || '';
    image.src = link.href;
    caption.textContent = description || image.alt;
    position.textContent = `Image ${index + 1} of ${gallery.length}`;
    original.href = link.href;
  }

  for (const link of imageLinks) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.altKey ||
          event.ctrlKey || event.metaKey || event.shiftKey) return;

      const project = link.closest('article');
      const projectName = project.dataset.galleryTitle || project.querySelector('.kicker')?.textContent.split(' / ')[0].trim();
      title.textContent = projectName ? `${projectName} gallery` : 'Project gallery';
      gallery = [...project.querySelectorAll('a.image-link')];
      previous.hidden = next.hidden = gallery.length < 2;
      trigger = link;
      showImage(gallery.indexOf(link));
      dialog.showModal();
      event.preventDefault();
    });
  }

  close.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => showImage(index - 1));
  next.addEventListener('click', () => showImage(index + 1));

  dialog.addEventListener('keydown', event => {
    if (gallery.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft') previous.click();
    else if (event.key === 'ArrowRight') next.click();
    else return;
    event.preventDefault();
  });

  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
  });

  dialog.addEventListener('close', () => {
    trigger?.focus({ preventScroll: true });
  });
})();
