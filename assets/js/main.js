/* ============================================================
   MAIN.JS — shared site behaviour (both pages)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  applyBusinessConfig();
  initHeader();
  initMobileNav();
  initFloatingContact();
  initRevealAnimations();
  initBeforeAfterSliders();
  initReviewsCarousel();
  initHeroShowcase();
  initGalleryFilter();
});

/* ---------- Push config values into the DOM ---------- */
function applyBusinessConfig() {
  if (typeof businessConfig === "undefined") return;

  document.querySelectorAll("[data-cfg-business-name]").forEach(el => el.textContent = businessConfig.businessName);
  document.querySelectorAll("[data-cfg-phone-display]").forEach(el => el.textContent = businessConfig.phoneDisplay);
  document.querySelectorAll("[data-cfg-email]").forEach(el => el.textContent = businessConfig.email);
  document.querySelectorAll("[data-cfg-address]").forEach(el => el.textContent = businessConfig.addressLine + ", " + businessConfig.serviceCity);
  document.querySelectorAll("a[data-cfg-tel]").forEach(el => el.setAttribute("href", "tel:" + businessConfig.phoneRaw));
  document.querySelectorAll("a[data-cfg-mailto]").forEach(el => el.setAttribute("href", "mailto:" + businessConfig.email));

  const waLink = "https://wa.me/" + businessConfig.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(businessConfig.whatsappMessage);
  document.querySelectorAll("a[data-cfg-whatsapp]").forEach(el => el.setAttribute("href", waLink));

  const areaList = document.querySelector("[data-cfg-service-areas]");
  if (areaList) {
    areaList.innerHTML = businessConfig.serviceAreas.map(a => `<li class="area-chip">${a}</li>`).join("");
  }

  const hoursList = document.querySelector("[data-cfg-hours]");
  if (hoursList) {
    hoursList.innerHTML = businessConfig.hours.map(h => `<li><span>${h.day}</span><span>${h.time}</span></li>`).join("");
  }

  document.title = document.title.replace("Free Cleaning Business", businessConfig.businessName);
}

/* ---------- Sticky header shrink-on-scroll ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".hamburger");
  const nav = document.querySelector(".mobile-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Floating WhatsApp + phone buttons ---------- */
function initFloatingContact() {
  const wrap = document.querySelector(".floating-contact");
  if (!wrap || typeof businessConfig === "undefined") return;
  if (!businessConfig.floatingButtons.whatsapp) {
    const btn = wrap.querySelector(".floating-contact__btn--whatsapp");
    if (btn) btn.remove();
  }
  if (!businessConfig.floatingButtons.phone) {
    const btn = wrap.querySelector(".floating-contact__btn--phone");
    if (btn) btn.remove();
  }
}

/* ---------- Fade-up reveal on scroll ---------- */
function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));
}

/* ============================================================
   BEFORE / AFTER SLIDER
   Works with mouse drag, touch, and keyboard (arrow keys).
   Markup expected:
   <div class="ba-slider" tabindex="0" role="slider" ...>
     <div class="ba-slider__after"><img></div>
     <div class="ba-slider__before"><img></div>
     <div class="ba-slider__handle"></div>
     <span class="ba-slider__label ba-slider__label--before">Before</span>
     <span class="ba-slider__label ba-slider__label--after">After</span>
   </div>
   ============================================================ */
class BeforeAfterSlider {
  constructor(el) {
    this.el = el;
    this.before = el.querySelector(".ba-slider__before");
    this.handle = el.querySelector(".ba-slider__handle");
    this.dragging = false;
    this.pos = 50;
    this.bindEvents();
    this.setPosition(50);
  }

  bindEvents() {
    this.el.addEventListener("pointerdown", (e) => {
      this.dragging = true;
      this.onPointer(e, false);
      this.el.setPointerCapture(e.pointerId);
      window.dispatchEvent(new CustomEvent("baSliderInteract"));
    });
    this.el.addEventListener("pointermove", (e) => { if (this.dragging) this.onPointer(e, false); });
    this.el.addEventListener("pointerup", () => { this.dragging = false; });
    this.el.addEventListener("pointerleave", () => { this.dragging = false; });

    this.el.setAttribute("tabindex", this.el.getAttribute("tabindex") || "0");
    this.el.setAttribute("role", "slider");
    this.el.setAttribute("aria-label", "Drag to compare before and after");
    this.el.setAttribute("aria-valuemin", "0");
    this.el.setAttribute("aria-valuemax", "100");
    this.el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { this.setPosition(this.pos - 5); window.dispatchEvent(new CustomEvent("baSliderInteract")); }
      if (e.key === "ArrowRight") { this.setPosition(this.pos + 5); window.dispatchEvent(new CustomEvent("baSliderInteract")); }
    });
  }

  onPointer(e, fromAuto) {
    const rect = this.el.getBoundingClientRect();
    const x = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    this.setPosition(pct);
  }

  setPosition(pct) {
    this.pos = Math.min(100, Math.max(0, pct));
    this.before.style.width = this.pos + "%";
    this.handle.style.left = this.pos + "%";
    const img = this.before.querySelector("img");
    if (img) img.style.setProperty("--ba-img-width", (this.el.clientWidth) + "px");
    this.el.setAttribute("aria-valuenow", Math.round(this.pos));
  }
}

