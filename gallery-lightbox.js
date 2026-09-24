(() => {
  const tiles = Array.from(document.querySelectorAll('.gallery-tile'));
  const lightbox = document.querySelector('.lightbox');
  if (!tiles.length || !lightbox) return;

  const image = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-previous');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  let lastFocusedElement;

  const showImage = (index) => {
    currentIndex = (index + tiles.length) % tiles.length;
    const source = tiles[currentIndex].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    caption.textContent = `${currentIndex + 1} / ${tiles.length}`;
  };

  const openLightbox = (index) => {
    lastFocusedElement = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  tiles.forEach((tile, index) => {
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', `Open image ${index + 1} of ${tiles.length}`);
    tile.addEventListener('click', () => openLightbox(index));
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();
