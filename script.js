function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const navItems = tabs.querySelectorAll('.tabs__nav-item');
    const panels = tabs.querySelectorAll('.tabs__panel');
    const indicator = tabs.querySelector('.tabs__indicator');

    const moveIndicator = (item) => {
      if (!indicator) return;
      indicator.style.width = `${item.offsetWidth}px`;
      indicator.style.transform = `translateX(${item.offsetLeft}px)`;
    };

    const activate = (item) => {
      navItems.forEach((navItem) => {
        navItem.classList.remove('is-active');
        navItem.setAttribute('aria-selected', 'false');
      });
      item.classList.add('is-active');
      item.setAttribute('aria-selected', 'true');

      const target = item.dataset.tabTarget;
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.tabPanel === target);
      });

      moveIndicator(item);
    };

    navItems.forEach((item) => {
      item.addEventListener('click', () => activate(item));
    });

    const initial = tabs.querySelector('.tabs__nav-item.is-active') || navItems[0];
    if (initial) moveIndicator(initial);

    window.addEventListener('resize', () => {
      const active = tabs.querySelector('.tabs__nav-item.is-active');
      if (active) moveIndicator(active);
    });
  });
}

function initSlideshows() {
  document.querySelectorAll('[data-slideshow]').forEach((slideshow) => {
    const track = slideshow.querySelector('.slideshow__track');
    const slides = Array.from(slideshow.querySelectorAll('.slideshow__slide'));
    const dots = Array.from(slideshow.querySelectorAll('.slideshow__dot'));
    const prevBtn = slideshow.querySelector('[data-slide-prev]');
    const nextBtn = slideshow.querySelector('[data-slide-next]');
    const isSlideVariant = slideshow.classList.contains('slideshow--slide');
    let current = 0;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
      if (isSlideVariant && track) {
        track.style.transform = `translateX(-${current * 100}%)`;
      }
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    goTo(0);
  });
}

function initAccordions() {
  document.querySelectorAll('[data-accordion] .accordion__header').forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion__item');
      const panel = item.querySelector('.accordion__panel');
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        panel.style.maxHeight = '0px';
        item.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initOverlayPanels() {
  const panels = document.querySelectorAll('[data-panel]');

  const openPanel = (id) => {
    const panel = document.querySelector(`[data-panel="${id}"]`);
    if (panel) panel.classList.add('is-open');
  };

  const closePanel = (panel) => {
    panel.classList.remove('is-open');
  };

  document.querySelectorAll('[data-panel-open]').forEach((btn) => {
    btn.addEventListener('click', () => openPanel(btn.dataset.panelOpen));
  });

  document.querySelectorAll('[data-panel-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('[data-panel]');
      if (panel) closePanel(panel);
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener('click', (event) => {
      if (event.target === panel) closePanel(panel);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    panels.forEach((panel) => {
      if (panel.classList.contains('is-open')) closePanel(panel);
    });
  });
}

function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown__toggle');
    const items = dropdown.querySelectorAll('.dropdown__item a');

    const close = () => {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      dropdown.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdown.classList.contains('is-open') ? close() : open();
    });

    items.forEach((item) => item.addEventListener('click', close));

    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  });
}

function initHeroSwiper() {
  const el = document.querySelector('.lp-hero__swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper(el, {
    effect: 'fade',
    fadeEffect: { crossFade: true },
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    speed: 1000,
    allowTouchMove: false,
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress__bar');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initStaggerText() {
  const targets = document.querySelectorAll('[data-stagger]');
  if (!targets.length) return;

  targets.forEach((el) => {
    const chars = Array.from(el.textContent);
    el.textContent = '';
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'stagger-text__char';
      span.style.setProperty('--char-delay', `${i * 0.04}s`);
      span.textContent = char === ' ' ? ' ' : char;
      el.appendChild(span);
    });
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  targets.forEach((el) => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => observer.observe(el));
}

function initLineDraw() {
  const groups = document.querySelectorAll('.line-draw');
  if (!groups.length) return;

  groups.forEach((group) => {
    const path = group.querySelector('path');
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  });

  if (!('IntersectionObserver' in window)) {
    groups.forEach((group) => {
      const path = group.querySelector('path');
      if (path) path.style.strokeDashoffset = '0';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const path = entry.target.querySelector('path');
      if (path) path.style.strokeDashoffset = '0';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  groups.forEach((group) => observer.observe(group));
}

function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  let ticking = false;
  const update = () => {
    elements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  };

  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initScrollZoom() {
  const wrapper = document.querySelector('[data-scrollzoom]');
  if (!wrapper) return;
  const img = wrapper.querySelector('img');

  let ticking = false;
  const update = () => {
    const rect = wrapper.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    const scale = 0.6 + progress * 0.9;
    img.style.transform = `scale(${scale})`;
    ticking = false;
  };

  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initHorizontalScroll() {
  const wrapper = document.querySelector('[data-hscroll]');
  if (!wrapper) return;
  const track = wrapper.querySelector('.hscroll__track');

  let ticking = false;
  const update = () => {
    const rect = wrapper.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    const maxScroll = Math.max(track.scrollWidth - window.innerWidth, 0);
    track.style.transform = `translateX(-${progress * maxScroll}px)`;
    ticking = false;
  };

  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSlideshows();
  initAccordions();
  initOverlayPanels();
  initDropdowns();
  initHeroSwiper();
  initScrollReveal();
  initScrollProgress();
  initStaggerText();
  initCounters();
  initLineDraw();
  initParallax();
  initScrollZoom();
  initHorizontalScroll();
});