function initBeforeAfterSliders() {
  document.querySelectorAll(".ba-slider").forEach(el => new BeforeAfterSlider(el));
}

/* ---------- Reviews carousel ---------- */
function initReviewsCarousel() {
  const track = document.querySelector(".reviews-track");
  const prevBtn = document.querySelector("[data-reviews-prev]");
  const nextBtn = document.querySelector("[data-reviews-next]");
  if (!track) return;

  let index = 0;
  let autoplay;
  const cardWidth = () => track.querySelector(".review-card").offsetWidth + 24;
  const maxIndex = () => Math.max(0, track.children.length - Math.floor(track.parentElement.offsetWidth / cardWidth()));

  function go(i) {
    index = Math.min(Math.max(0, i), maxIndex());
    track.style.transform = `translateX(-${index * cardWidth()}px)`;
  }
  function next() { go(index >= maxIndex() ? 0 : index + 1); }
  function prev() { go(index <= 0 ? maxIndex() : index - 1); }

  nextBtn && nextBtn.addEventListener("click", () => { next(); resetAutoplay(); });
  prevBtn && prevBtn.addEventListener("click", () => { prev(); resetAutoplay(); });

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplay = setInterval(next, 6000);
  }
  function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }
  track.addEventListener("pointerdown", () => clearInterval(autoplay));
  track.addEventListener("pointerup", resetAutoplay);

  startAutoplay();
  window.addEventListener("resize", () => go(0));
}

/* ---------- Page 2 hero: rotating before/after showcase ---------- */
function initHeroShowcase() {
  const showcase = document.querySelector("[data-hero-showcase]");
  if (!showcase) return;

  const projects = JSON.parse(showcase.dataset.heroShowcase);
  const sliderEl = showcase.querySelector(".ba-slider");
  const caption = document.querySelector("[data-hero-caption]");
  const dotsWrap = document.querySelector("[data-hero-dots]");
  let current = 0;
  let rotateTimer;
  let paused = false;

  const slider = new BeforeAfterSlider(sliderEl);
  const beforeImg = sliderEl.querySelector(".ba-slider__before img");
  const afterImg = sliderEl.querySelector(".ba-slider__after img");

  function render(i) {
    current = i;
    const p = projects[i];
    beforeImg.src = p.before;
    beforeImg.alt = p.name + " before cleaning";
    afterImg.src = p.after;
    afterImg.alt = p.name + " after cleaning";
    if (caption) caption.textContent = p.name;
    slider.setPosition(50);
    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((b, idx) => b.classList.toggle("is-active", idx === i));
    }
  }

  if (dotsWrap) {
    dotsWrap.innerHTML = projects.map((_, i) => `<button aria-label="Show project ${i + 1}"></button>`).join("");
    dotsWrap.querySelectorAll("button").forEach((btn, i) => btn.addEventListener("click", () => { render(i); resetRotation(); }));
  }

  function rotate() { if (!paused) render((current + 1) % projects.length); }
  function startRotation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    rotateTimer = setInterval(rotate, 6000);
  }
  function resetRotation() { clearInterval(rotateTimer); startRotation(); }

  window.addEventListener("baSliderInteract", () => {
    paused = true;
    clearInterval(rotateTimer);
    setTimeout(() => { paused = false; startRotation(); }, 8000);
  });

  render(0);
  startRotation();
}

/* ---------- Page 2 gallery filter ---------- */
function initGalleryFilter() {
  const bar = document.querySelector(".filter-bar");
  const items = document.querySelectorAll(".gallery-item");
  if (!bar || !items.length) return;

  bar.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    bar.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const category = chip.dataset.filter;
    items.forEach(item => {
      const match = category === "all" || item.dataset.category === category;
      item.classList.toggle("is-hidden", !match);
    });
  });
}
