/**
 * Mega Dropdown Navigation — script.js
 *
 * Behavior matches Vercel:
 * - Opens on mouse HOVER (with a small delay to prevent flicker)
 * - Stays open while hovering either the trigger OR the dropdown panel
 * - Closes when moving to a different nav item, clicking outside, or pressing Escape
 * - Switches instantly between open dropdowns (no re-animation delay)
 */

(function () {
  const items = document.querySelectorAll('.has-dropdown');
  const backdrop = document.getElementById('nav-backdrop');

  let closeTimer = null;
  let currentOpen = null;

  // ── Open a specific dropdown ──
  function openDropdown(item) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (currentOpen && currentOpen !== item) {
      // Instant switch — no animation delay between items
      currentOpen.classList.remove('open');
    }

    currentOpen = item;
    item.classList.add('open');
    item.querySelector('.nav-btn').setAttribute('aria-expanded', 'true');
    backdrop.classList.add('visible');
  }

  // ── Schedule close (delayed to allow moving into dropdown panel) ──
  function scheduleClose() {
    closeTimer = setTimeout(() => {
      closeAll();
    }, 120);
  }

  // ── Close all dropdowns ──
  function closeAll() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    items.forEach((item) => {
      item.classList.remove('open');
      const btn = item.querySelector('.nav-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    backdrop.classList.remove('visible');
    currentOpen = null;
  }

  // ── Wire up each dropdown item ──
  items.forEach((item) => {
    const btn = item.querySelector('.nav-btn');
    const dropdown = item.querySelector('.mega-dropdown');

    // Hover on trigger button
    btn.addEventListener('mouseenter', () => openDropdown(item));
    btn.addEventListener('mouseleave', scheduleClose);

    // Hover on dropdown panel
    dropdown.addEventListener('mouseenter', () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });
    dropdown.addEventListener('mouseleave', scheduleClose);

    // Click also toggles (for keyboard/touch users)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.classList.contains('open')) {
        closeAll();
      } else {
        openDropdown(item);
      }
    });

    // Prevent clicks inside dropdown from closing it
    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Accessibility
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
  });

  // ── Close on backdrop click ──
  backdrop.addEventListener('click', closeAll);

  // ── Close on outside click ──
  document.addEventListener('click', closeAll);

  // ── Close on Escape key ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
})();
