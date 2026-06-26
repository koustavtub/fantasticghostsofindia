import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

function preloadDimensions(gallery: HTMLElement): void {
  gallery.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    if (link.dataset.pswpWidth && link.dataset.pswpHeight) return;

    const img = new Image();
    img.onload = () => {
      link.dataset.pswpWidth = String(img.naturalWidth);
      link.dataset.pswpHeight = String(img.naturalHeight);
    };
    img.src = link.href;
  });
}

export function initPhotoSwipeGalleries(): void {
  document.querySelectorAll<HTMLElement>('[data-pswp-gallery]').forEach((gallery) => {
    if (gallery.dataset.pswpInitialized === 'true') return;
    gallery.dataset.pswpInitialized = 'true';

    preloadDimensions(gallery);

    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: 'a',
      pswpModule: () => import('photoswipe'),
      showHideAnimationType: 'zoom',
      bgOpacity: 0.92,
      padding: { top: 48, bottom: 80, left: 16, right: 16 },
      wheelToZoom: true,
      pinchToClose: true,
      closeOnVerticalDrag: true,
      imageClickAction: 'zoom',
      tapAction: 'toggle-controls',
    });

    lightbox.addFilter('domItemData', (itemData, index, element) => {
      const link = element as HTMLAnchorElement;
      const w = link.dataset.pswpWidth;
      const h = link.dataset.pswpHeight;

      if (w && h) {
        itemData.w = parseInt(w, 10);
        itemData.h = parseInt(h, 10);
      }

      const alt = link.dataset.pswpAlt;
      if (alt) {
        itemData.alt = alt;
      }

      return itemData;
    });

    lightbox.init();
  });
}

if (typeof document !== 'undefined') {
  initPhotoSwipeGalleries();
  document.addEventListener('astro:page-load', initPhotoSwipeGalleries);
}
