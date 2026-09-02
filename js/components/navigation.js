/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
import { throttle } from "../utilities/throttle.js";

export function initStickyHeader() {
  const header = document.getElementById("header");
  const hero = document.querySelector(".hero");

  if (!header) return;
  if (!hero) return;

  const updateHeroPadding = () => {
    hero.style.paddingTop = `${header.offsetHeight}px`;
  };

  window.addEventListener("load", updateHeroPadding);

  // Use throttled version for scroll performance
  const throttledUpdate = throttle(updateHeroPadding, 100);

  const obs = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;

      header.classList.toggle("sticky", !entry.isIntersecting);
      if (!entry.isIntersecting) {
        header.style.background = "#fff";
        header.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      } else {
        header.style.background = "transparent";
        header.style.boxShadow = "none";
      }
      if (!entry.isIntersecting) throttledUpdate();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    },
  );

  obs.observe(hero);
}

export function initNavScroll() {
  const sectionToNavHash = {
    "health-cta": "#health-cta",
    featured: "#health-cta",
    "about-cta": "#about-cta",
    "services-cta": "#services-cta",
    "how-it-works-cta": "#how-it-works-cta",
    "pricing-cta": "#services-cta",
    "testimonials-cta": "#testimonials-cta",
    "faq-cta": "#faq-cta",
    "consultation-cta": "#consultation-cta",
    "final-cta": "#final-cta",
    "contact-cta": "#consultation-cta",
  };

  const sections = Array.from(document.querySelectorAll("section[id]")).filter(
    (s) => Object.prototype.hasOwnProperty.call(sectionToNavHash, s.id),
  );

  const navLinks = document.querySelectorAll(
    '#navbarSupportedContent a[href^="#"]:not([href="#"]), #offcanvasNavbar a[href^="#"]:not([href="#"])',
  );

  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!linkMap[href]) linkMap[href] = [];
    linkMap[href].push(link);
  });

  const getScrollAnchorPx = () => {
    const header = document.getElementById("header");
    const h = header ? header.offsetHeight : 0;
    return h + 24;
  };

  const updateActiveNav = () => {
    const anchorPx = getScrollAnchorPx();
    const docEl = document.documentElement;
    const scrollBottom = window.innerHeight + window.scrollY;

    let activeHash = "#health-cta";

    const atBottom = scrollBottom >= docEl.scrollHeight - 2;
    if (atBottom) {
      activeHash = "#consultation-cta";
    } else {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchorPx) {
          activeHash = sectionToNavHash[section.id] || activeHash;
        }
      }
    }

    if (window.innerWidth > 768) {
      history.replaceState(null, null, activeHash);
    }

    navLinks.forEach((l) => l.classList.remove("active"));
    const group = linkMap[activeHash];
    if (group) {
      group.forEach((l) => l.classList.add("active"));
    }
  };

  const throttledUpdate = throttle(updateActiveNav, 50);
  window.addEventListener("scroll", throttledUpdate, { passive: true });
  window.addEventListener("resize", throttledUpdate);
  updateActiveNav();
}

export function initMobileMenu() {
  const toggler = document.querySelector("[data-nav-toggle]");
  const offcanvas = document.getElementById("offcanvasNavbar");
  const header = document.getElementById("header");

  if (!toggler || !offcanvas) return;

  let isOpen = false;
  let isClosing = false;
  let closeFallback = null;

  const offcanvasLinks = offcanvas.querySelectorAll(
    'a[href^="#"]:not([href="#"])',
  );

  const setTogglerOpen = (open) => {
    toggler.classList.toggle("opened", open);
    toggler.setAttribute("aria-expanded", open ? "true" : "false");
    toggler.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Toggle navigation",
    );
  };

  const finishClose = () => {
    offcanvas.classList.remove("is-closing");
    isClosing = false;
    header?.classList.remove("mobile-nav__open");
    document.dispatchEvent(new CustomEvent("mobilenav:close"));
  };

  const open = () => {
    if (isOpen || isClosing) return;

    isOpen = true;
    offcanvas.classList.remove("is-closing");
    offcanvas.classList.add("show");
    header?.classList.add("mobile-nav__open");
    setTogglerOpen(true);
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new CustomEvent("mobilenav:open"));
  };

  const close = () => {
    if (!isOpen || isClosing) return;

    isClosing = true;
    isOpen = false;

    // Morph toggler back to burger immediately, before panel slide-out starts.
    setTogglerOpen(false);
    document.body.style.overflow = "";

    offcanvas.classList.remove("show");
    offcanvas.classList.add("is-closing");

    const onCloseEnd = (event) => {
      if (event && event.propertyName !== "transform") return;
      offcanvas.removeEventListener("transitionend", onCloseEnd);
      if (closeFallback) clearTimeout(closeFallback);
      finishClose();
    };

    closeFallback = setTimeout(() => onCloseEnd(null), 1100);
    offcanvas.addEventListener("transitionend", onCloseEnd);
  };

  const toggle = () => {
    if (isOpen) close();
    else open();
  };

  toggler.addEventListener("click", toggle);

  offcanvasLinks.forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      close();
    }
  });
}
