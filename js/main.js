/* RAZ — site interactions */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navbar scroll state ---------- */
  var nav = document.getElementById("nav");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");

  function closeMenu() {
    burger.classList.remove("is-open");
    links.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".counter");

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion) { el.textContent = target; return; }

    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.target; });
  }

  /* ---------- Active nav link ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lastFocused = null;

  function openLightbox(src, alt) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    requestAnimationFrame(function () {
      lightbox.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }, 300);
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".gallery__item").forEach(function (item) {
    item.addEventListener("click", function () {
      var img = item.querySelector("img");
      openLightbox(item.dataset.full, img ? img.alt : "");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
