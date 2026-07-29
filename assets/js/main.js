document.documentElement.classList.add('js');

const btn = document.querySelector('.mobile-toggle');
const links = document.querySelector('.nav-links');

function closeMenu() {
  if (!btn || !links) return;
  links.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

if (btn && links) {
  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      btn.focus();
    }
  });
}

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}


// Gallery lightbox: full-size diagrams with keyboard and touch-friendly navigation.
const galleryLinks = Array.from(document.querySelectorAll('.gallery-open'));
const galleryLightbox = document.getElementById('gallery-lightbox');

if (galleryLinks.length && galleryLightbox) {
  const lightboxImage = document.getElementById('gallery-lightbox-image');
  const lightboxTitle = document.getElementById('gallery-lightbox-title');
  const lightboxDescription = document.getElementById('gallery-lightbox-description');
  const lightboxCount = document.getElementById('gallery-lightbox-count');
  const closeButtons = galleryLightbox.querySelectorAll('[data-lightbox-close]');
  const previousButton = galleryLightbox.querySelector('[data-lightbox-prev]');
  const nextButton = galleryLightbox.querySelector('[data-lightbox-next]');
  let currentIndex = 0;
  let returnFocus = null;

  function renderGalleryItem(index) {
    currentIndex = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentIndex];
    lightboxImage.src = link.getAttribute('href');
    lightboxImage.alt = link.dataset.alt || link.querySelector('img')?.alt || '';
    lightboxTitle.textContent = link.dataset.title || link.querySelector('h3')?.textContent || '';
    lightboxDescription.textContent = link.dataset.description || link.querySelector('p')?.textContent || '';
    lightboxCount.textContent = `${currentIndex + 1} of ${galleryLinks.length}`;
  }

  function openGallery(index, trigger) {
    returnFocus = trigger;
    renderGalleryItem(index);
    galleryLightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    requestAnimationFrame(() => galleryLightbox.querySelector('.gallery-lightbox-close')?.focus());
  }

  function closeGallery() {
    galleryLightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    returnFocus?.focus();
  }

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openGallery(index, link);
    });
  });

  closeButtons.forEach(button => button.addEventListener('click', closeGallery));
  previousButton?.addEventListener('click', () => renderGalleryItem(currentIndex - 1));
  nextButton?.addEventListener('click', () => renderGalleryItem(currentIndex + 1));

  document.addEventListener('keydown', event => {
    if (galleryLightbox.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') renderGalleryItem(currentIndex - 1);
    if (event.key === 'ArrowRight') renderGalleryItem(currentIndex + 1);
    if (event.key === 'Tab') {
      const focusable = Array.from(galleryLightbox.querySelectorAll('button:not([disabled]),a[href]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
